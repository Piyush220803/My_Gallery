import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useNavigation } from '@react-navigation/native';
import { AuthScreen } from '../screens/AuthScreen';
import { GalleryScreen } from '../screens/GalleryScreen';
import { AddImageScreen } from '../screens/AddImageScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AddImageButton } from '../components/AddImageButton';
import { RootStackParamList, MainTabParamList, GalleryStackParamList } from '../types';

const RootStack = createStackNavigator<RootStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const GalleryStack = createStackNavigator<GalleryStackParamList>();

const GalleryStackNavigator = () => {
  const { theme } = useTheme();

  return (
    <GalleryStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <GalleryStack.Screen
        name="GalleryList"
        component={GalleryScreen}
        options={{
          title: 'My Gallery',
        }}
      />
      <GalleryStack.Screen
        name="AddImage"
        component={AddImageScreen}
        options={{
          title: 'Add Image',
        }}
      />
    </GalleryStack.Navigator>
  );
};

const MainTabNavigator = () => {
  const { theme } = useTheme();

  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Gallery') {
            iconName = focused ? 'images' : 'images-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        headerShown: false,
      })}
    >
      <MainTab.Screen
        name="Gallery"
        component={GalleryStackNavigator}
        options={{
          title: 'Gallery',
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
    </MainTab.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; 
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
