import { createContext } from "preact";
import { useState, useEffect, useContext } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { authService } from "../services/auth.js";

export interface User {
  id: string;
  name: string;
  email: string;
  theme?: string;
  avatar?: string;
}

interface AuthResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

interface LoginResponse extends AuthResponse {
  isFirstLogin?: boolean;
  themeAutoUpdated?: boolean;
  data?: {
    user: User;
    is_first_login?: boolean;
    [key: string]: any;
  };
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signup: (name: string, email: string, password: string) => Promise<AuthResponse>;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  confirmEmail: (token: string) => Promise<AuthResponse>;
  resendConfirmation: (email: string) => Promise<AuthResponse>;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  resetPassword: (token: string, password: string) => Promise<AuthResponse>;
  updateName: (name: string) => Promise<AuthResponse<User>>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<AuthResponse>;
  updateTheme: (theme: string) => Promise<AuthResponse<User>>;
  updateAvatar: (avatar: string) => Promise<AuthResponse<User>>;
  removeAvatar: () => Promise<AuthResponse<User>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ComponentChildren;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = authService.getUser();
    if (storedUser) {
      setUser(storedUser);
      if (storedUser.theme) {
        document.documentElement.setAttribute("data-theme", storedUser.theme);
        localStorage.setItem("theme", storedUser.theme);
      }
    }
    setLoading(false);
  }, []);

  const signup = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const data = await authService.signup(name, email, password);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const data = await authService.login(email, password);
      let currentUser = data.user;

      let themeAutoUpdated = false;

      if (!currentUser.theme) {
        const isSystemDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        const systemTheme = isSystemDark ? "apispider-dark" : "apispider-light";

        const updateResult = await updateTheme(systemTheme);
        if (updateResult.success && updateResult.data) {
          currentUser = updateResult.data;
          themeAutoUpdated = true;
        }
      }

      setUser(currentUser);

      const isFirstLogin = !!data.is_first_login;

      return {
        success: true,
        isFirstLogin,
        themeAutoUpdated,
        data: { ...data, user: currentUser },
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const logout = (): void => {
    authService.logout();

    const isSystemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const systemTheme = isSystemDark ? "apispider-dark" : "apispider-light";

    document.documentElement.setAttribute("data-theme", systemTheme);
    localStorage.setItem("theme", systemTheme);

    setUser(null);
  };

  const confirmEmail = async (token: string): Promise<AuthResponse> => {
    try {
      const data = await authService.confirmEmail(token);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const resendConfirmation = async (email: string): Promise<AuthResponse> => {
    try {
      const data = await authService.resendConfirmation(email);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const forgotPassword = async (email: string): Promise<AuthResponse> => {
    try {
      const data = await authService.forgotPassword(email);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const resetPassword = async (token: string, password: string): Promise<AuthResponse> => {
    try {
      const data = await authService.resetPassword(token, password);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const updateName = async (name: string): Promise<AuthResponse<User>> => {
    try {
      const data = await authService.updateName(name);
      setUser(data);
      if (data.theme) {
        document.documentElement.setAttribute("data-theme", data.theme);
        localStorage.setItem("theme", data.theme);
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<AuthResponse> => {
    try {
      const data = await authService.updatePassword(
        currentPassword,
        newPassword,
      );
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const updateTheme = async (theme: string): Promise<AuthResponse<User>> => {
    try {
      const data = await authService.updateTheme(theme);
      setUser(data);
      document.documentElement.setAttribute("data-theme", data.theme);
      localStorage.setItem("theme", data.theme);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const updateAvatar = async (avatar: string): Promise<AuthResponse<User>> => {
    try {
      const data = await authService.updateAvatar(avatar);
      setUser(data);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const removeAvatar = async (): Promise<AuthResponse<User>> => {
    try {
      const data = await authService.removeAvatar();
      setUser(data);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signup,
    login,
    logout,
    confirmEmail,
    resendConfirmation,
    forgotPassword,
    resetPassword,
    updateName,
    updatePassword,
    updateTheme,
    updateAvatar,
    removeAvatar,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};