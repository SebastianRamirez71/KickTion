import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, KickUser } from '../types';
import { supabase } from '../lib/supabase';
import { KICK_CONFIG } from '../config/kick';
import { kickService } from '../services/kickService';
import { 
  generateCodeVerifier, 
  generateCodeChallenge, 
  generateState,
  getStoredTokens,
  clearStoredTokens 
} from '../utils/auth';

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

  // Token refresh effect
  useEffect(() => {
    if (user && getStoredTokens().tokenExpiry) {
      const tokenExpiry = Number(getStoredTokens().tokenExpiry);
      const timeToRefresh = tokenExpiry - Date.now() - (5 * 60 * 1000);

      const refreshTimer = setTimeout(() => {
        const { refreshToken } = getStoredTokens();
        if (refreshToken) {
          kickService.refreshToken(refreshToken)
            .then(() => checkKickSession())
            .catch(console.error);
        }
      }, Math.max(1000, timeToRefresh));

      return () => clearTimeout(refreshTimer);
    }
  }, [user]);

  const checkKickSession = async () => {
    try {
      const { accessToken, refreshToken, tokenExpiry } = getStoredTokens();
      
      // Verificar si el token está expirado
      if (accessToken && tokenExpiry) {
        const expiryTime = Number(tokenExpiry);
        if (Date.now() >= expiryTime) {
          if (refreshToken) {
            await kickService.refreshToken(refreshToken);
          } else {
            clearStoredTokens();
            setUser(null);
            setIsLoading(false);
            return;
          }
        }
      }

      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      const kickUser = await kickService.getUserData(accessToken);
      let newUserData;
      console.log("Kick user: ", kickUser)
      
      // Buscar usuario existente
      const { data: existingUser, error: queryError } = await supabase
        .from('users')
        .select('*')
        .eq('kick_id', kickUser.data[0].user_id)
        .single();

      if (queryError && queryError.code !== 'PGRST116') { // PGRST116 es el código para "no se encontraron registros"
        console.error('Error querying user:', queryError);
        throw queryError;
      }

      console.log('Existing user:', existingUser);

      if (!existingUser) {
        // Crear nuevo usuario en Supabase
        const { data, error } = await supabase
          .from('users')
          .insert([
            {
              kick_id: kickUser.data[0].user_id,
              email: kickUser.data[0].email,
              username: kickUser.data[0].name,
              is_stremear: false,
              is_moderator: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (error) {
          console.error('Error creating user:', error);
          throw error;
        }
        newUserData = data;
      }

      const transformedUser: User = {
        id: existingUser?.id || newUserData?.id,
        kick_id: kickUser.data[0].user_id,
        email: kickUser.data[0].email,
        username: kickUser.data[0].name,
        updated_at: new Date(),
        created_at: new Date(),
        is_stremear: existingUser?.is_stremear || false,
        is_moderator: existingUser?.is_moderator || false
      };
      console.log("User logeado: ", transformedUser.email)
      setUser(transformedUser);
    } catch (error) {
      console.error('Error checking KICK session:', error);
      clearStoredTokens();
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

      localStorage.setItem('kick_state', state);
      localStorage.setItem('kick_code_verifier', codeVerifier);

      const authUrl = new URL(KICK_CONFIG.authEndpoint);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('client_id', KICK_CONFIG.clientId);
      authUrl.searchParams.append('redirect_uri', KICK_CONFIG.redirectUri);
      authUrl.searchParams.append('scope', KICK_CONFIG.scope);
      authUrl.searchParams.append('code_challenge', codeChallenge);
      authUrl.searchParams.append('code_challenge_method', 'S256');
      authUrl.searchParams.append('state', state);

      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('Error logging in with KICK:', error);
      throw error;
    }
  };

  const handleAuthCallback = async (code: string, state: string) => {
    try {
      setIsLoading(true);
      
      const storedState = localStorage.getItem('kick_state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }
      
      const codeVerifier = localStorage.getItem('kick_code_verifier');
      if (!codeVerifier) {
        throw new Error('Code verifier not found');
      }

      await kickService.exchangeCodeForToken(code, codeVerifier);
      await checkKickSession();
    } catch (error) {
      console.error('Error handling auth callback:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { accessToken } = getStoredTokens();
      
      if (accessToken) {
        await kickService.revokeToken(accessToken);
      }
      
      clearStoredTokens();
      setUser(null);
      setIsLoading(false); // Asegurar que el estado de carga se resetea
    } catch (error) {
      console.error('Error logging out:', error);
      setIsLoading(false); // Asegurar que el estado de carga se resetea incluso en caso de error
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