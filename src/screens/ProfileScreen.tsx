import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useGallery } from '../hooks/useGallery';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const { clearAllData } = useGallery();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your gallery items. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: async () => {
          try {
            await clearAllData();
            Alert.alert('Success', 'All gallery data has been cleared.');
          } catch (error) {
            Alert.alert('Error', 'Failed to clear data. Please try again.');
          }
        }},
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    profileSection: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
      paddingVertical: theme.spacing.xl,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    profileImage: {
      width: Math.min(width * 0.25, 120),
      height: Math.min(width * 0.25, 120),
      borderRadius: Math.min(width * 0.125, 60),
      marginBottom: theme.spacing.lg,
      borderWidth: 4,
      borderColor: theme.colors.primary,
    },
    userName: {
      fontSize: Math.min(width * 0.07, 28),
      fontWeight: '800',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    userEmail: {
      fontSize: Math.min(width * 0.04, 16),
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    settingsSection: {
      marginBottom: -25,
    },
    sectionTitle: {
      fontSize: Math.min(width * 0.05, 20),
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    settingText: {
      fontSize: Math.min(width * 0.04, 16),
      color: theme.colors.text,
      fontWeight: '600',
    },
    toggle: {
      width: 50,
      height: 30,
      borderRadius: 15,
      backgroundColor: isDark ? theme.colors.primary : theme.colors.border,
      justifyContent: 'center',
      alignItems: isDark ? 'flex-end' : 'flex-start',
      paddingHorizontal: 2,
    },
    toggleThumb: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: 'white',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    dangerButton: {
      backgroundColor: theme.colors.error,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      marginTop: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.colors.error,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    dangerButtonText: {
      color: 'white',
      textAlign: 'center',
      fontSize: Math.min(width * 0.04, 16),
      fontWeight: '700',
      marginLeft: theme.spacing.sm,
    },
    signOutButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      marginTop: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    signOutButtonText: {
      color: 'white',
      textAlign: 'center',
      fontSize: Math.min(width * 0.04, 16),
      fontWeight: '700',
      marginLeft: theme.spacing.sm,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <StatusBar barStyle={theme.colors.text === '#F9FAFB' ? 'light-content' : 'dark-content'} />
        <View style={styles.profileSection}>
          <Image source={require('../../assets/logo.webp')} style={styles.profileImage} />
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>


        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Dark Mode</Text>
            <TouchableOpacity style={styles.toggle} onPress={toggleTheme}>
              <View style={styles.toggleThumb} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.dangerButton} onPress={handleClearData} activeOpacity={0.8}>
          <Ionicons name="trash" size={Math.min(width * 0.05, 20)} color="white" />
          <Text style={styles.dangerButtonText}>Clear All Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.8}>
          <Ionicons name="log-out" size={Math.min(width * 0.05, 20)} color="white" />
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
