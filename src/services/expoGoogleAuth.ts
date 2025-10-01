import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { User } from "../types";
import { GOOGLE_OAUTH_CONFIG, USE_MOCK_AUTH } from "../config/auth";

WebBrowser.maybeCompleteAuthSession();

export class ExpoGoogleAuth {
  private static instance: ExpoGoogleAuth;
  private user: User | null = null;

  static getInstance(): ExpoGoogleAuth {
    if (!ExpoGoogleAuth.instance) {
      ExpoGoogleAuth.instance = new ExpoGoogleAuth();
    }
    return ExpoGoogleAuth.instance;
  }

  async signInWithGoogle(): Promise<User> {
    try {
      if (USE_MOCK_AUTH) {
        console.log("Using mock authentication for development");
        const mockUser: User = {
          id: "dev-user-123",
          name: "Development User",
          email: "dev@example.com",
          picture: "https://via.placeholder.com/150",
        };

        this.user = mockUser;
        await this.saveUser(mockUser);
        return mockUser;
      }

      console.log("Starting Expo Google Sign-In...");

      let clientId: string;
      let redirectUri: string;

      if (Platform.OS === "web") {
        clientId = GOOGLE_OAUTH_CONFIG.web.clientId;
        redirectUri = GOOGLE_OAUTH_CONFIG.web.redirectUri;
      } else if (Platform.OS === "ios") {
        clientId = GOOGLE_OAUTH_CONFIG.ios.clientId;
        redirectUri = GOOGLE_OAUTH_CONFIG.ios.redirectUri;
      } else {
        // Android
        clientId = GOOGLE_OAUTH_CONFIG.android.clientId;
        redirectUri = GOOGLE_OAUTH_CONFIG.android.redirectUri;
      }

      if (Platform.OS !== "web") {
        redirectUri = AuthSession.makeRedirectUri({
          scheme: "mygallery",
          path: "oauth",
        });
      }

      console.log("Auth Debug:", {
        platform: Platform.OS,
        clientId: clientId,
        redirectUri: redirectUri,
        isDev: __DEV__,
      });

      const request = new AuthSession.AuthRequest({
        clientId: clientId,
        scopes: ["openid", "profile", "email"],
        redirectUri: redirectUri,
        responseType: AuthSession.ResponseType.Code,
        usePKCE: true,
        extraParams: {},
        prompt: AuthSession.Prompt.SelectAccount,
      });

      console.log("Starting auth request...");
      const result = await request.promptAsync(
        {
          authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
          tokenEndpoint: "https://oauth2.googleapis.com/token",
          revocationEndpoint: "https://oauth2.googleapis.com/revoke",
        } as AuthSession.DiscoveryDocument,
        {
          showInRecents: false,
        }
      );

      console.log("Auth result:", result);

      if (result.type === "success" && result.params.code) {
        console.log("Authorization successful, exchanging code for token...");
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId: clientId,
            code: result.params.code,
            redirectUri: redirectUri,
            extraParams: {
              code_verifier: request.codeVerifier || "",
            },
          },
          {
            tokenEndpoint: "https://oauth2.googleapis.com/token",
          }
        );

        console.log("Token exchange successful");

        if (!tokenResult.accessToken) {
          throw new Error("No access token received from Google");
        }

        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResult.accessToken}`,
          {
            headers: {
              Authorization: `Bearer ${tokenResult.accessToken}`,
            },
          }
        );

        if (!userInfoResponse.ok) {
          const errorText = await userInfoResponse.text();
          console.error("User info fetch failed:", errorText);
          throw new Error(
            `Failed to fetch user info: ${userInfoResponse.status} - ${errorText}`
          );
        }

        const userInfo = await userInfoResponse.json();
        console.log("User info received:", userInfo);

        if (!userInfo.id || !userInfo.email) {
          throw new Error("Invalid user info received from Google");
        }

        const user: User = {
          id: userInfo.id,
          name: userInfo.name || userInfo.email.split("@")[0],
          email: userInfo.email,
          picture:
            userInfo.picture ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              userInfo.name || userInfo.email
            )}&background=random`,
        };

        this.user = user;
        await this.saveUser(user);
        console.log("User saved successfully");
        return user;
      } else if (result.type === "error") {
        const errorMessage = `${result.error?.code || "UNKNOWN"}: ${
          result.error?.description || "Authentication failed"
        }`;
        console.error("OAuth error:", errorMessage);
        throw new Error(errorMessage);
      } else {
        throw new Error("Authentication was cancelled by user");
      }
    } catch (error: any) {
      console.error("Expo Google Sign-In Error:", error);

      let userMessage = "Authentication failed. Please try again.";
      if (error?.message?.includes("cancelled")) {
        userMessage = "Authentication was cancelled.";
      } else if (error?.message?.includes("network")) {
        userMessage =
          "Network error. Please check your connection and try again.";
      } else if (error?.message?.includes("400")) {
        userMessage = "Configuration error. Please contact support.";
      }

      throw new Error(userMessage);
    }
  }

  async signOut(): Promise<void> {
    try {
      this.user = null;
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      if (this.user) {
        return this.user;
      }

      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        this.user = JSON.parse(userData);
        return this.user;
      }
      return null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  private async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Save user error:", error);
      throw error;
    }
  }
}
