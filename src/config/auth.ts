declare const process: {
  env: {
    GOOGLE_IOS_CLIENT_ID?: string;
    GOOGLE_ANDROID_CLIENT_ID?: string;
    GOOGLE_WEB_CLIENT_ID?: string;
    GOOGLE_MOBILE_REDIRECT_URI?: string;
    GOOGLE_WEB_REDIRECT_URI?: string;
    USE_MOCK_AUTH?: string;
  };
};

const GOOGLE_IOS_CLIENT_ID =
  process.env.GOOGLE_IOS_CLIENT_ID ||
  "450802810743-tsbm60e76qu5355e63sd5un3f3k60gd5.apps.googleusercontent.com";
const GOOGLE_ANDROID_CLIENT_ID =
  process.env.GOOGLE_ANDROID_CLIENT_ID ||
  "450802810743-tsbm60e76qu5355e63sd5un3f3k60gd5.apps.googleusercontent.com";
const GOOGLE_WEB_CLIENT_ID =
  process.env.GOOGLE_WEB_CLIENT_ID ||
  "450802810743-gctsqre0bl1f0rvvpr5rlerti80thn7q.apps.googleusercontent.com";
const GOOGLE_MOBILE_REDIRECT_URI =
  process.env.GOOGLE_MOBILE_REDIRECT_URI || "mygallery://oauth";
const GOOGLE_WEB_REDIRECT_URI =
  process.env.GOOGLE_WEB_REDIRECT_URI || "http://localhost:19006/oauth";
const ENV_USE_MOCK_AUTH = process.env.USE_MOCK_AUTH || "false";

// Google OAuth Configuration
export const GOOGLE_OAUTH_CONFIG = {
  ios: {
    clientId: GOOGLE_IOS_CLIENT_ID,
    redirectUri: GOOGLE_MOBILE_REDIRECT_URI,
  },
  android: {
    clientId: GOOGLE_ANDROID_CLIENT_ID,
    redirectUri: GOOGLE_MOBILE_REDIRECT_URI,
  },
  web: {
    clientId: GOOGLE_WEB_CLIENT_ID,
    redirectUri: GOOGLE_WEB_REDIRECT_URI,
  },
};

export const USE_MOCK_AUTH = ENV_USE_MOCK_AUTH === "true";
