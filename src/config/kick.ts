export const KICK_CONFIG = {
  clientId: import.meta.env.VITE_KICK_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_KICK_CLIENT_SECRET || '',
  redirectUri: import.meta.env.VITE_KICK_REDIRECT_URI || '',
  authEndpoint: 'https://id.kick.com/oauth/authorize',
  tokenEndpoint: 'https://id.kick.com/oauth/token',
  scope: 'user:read',
  apiBaseUrl: 'https://api.kick.com/public/v1',
} as const; 