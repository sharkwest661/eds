// src/services/api/queries/authQueries.js
import apiService from "../apiService";

/**
 * This file contains query key factories and service methods
 * for authentication-related requests that are prepared
 * for future migration to Tanstack Query.
 */

/**
 * Query keys for authentication-related queries
 * Using standard patterns from Tanstack Query documentation
 */
export const authKeys = {
  all: () => ["auth"],
  user: () => [...authKeys.all(), "user"],
  validation: () => [...authKeys.all(), "validation"],
  emailCheck: (email) => [...authKeys.validation(), "email", email],
  usernameCheck: (username) => [...authKeys.validation(), "username", username],
};

/**
 * Check if email is available (not registered)
 * @param {string} email - Email to check
 * @returns {Promise} Promise with availability result
 */
export const checkEmailAvailable = async (email) => {
  if (!email) return null;
  return apiService.auth.checkEmail(email);
};

/**
 * Check if username is available (not registered)
 * @param {string} username - Username to check
 * @returns {Promise} Promise with availability result
 */
export const checkUsernameAvailable = async (username) => {
  if (!username) return null;
  return apiService.auth.checkUsername(username);
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Promise with registration result
 */
export const registerUser = async (userData) => {
  return apiService.auth.addUser(userData);
};

// COMMENT: When migrating to Tanstack Query, conversion would look like this:
/*
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useCheckEmail(email) {
  return useQuery({
    queryKey: authKeys.emailCheck(email),
    queryFn: () => checkEmailAvailable(email),
    enabled: !!email && email.includes('@'), // Only run if valid email
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
}

export function useCheckUsername(username) {
  return useQuery({
    queryKey: authKeys.usernameCheck(username),
    queryFn: () => checkUsernameAvailable(username),
    enabled: !!username && username.length >= 3, // Only run if valid username
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
}

export function useRegisterUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      // Invalidate relevant queries after successful registration
      queryClient.invalidateQueries(authKeys.user());
    },
  });
}
*/
