import { create } from "zustand";
import {
  verifyAuthentication,
  login,
  logout,
} from "../services/auth/authService";
import config from "../config/appConfig";

export const useAuthStore = create((set, get) => ({
  // Auth state
  isAuthenticated: false,
  isAuthenticating: false,
  user: null,
  error: null,
  initTokenLoading: true,

  // Initialize authentication state
  initAuth: async () => {
    set({ initTokenLoading: true });
    try {
      const authenticated = await verifyAuthentication();
      set({
        isAuthenticated: authenticated,
        initTokenLoading: false,
      });
      return authenticated;
    } catch (error) {
      console.error("Failed to verify authentication", error);
      set({
        isAuthenticated: false,
        initTokenLoading: false,
        error: "Authentication verification failed",
      });
      return false;
    }
  },

  // Login action
  login: async (credentials) => {
    set({ isAuthenticating: true, error: null });
    try {
      const response = await login(credentials);
      const userData = response.data;

      set({
        isAuthenticated: true,
        isAuthenticating: false,
        user: userData,
      });

      return { success: true, data: userData };
    } catch (error) {
      set({
        isAuthenticated: false,
        isAuthenticating: false,
        error: error.response?.data?.message || "Login failed",
      });
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  },

  // Logout action
  logout: async () => {
    try {
      const response = await logout();

      // Always reset authentication state regardless of API response
      set({
        isAuthenticated: false,
        user: null,
        error: null,
        token: null, // Clear legacy token too
      });

      // Clear localStorage if we were using the legacy approach
      if (localStorage.getItem(config.auth.tokenStorageKey)) {
        localStorage.removeItem(config.auth.tokenStorageKey);
      }

      return true;
    } catch (error) {
      console.error("Logout error:", error);

      // Even if there's an error, reset auth state
      set({
        isAuthenticated: false,
        user: null,
        error: null,
        token: null,
      });

      // Clear localStorage if we were using the legacy approach
      if (localStorage.getItem(config.auth.tokenStorageKey)) {
        localStorage.removeItem(config.auth.tokenStorageKey);
      }

      return true; // Return success anyway since we've logged out locally
    }
  },

  // Backward compatibility with old code (to be removed after migration)
  token: null,
  setToken: (value) =>
    set({
      token: value,
      isAuthenticated: !!value,
    }),
  removeToken: async () => {
    await get().logout();
    set({ token: null });
  },
}));
