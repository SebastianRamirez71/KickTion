import { KICK_CONFIG } from '../config/kick';

export const generateCodeVerifier = (): string => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => 
    String.fromCharCode(byte % 26 + 97)
  ).join('');
};

export const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const generateState = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const getStoredTokens = () => ({
  accessToken: localStorage.getItem('kick_access_token'),
  refreshToken: localStorage.getItem('kick_refresh_token'),
  tokenExpiry: localStorage.getItem('kick_token_expiry'),
});

export const setStoredTokens = (accessToken: string, refreshToken: string, expiresIn: number) => {
  localStorage.setItem('kick_access_token', accessToken);
  localStorage.setItem('kick_refresh_token', refreshToken);
  localStorage.setItem('kick_token_expiry', 
    (Date.now() + (expiresIn * 1000)).toString()
  );
};

export const clearStoredTokens = () => {
  localStorage.removeItem('kick_access_token');
  localStorage.removeItem('kick_refresh_token');
  localStorage.removeItem('kick_token_expiry');
  localStorage.removeItem('kick_state');
  localStorage.removeItem('kick_code_verifier');
}; 