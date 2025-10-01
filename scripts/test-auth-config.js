#!/usr/bin/env node

/**
 * Test script to validate Google OAuth configuration
 * Run with: node scripts/test-auth-config.js
 */

const fs = require('fs');
const path = require('path');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

console.log('🔍 Testing Google OAuth Configuration...\n');

// Check for .env file
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found');
  if (fs.existsSync(envExamplePath)) {
    console.log('💡 Copy .env.example to .env and fill in your values');
  }
  process.exit(1);
}

// Read .env file
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

// Parse .env file
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

// Required environment variables (iOS is optional)
const requiredVars = [
  'GOOGLE_ANDROID_CLIENT_ID', 
  'GOOGLE_WEB_CLIENT_ID',
  'GOOGLE_MOBILE_REDIRECT_URI',
  'GOOGLE_WEB_REDIRECT_URI',
  'USE_MOCK_AUTH'
];

// Optional environment variables
const optionalVars = [
  'GOOGLE_IOS_CLIENT_ID'
];

console.log('📋 Checking required environment variables:');

let allValid = true;

requiredVars.forEach(varName => {
  const value = envVars[varName];
  if (!value) {
    console.log(`❌ ${varName}: Missing`);
    allValid = false;
  } else if (value.includes('your-') || value.includes('placeholder')) {
    console.log(`⚠️  ${varName}: Contains placeholder value`);
    allValid = false;
  } else {
    console.log(`✅ ${varName}: Set`);
  }
});

console.log('\n📋 Checking optional environment variables:');

optionalVars.forEach(varName => {
  const value = envVars[varName];
  if (!value) {
    console.log(`ℹ️  ${varName}: Not set (optional)`);
  } else if (value.includes('your-') || value.includes('placeholder')) {
    console.log(`⚠️  ${varName}: Contains placeholder value (optional)`);
  } else {
    console.log(`✅ ${varName}: Set`);
  }
});

// Validate client ID format
console.log('\n🔐 Validating client ID format:');

// Check required client IDs
['GOOGLE_ANDROID_CLIENT_ID', 'GOOGLE_WEB_CLIENT_ID'].forEach(varName => {
  const value = envVars[varName];
  if (value && !value.includes('.apps.googleusercontent.com')) {
    console.log(`❌ ${varName}: Invalid format (should end with .apps.googleusercontent.com)`);
    allValid = false;
  } else if (value) {
    console.log(`✅ ${varName}: Valid format`);
  }
});

// Check optional iOS client ID
const iosClientId = envVars['GOOGLE_IOS_CLIENT_ID'];
if (iosClientId) {
  if (!iosClientId.includes('.apps.googleusercontent.com')) {
    console.log(`❌ GOOGLE_IOS_CLIENT_ID: Invalid format (should end with .apps.googleusercontent.com)`);
  } else {
    console.log(`✅ GOOGLE_IOS_CLIENT_ID: Valid format`);
  }
} else {
  console.log(`ℹ️  GOOGLE_IOS_CLIENT_ID: Not set (iOS not required)`);
}

// Validate redirect URIs
console.log('\n🔗 Validating redirect URIs:');

const mobileUri = envVars['GOOGLE_MOBILE_REDIRECT_URI'];
const webUri = envVars['GOOGLE_WEB_REDIRECT_URI'];

if (mobileUri && !mobileUri.includes('://')) {
  console.log('❌ GOOGLE_MOBILE_REDIRECT_URI: Invalid format (should be a valid URI)');
  allValid = false;
} else if (mobileUri) {
  console.log('✅ GOOGLE_MOBILE_REDIRECT_URI: Valid format');
}

if (webUri && !webUri.includes('://')) {
  console.log('❌ GOOGLE_WEB_REDIRECT_URI: Invalid format (should be a valid URI)');
  allValid = false;
} else if (webUri) {
  console.log('✅ GOOGLE_WEB_REDIRECT_URI: Valid format');
}

// Check app.json
console.log('\n📱 Checking app.json configuration:');

const appJsonPath = path.join(process.cwd(), 'app.json');
if (fs.existsSync(appJsonPath)) {
  try {
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    
    if (appJson.expo?.scheme !== 'mygallery') {
      console.log('❌ app.json: scheme should be "mygallery"');
      allValid = false;
    } else {
      console.log('✅ app.json: scheme is correct');
    }
    
    if (appJson.expo?.ios?.bundleIdentifier !== 'com.yourcompany.mygallery') {
      console.log('⚠️  app.json: iOS bundle identifier should be "com.yourcompany.mygallery"');
    } else {
      console.log('✅ app.json: iOS bundle identifier is correct');
    }
    
    if (appJson.expo?.android?.package !== 'com.yourcompany.mygallery') {
      console.log('⚠️  app.json: Android package should be "com.yourcompany.mygallery"');
    } else {
      console.log('✅ app.json: Android package is correct');
    }
  } catch (error) {
    console.log('❌ app.json: Invalid JSON format');
    allValid = false;
  }
} else {
  console.log('❌ app.json: File not found');
  allValid = false;
}

// Final result
console.log('\n' + '='.repeat(50));

if (allValid) {
  console.log('🎉 Configuration looks good! You can now test Google OAuth.');
  console.log('\nNext steps:');
  console.log('1. Make sure your Google Cloud Console is configured correctly');
  console.log('2. Run: npm start');
  console.log('3. Test the authentication flow');
} else {
  console.log('❌ Configuration has issues. Please fix them before testing.');
  console.log('\nFor help, see: GOOGLE_OAUTH_SETUP_FIXED.md');
}

console.log('\n💡 Tip: Set USE_MOCK_AUTH=true for development without real Google OAuth');
