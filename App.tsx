import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/hooks/useAuth';
import { GalleryProvider } from './src/hooks/useGallery';
import { ThemeProvider } from './src/hooks/useTheme';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <GalleryProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </GalleryProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
