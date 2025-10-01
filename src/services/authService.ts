import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";

WebBrowser.maybeCompleteAuthSession();

export class AuthService {
  private static instance: AuthService;
  private user: User | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signIn(): Promise<User> {
    console.log("Generic signIn called - using mock authentication");

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockUsers = [
      {
        id: "mock-user-123",
        name: "John Doe",
        email: "john.doe@example.com",
        picture:
          "https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff&size=150",
      },
      {
        id: "mock-user-456",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        picture:
          "https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff&size=150",
      },
      {
        id: "mock-user-789",
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        picture:
          "https://ui-avatars.com/api/?name=Alex+Johnson&background=f59e0b&color=fff&size=150",
      },
    ];

    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];

    this.user = randomUser;
    await this.saveUser(randomUser);
    console.log("Mock user signed in successfully:", randomUser);
    return randomUser;
  }

  async signInWithGoogle(): Promise<User> {
    try {
      // For now, always use mock auth
      console.log("SignInWithGoogle called - redirecting to mock auth");
      return this.signIn();
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      console.error("Error details:", {
        message: error?.message,
        code: error?.code,
        stack: error?.stack,
        type: error?.type,
        params: error?.params,
      });

      if (error?.message && error.message.includes("400")) {
        console.error("Error 400 - Bad Request. This is usually due to:");
        console.error("1. Invalid client ID");
        console.error("2. Redirect URI mismatch");
        console.error("3. Invalid request parameters");
        console.error("4. Client ID not configured for this platform");
      }

      throw new Error(
        `Google Sign-In failed: ${error?.message || "Unknown error"}`
      );
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
