import { Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { GOOGLE_OAUTH_CONFIG } from '../config/auth';

export interface AuthDebugInfo {
  platform: string;
  clientId: string;
  redirectUri: string;
  generatedRedirectUri: string;
  isDev: boolean;
  hasClientId: boolean;
  hasRedirectUri: boolean;
  configValid: boolean;
}

export const getAuthDebugInfo = (): AuthDebugInfo => {
  let clientId = '';
  let redirectUri = '';

  if (Platform.OS === 'web') {
    clientId = GOOGLE_OAUTH_CONFIG.web.clientId;
    redirectUri = GOOGLE_OAUTH_CONFIG.web.redirectUri;
  } else if (Platform.OS === 'ios') {
    clientId = GOOGLE_OAUTH_CONFIG.ios.clientId;
    redirectUri = GOOGLE_OAUTH_CONFIG.ios.redirectUri;
  } else {
    clientId = GOOGLE_OAUTH_CONFIG.android.clientId;
    redirectUri = GOOGLE_OAUTH_CONFIG.android.redirectUri;
  }

  const generatedRedirectUri = AuthSession.makeRedirectUri({
    scheme: 'mygallery',
    path: 'oauth',
  });

  return {
    platform: Platform.OS,
    clientId,
    redirectUri,
    generatedRedirectUri,
    isDev: __DEV__,
    hasClientId: !!clientId,
    hasRedirectUri: !!redirectUri,
    configValid: !!(clientId && redirectUri),
  };
};

export const logAuthDebugInfo = (): void => {
  const debugInfo = getAuthDebugInfo();
  
  console.log('=== AUTH DEBUG INFO ===');
  console.log('Platform:', debugInfo.platform);
  console.log('Client ID:', debugInfo.clientId);
  console.log('Redirect URI:', debugInfo.redirectUri);
  console.log('Generated Redirect URI:', debugInfo.generatedRedirectUri);
  console.log('Is Development:', debugInfo.isDev);
  console.log('Has Client ID:', debugInfo.hasClientId);
  console.log('Has Redirect URI:', debugInfo.hasRedirectUri);
  console.log('Config Valid:', debugInfo.configValid);
  console.log('========================');
};

export const validateAuthConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const debugInfo = getAuthDebugInfo();

  // iOS is optional, so only validate if it's the current platform
  if (debugInfo.platform === 'ios' && !debugInfo.hasClientId) {
    errors.push(`Missing client ID for platform: ${debugInfo.platform}`);
  } else if (debugInfo.platform !== 'ios' && !debugInfo.hasClientId) {
    errors.push(`Missing client ID for platform: ${debugInfo.platform}`);
  }

  if (!debugInfo.hasRedirectUri) {
    errors.push(`Missing redirect URI for platform: ${debugInfo.platform}`);
  }

  if (debugInfo.clientId && !debugInfo.clientId.includes('.apps.googleusercontent.com')) {
    errors.push('Client ID does not appear to be a valid Google OAuth client ID');
  }

  if (debugInfo.redirectUri && !debugInfo.redirectUri.includes('://')) {
    errors.push('Redirect URI does not appear to be a valid URI');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
