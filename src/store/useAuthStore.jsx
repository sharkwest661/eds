// src/store/useAuthStore.jsx
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  verifyAuthentication,
  login,
  logout,
} from "../services/auth/authService";
import config from "../config/appConfig";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Auth state
      isAuthenticated: false,
      isAuthenticating: false,
      user: null,
      error: null,
      initTokenLoading: true,
      token: null, // Store the token here

      // Initialize authentication state
      initAuth: async () => {
        set({ initTokenLoading: true });

        // First check if we have a token in storage
        const currentState = get();
        const hasToken = !!currentState.token;

        // If we already have authentication info, use it
        if (hasToken && currentState.isAuthenticated) {
          console.log("Using persisted authentication state");
          set({ initTokenLoading: false });
          return true;
        }

        // Otherwise try to verify with the server
        try {
          const authenticated = await verifyAuthentication();
          set({
            isAuthenticated: authenticated,
            initTokenLoading: false,
          });
          return authenticated;
        } catch (error) {
          console.error("Failed to verify authentication", error);

          // Critical change: don't override isAuthenticated if we have a token
          // This prevents logout on network/API errors
          if (hasToken) {
            console.log(
              "Keeping persisted auth state despite verification error"
            );
            set({ initTokenLoading: false });
            return true;
          } else {
            set({
              isAuthenticated: false,
              initTokenLoading: false,
              error: "Authentication verification failed",
            });
            return false;
          }
        }
      },

      // Login action
      login: async (credentials) => {
        set({ isAuthenticating: true, error: null });
        try {
          const response = await login(credentials);

          // Check if the response indicates a successful login
          if (!response.data || response.data.answer === false) {
            // Login failed - extract error message or use a default
            const errorMessage =
              response.data?.message || "Invalid username or password";
            set({
              isAuthenticated: false,
              isAuthenticating: false,
              error: errorMessage,
            });
            return {
              success: false,
              error: errorMessage,
            };
          }

          // Login successful - save token and user data
          const userData = response.data;
          const token = userData.token || null; // Extract token from response

          set({
            isAuthenticated: true,
            isAuthenticating: false,
            user: userData,
            token: token, // Store the token
            error: null,
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
          await logout();

          // Always reset authentication state regardless of API response
          set({
            isAuthenticated: false,
            user: null,
            error: null,
            token: null, // Clear token
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
      setToken: (value) =>
        set({
          token: value,
          isAuthenticated: !!value,
        }),
      removeToken: async () => {
        await get().logout();
        set({ token: null });
      },
    }),
    {
      name: "auth-storage", // Name for the localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
      partialize: (state) => ({
        // Only persist these fields
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
);
