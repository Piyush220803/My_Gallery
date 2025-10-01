import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { AuthService } from "../services/authService";
import { User, AuthState } from "../types";

interface AuthContextType extends AuthState {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const authService = AuthService.getInstance();

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const user = await authService.getCurrentUser();
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: user !== null,
      });
    } catch (error) {
      console.error("Check auth state error:", error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const signIn = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const user = await authService.signIn();
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Sign in error:", error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    ...authState,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
