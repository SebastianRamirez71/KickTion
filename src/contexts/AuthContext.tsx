import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, KickUser } from '../types';

// Kick OAuth configuration
const KICK_CONFIG = {
  clientId: import.meta.env.VITE_KICK_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_KICK_CLIENT_SECRET || '',
  redirectUri: import.meta.env.VITE_KICK_REDIRECT_URI || '',
  authEndpoint: 'https://id.kick.com/oauth/authorize',
  tokenEndpoint: 'https://id.kick.com/oauth/token',
  scope: 'user:read', // Add more scopes as needed
  apiBaseUrl: 'https://api.kick.com/public/v1', // Adjust based on actual API base URL
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  handleAuthCallback: (code: string, state: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      checkKickSession();
      setIsInitialized(true);
    }
    
    // Check if we're on the callback URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
      handleAuthCallback(code, state);
      
      // Clean URL parameters after handling callback
      const cleanUrl = window.location.pathname;
      window.history.pushState({}, document.title, cleanUrl);
    }
  }, [isInitialized]);

  // Generate a random string for code verifier
  const generateCodeVerifier = (): string => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => 
      String.fromCharCode(byte % 26 + 97)
    ).join('');
  };

  // Generate code challenge from code verifier using SHA-256
  const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  const generateState = (): string => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  const checkKickSession = async () => {
    try {
      const token = localStorage.getItem('kick_access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      // Fetch user data from Kick API
      const response = await fetch(`${KICK_CONFIG.apiBaseUrl}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const kickUser: KickUser = await response.json();
        // Transform the Kick API response to match our User type
        console.log(kickUser)
        const transformedUser: User = {
          email: kickUser.email,
          username: kickUser.name,
          updated_at: new Date(),
          created_at: new Date(),
        }

        setUser(transformedUser);
      } else {
        // Token might be expired, try to refresh
        const refreshToken = localStorage.getItem('kick_refresh_token');
        if (refreshToken) {
          await refreshAccessToken(refreshToken);
        } else {
          localStorage.removeItem('kick_access_token');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error checking KICK session:', error);
      localStorage.removeItem('kick_access_token');
      localStorage.removeItem('kick_refresh_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const state = generateState();

      // Store values for later verification
      localStorage.setItem('kick_state', state);  
      localStorage.setItem('kick_code_verifier', codeVerifier);

      // Construct the authorization URL
      const authUrl = new URL(KICK_CONFIG.authEndpoint);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('client_id', KICK_CONFIG.clientId);
      authUrl.searchParams.append('redirect_uri', KICK_CONFIG.redirectUri);
      authUrl.searchParams.append('scope', KICK_CONFIG.scope);
      authUrl.searchParams.append('code_challenge', codeChallenge);
      authUrl.searchParams.append('code_challenge_method', 'S256');
      authUrl.searchParams.append('state', state);

      // Redirect to Kick authorization page
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('Error logging in with KICK:', error);
      throw error;
    }
  };

  const handleAuthCallback = async (code: string, state: string) => {
    try {
      setIsLoading(true);
      
      // Verify state matches to prevent CSRF attacks
      const storedState = localStorage.getItem('kick_state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }
      
      const codeVerifier = localStorage.getItem('kick_code_verifier');
      if (!codeVerifier) {
        throw new Error('Code verifier not found');
      }

      // Log the credentials being used (remove in production)
      console.log('Client ID:', KICK_CONFIG.clientId);
      console.log('Redirect URI:', KICK_CONFIG.redirectUri);
      
      // Exchange code for token
      const tokenResponse = await fetch(KICK_CONFIG.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: KICK_CONFIG.clientId,
          client_secret: KICK_CONFIG.clientSecret,
          redirect_uri: KICK_CONFIG.redirectUri,
          code_verifier: codeVerifier,
          code: code
        }).toString()
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        console.error('Token exchange error details:', errorData);
        throw new Error(`Failed to exchange code for token: ${tokenResponse.status} ${JSON.stringify(errorData)}`);
      }

      const tokenData = await tokenResponse.json();
      
      // Store tokens
      localStorage.setItem('kick_access_token', tokenData.access_token);
      if (tokenData.refresh_token) {
        localStorage.setItem('kick_refresh_token', tokenData.refresh_token);
      }
      localStorage.setItem('kick_token_expiry', 
        (Date.now() + (tokenData.expires_in * 1000)).toString());
      
      // Clean up state and code verifier
      localStorage.removeItem('kick_state');
      localStorage.removeItem('kick_code_verifier');
      
      // Fetch user data
      await checkKickSession();
    } catch (error) {
      console.error('Error handling auth callback:', error);
      setIsLoading(false);
      throw error; // Re-throw to handle in the UI
    }
  };

  const refreshAccessToken = async (refreshToken: string) => {
    try {
      const response = await fetch(KICK_CONFIG.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: KICK_CONFIG.clientId,
          client_secret: KICK_CONFIG.clientSecret,
          refresh_token: refreshToken
        })
      });

      if (response.ok) {
        const tokenData = await response.json();
        localStorage.setItem('kick_access_token', tokenData.access_token);
        localStorage.setItem('kick_refresh_token', tokenData.refresh_token);
        localStorage.setItem('kick_token_expiry', 
          (Date.now() + (tokenData.expires_in * 1000)).toString());
          
        await checkKickSession();
      } else {
        // If refresh fails, clear tokens and user
        localStorage.removeItem('kick_access_token');
        localStorage.removeItem('kick_refresh_token');
        localStorage.removeItem('kick_token_expiry');
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      localStorage.removeItem('kick_access_token');
      localStorage.removeItem('kick_refresh_token');
      localStorage.removeItem('kick_token_expiry');
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('kick_access_token');
      
      // Revoke token on Kick's end
      if (token) {
        await fetch('https://id.kick.com/oauth/revoke', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            token,
            token_hint_type: 'access_token'
          })
        });
      }
      
      // Clear local storage
      localStorage.removeItem('kick_access_token');
      localStorage.removeItem('kick_refresh_token');
      localStorage.removeItem('kick_token_expiry');
      localStorage.removeItem('kick_state');
      localStorage.removeItem('kick_code_verifier');
      
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    handleAuthCallback
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}