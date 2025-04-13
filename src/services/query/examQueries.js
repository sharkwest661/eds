// src/services/query/examQueries.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getExams,
  getExamDetail,
  getExamQuestions,
  getTopTopics,
} from "../api/apiService";
import { useAuthStore } from "../../store/useAuthStore";

/**
 * Query keys for exam-related queries
 * Using a structured approach for better cache management and invalidation
 */
export const examKeys = {
  all: ["exams"],
  lists: () => [...examKeys.all, "list"],
  list: (filters) => [...examKeys.lists(), { filters }],
  details: () => [...examKeys.all, "detail"],
  detail: (id) => [...examKeys.details(), id],
  questions: () => [...examKeys.all, "questions"],
  question: (id) => [...examKeys.questions(), id],
  topTopics: () => [...examKeys.all, "topTopics"],
};

/**
 * Validates if the user is authenticated before making API requests
 * @returns {boolean} Authentication status
 */
const validateAuthentication = () => {
  const authStore = useAuthStore.getState();
  if (!authStore.isAuthenticated || !authStore.token) {
    console.warn("User is not authenticated for protected query");
    return false;
  }
  return true;
};

/**
 * Hook to fetch top topics
 * @returns {Object} Query result object with data, loading state, and error
 */
export function useTopTopics() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: examKeys.topTopics(),
    queryFn: async () => {
      try {
        // Validate authentication before making the request
        if (!validateAuthentication()) {
          throw new Error(
            "Authentication required for top topics. Please login and try again."
          );
        }

        const response = await getTopTopics();
        return response.data;
      } catch (error) {
        // Prevent automatic logout for 401 errors in this specific query
        if (error.response?.status === 401) {
          console.error("Authentication error in useTopTopics:", error.message);
          throw new Error(
            "Authentication required for top topics. Please login and try again."
          );
        }
        throw error;
      }
    },
    enabled: isAuthenticated, // Only run if user is authenticated
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (
        error?.message?.includes("Authentication") ||
        error?.response?.status === 401
      ) {
        return false;
      }
      return failureCount < 3; // Retry other errors up to 3 times
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch exams with filters
 * @param {Object} filters - Filter criteria for exams
 * @param {Object} options - Additional query options
 * @returns {Object} Query result object with data, loading state, and error
 */
export function useExams(filters, options = {}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: examKeys.list(filters),
    queryFn: async () => {
      try {
        // Validate authentication before making the request
        if (!validateAuthentication()) {
          throw new Error(
            "Authentication required for exam data. Please login and try again."
          );
        }

        const response = await getExams(filters);
        return response.data;
      } catch (error) {
        // Prevent automatic logout for 401 errors in this specific query
        if (error.response?.status === 401) {
          console.error("Authentication error in useExams:", error.message);
          throw new Error(
            "Authentication required for exam data. Please login and try again."
          );
        }
        throw error;
      }
    },
    enabled: isAuthenticated && options.enabled !== false, // Only run if user is authenticated and not disabled
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (
        error?.message?.includes("Authentication") ||
        error?.response?.status === 401
      ) {
        return false;
      }
      return failureCount < 3; // Retry other errors up to 3 times
    },
    ...options,
  });
}

/**
 * Hook to fetch exam details
 * @param {string|number} id - Exam ID
 * @returns {Object} Query result object with data, loading state, and error
 */
export function useExamDetail(id) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: examKeys.detail(id),
    queryFn: async () => {
      try {
        // Validate authentication before making the request
        if (!validateAuthentication()) {
          throw new Error(
            "Authentication required for exam details. Please login and try again."
          );
        }

        const response = await getExamDetail(id);
        return response.data;
      } catch (error) {
        // Prevent automatic logout for 401 errors
        if (error.response?.status === 401) {
          console.error(
            "Authentication error in useExamDetail:",
            error.message
          );
          throw new Error(
            "Authentication required for exam details. Please login and try again."
          );
        }
        throw error;
      }
    },
    enabled: isAuthenticated && !!id, // Only run if user is authenticated and id exists
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (
        error?.message?.includes("Authentication") ||
        error?.response?.status === 401
      ) {
        return false;
      }
      return failureCount < 3; // Retry other errors up to 3 times
    },
  });
}

/**
 * Hook to fetch exam questions
 * @param {string|number} id - Exam ID
 * @returns {Object} Query result object with data, loading state, and error
 */
export function useExamQuestions(id) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: examKeys.question(id),
    queryFn: async () => {
      try {
        // Validate authentication before making the request
        if (!validateAuthentication()) {
          throw new Error(
            "Authentication required for exam questions. Please login and try again."
          );
        }

        const response = await getExamQuestions(id);
        return response.data;
      } catch (error) {
        // Prevent automatic logout for 401 errors in this specific query
        if (error.response?.status === 401) {
          console.error(
            "Authentication error in useExamQuestions:",
            error.message
          );
          throw new Error(
            "Authentication required for exam questions. Please login and try again."
          );
        }
        throw error;
      }
    },
    enabled: isAuthenticated && !!id, // Only run if user is authenticated and id exists
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (
        error?.message?.includes("Authentication") ||
        error?.response?.status === 401
      ) {
        return false;
      }
      return failureCount < 3; // Retry other errors up to 3 times
    },
  });
}

/**
 * Hook to submit exam answers (mutation example)
 * @returns {Object} Mutation object with mutate function and status
 */
export function useSubmitExamAnswers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      // Validate authentication before making the request
      if (!validateAuthentication()) {
        throw new Error(
          "Authentication required to submit answers. Please login and try again."
        );
      }

      // This would be an actual API call in a real implementation
      // const response = await submitExamAnswers(data);
      // return response.data;

      // Mock implementation for demonstration
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: "Answers submitted successfully" });
        }, 1000);
      });
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries on success
      queryClient.invalidateQueries({
        queryKey: examKeys.detail(variables.examId),
      });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
}

/**
 * Hook to get exam types
 * @returns {Object} Query result with exam types
 */
export function useExamTypes() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["examTypes"],
    queryFn: async () => {
      // This would be a real API call in production
      // const response = await getExamTypes();
      // return response.data;

      // For now, we'll just get it from the companyData in the cache if available
      const companyData = queryClient.getQueryData(["company", "data"]);
      if (companyData?.examTypes) {
        return companyData.examTypes;
      }

      // Otherwise, return some default types
      return ["Final", "Midterm", "Pop Quiz", "Practice"];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
