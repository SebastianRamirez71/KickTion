import { KICK_CONFIG } from '../config/kick';
import { KickUser } from '../types';
import { setStoredTokens } from '../utils/auth';

export const kickService = {
  async getUserData(token: string): Promise<KickUser> {
    const response = await fetch(`${KICK_CONFIG.apiBaseUrl}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    console.log("Response al obt user: ", response)
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    return response.json();
  },

  async exchangeCodeForToken(code: string, codeVerifier: string): Promise<void> {
    const response = await fetch(KICK_CONFIG.tokenEndpoint, {
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to exchange code for token: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const tokenData = await response.json();
    setStoredTokens(tokenData.access_token, tokenData.refresh_token, tokenData.expires_in);
  },

  async refreshToken(refreshToken: string): Promise<void> {
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

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const tokenData = await response.json();
    setStoredTokens(tokenData.access_token, tokenData.refresh_token, tokenData.expires_in);
  },

  async revokeToken(token: string): Promise<void> {
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
}; 