#!/usr/bin/env node

/**
 * Get the exact redirect URI that Expo is generating
 * This helps you configure Google Cloud Console correctly
 */

const { execSync } = require('child_process');

console.log('🔍 Getting Expo redirect URI...\n');

try {
  // Get the current IP address
  const ip = execSync('ipconfig | findstr "IPv4"', { encoding: 'utf8' })
    .split('\n')
    .find(line => line.includes('IPv4'))
    ?.split(':')[1]?.trim();

  if (ip) {
    console.log(`📍 Your IP address: ${ip}`);
    console.log(`🔗 Expected redirect URI: exp://${ip}:8081/-/oauth`);
    console.log(`🔗 Alternative redirect URI: exp://localhost:8081/-/oauth`);
    console.log(`🔗 Alternative redirect URI: exp://127.0.0.1:8081/-/oauth`);
  } else {
    console.log('🔗 Common redirect URIs to add to Google Cloud Console:');
    console.log('   - exp://localhost:8081/-/oauth');
    console.log('   - exp://127.0.0.1:8081/-/oauth');
    console.log('   - exp://192.168.1.20:8081/-/oauth (from your error)');
  }

  console.log('\n📋 Steps to fix:');
  console.log('1. Go to Google Cloud Console > APIs & Services > Credentials');
  console.log('2. Edit your Android OAuth 2.0 Client ID');
  console.log('3. Add the redirect URIs above to "Authorized redirect URIs"');
  console.log('4. Save and try again');

} catch (error) {
  console.log('❌ Could not detect IP address');
  console.log('💡 Use the redirect URIs from your error message:');
  console.log('   exp://192.168.1.20:8081/-/oauth');
}
