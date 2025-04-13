import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  checkEmail,
  checkUsername,
  addUser,
  accessToken,
} from "../api/apiService";
import { login, logout, verifyAuthentication } from "../auth/authService";

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

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await login(credentials);
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate relevant queries after successful login
        queryClient.invalidateQueries({ queryKey: authKeys.user() });

        // Set user data in query cache
        queryClient.setQueryData(authKeys.user(), data.data);
      }
    },
  });
}

/**
 * Hook to log out a user
 * @returns {Object} Mutation object with mutate function and status
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await logout();
      return response;
    },
    onSuccess: () => {
      // Clear user from query cache
      queryClient.setQueryData(authKeys.user(), null);

      // Reset auth-related queries
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
}

/**
 * Hook to get the current authenticated user
 * @returns {Object} Query result object
 */
export function useUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const authenticated = await verifyAuthentication();
      if (!authenticated) {
        return null;
      }
      // In a real implementation, this would fetch user details
      // For now, we just return authenticated status
      return { authenticated };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
