import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { USE_MOCK_AUTH } from "../config/auth";

const { width, height } = Dimensions.get("window");

export const AuthScreen: React.FC = () => {
  const { signIn, isLoading } = useAuth();
  const { theme } = useTheme();

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      Alert.alert("Error", "Failed to sign in. Please try again.");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    gradient: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
    },
    content: {
      alignItems: "center",
      width: "100%",
      maxWidth: Math.min(width * 0.9, 400),
    },
    logo: {
      width: Math.min(width * 0.25, 120),
      height: Math.min(width * 0.25, 120),
      borderRadius: Math.min(width * 0.125, 60),
      backgroundColor: theme.colors.surface,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.xl,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    logoIcon: {
      fontSize: Math.min(width * 0.12, 48),
      color: theme.colors.primary,
    },
    title: {
      fontSize: Math.min(width * 0.09, 36),
      fontWeight: "800",
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: "center",
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: Math.min(width * 0.045, 18),
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xl * 2,
      textAlign: "center",
      lineHeight: Math.min(width * 0.06, 24),
      paddingHorizontal: theme.spacing.md,
    },
    signInButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      minWidth: Math.min(width * 0.7, 280),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    signInButtonText: {
      color: "white",
      fontSize: Math.min(width * 0.045, 18),
      fontWeight: "700",
      textAlign: "center",
      marginLeft: theme.spacing.sm,
    },
    loadingContainer: {
      marginTop: theme.spacing.lg,
    },
    features: {
      marginTop: theme.spacing.xl * 2,
      width: "100%",
    },
    feature: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
    featureIcon: {
      fontSize: Math.min(width * 0.05, 20),
      color: theme.colors.success,
      marginRight: theme.spacing.md,
    },
    featureText: {
      fontSize: Math.min(width * 0.04, 16),
      color: theme.colors.textSecondary,
      flex: 1,
    },
    mockAuthNotice: {
      fontSize: Math.min(width * 0.035, 14),
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
      textAlign: "center",
      fontStyle: "italic",
    },
  });

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
      <StatusBar
        barStyle={
          theme.colors.text === "#F9FAFB" ? "light-content" : "dark-content"
        }
      />
      <LinearGradient
        colors={[theme.colors.background, theme.colors.accent]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logo}>
            <Ionicons name="images" style={styles.logoIcon} />
          </View>

          <Text style={styles.title}>My Gallery</Text>
          <Text style={styles.subtitle}>
            Create, organize, and share your beautiful memories with ease
          </Text>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleSignIn}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Ionicons
              name="person"
              size={Math.min(width * 0.05, 20)}
              color="white"
            />
            <Text style={styles.signInButtonText}>
              {isLoading ? "Signing in..." : "Continue with Mock Auth"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.mockAuthNotice}>
            Using mock authentication for development
          </Text>

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          )}

          <View style={styles.features}>
            <View style={styles.feature}>
              <Ionicons name="camera" style={styles.featureIcon} />
              <Text style={styles.featureText}>
                Capture moments with your camera
              </Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="images" style={styles.featureIcon} />
              <Text style={styles.featureText}>
                Organize your photo collection
              </Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="share" style={styles.featureIcon} />
              <Text style={styles.featureText}>
                Share memories with friends
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};
