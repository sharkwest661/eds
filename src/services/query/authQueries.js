// src/services/query/authQueries.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  checkEmail,
  checkUsername,
  addUser,
  accessToken,
} from "../api/apiService";
import { login, logout, verifyAuthentication } from "../auth/authService";
import { useAuthStore } from "../../store/useAuthStore";

/**
 * Query keys for authentication-related queries
 */
export const authKeys = {
  all: ["auth"],
  user: () => [...authKeys.all, "user"],
  validation: () => [...authKeys.all, "validation"],
  emailCheck: (email) => [...authKeys.validation(), "email", email],
  usernameCheck: (username) => [...authKeys.validation(), "username", username],
};

/**
 * Hook to check if email is available (not registered)
 * @param {string} email - Email to check
 * @returns {Object} Query result object
 */
export function useCheckEmail(email) {
  return useQuery({
    queryKey: authKeys.emailCheck(email),
    queryFn: async () => {
      const response = await checkEmail(email);
      return response.data;
    },
    enabled: !!email && email.includes("@"), // Only run if valid email
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to check if username is available (not registered)
 * @param {string} username - Username to check
 * @returns {Object} Query result object
 */
export function useCheckUsername(username) {
  return useQuery({
    queryKey: authKeys.usernameCheck(username),
    queryFn: async () => {
      const response = await checkUsername(username);
      return response.data;
    },
    enabled: !!username && username.length >= 3, // Only run if valid username
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to register a new user
 * @returns {Object} Mutation object with mutate function and status
 */
export function useRegisterUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData) => {
      const response = await addUser(userData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries after successful registration
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
}

/**
 * Hook to log in a user
 * @returns {Object} Mutation object with mutate function and status
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await login(credentials);
      return response;
    },
    onSuccess: (response) => {
      // Check if login was successful
      if (response.data && response.data.token) {
        // Update auth store
        setToken(response.data.token);

        // Update query cache
        queryClient.invalidateQueries({ queryKey: authKeys.user() });
        queryClient.setQueryData(authKeys.user(), response.data);

        return { success: true, data: response.data };
      }

      // If no token, login failed
      return {
        success: false,
        error: response.data?.message || "Invalid credentials",
      };
    },
  });
}

/**
 * Hook to log out a user
 * @returns {Object} Mutation object with mutate function and status
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const authLogout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      return await logout();
    },
    onSuccess: () => {
      // Clear auth store
      authLogout();

      // Clear query cache
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.invalidateQueries({ queryKey: authKeys.all });

      // Clear exam-related queries
      queryClient.invalidateQueries({ queryKey: ["exams"] });

      return { success: true };
    },
  });
}

/**
 * Hook to get the current authenticated user
 * @returns {Object} Query result object
 */
export function useUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const authenticated = await verifyAuthentication();
      if (!authenticated) {
        return null;
      }

      // If we have user data in the store, use it
      if (user) {
        return user;
      }

      // Otherwise, return basic authenticated status
      return { authenticated };
    },
    initialData: user || null,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
