import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getExams,
  getExamDetail,
  getExamQuestions,
  getTopTopics,
} from "../api/apiService";

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
 * Hook to fetch top topics
 * @returns {Object} Query result object with data, loading state, and error
 */
export function useTopTopics() {
  return useQuery({
    queryKey: examKeys.topTopics(),
    queryFn: async () => {
      try {
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
    retry: false, // Disable automatic retries for auth errors
  });
}

/**
 * Hook to fetch exams with filters
 * @param {Object} filters - Filter criteria for exams
 * @param {Object} options - Additional query options
 * @returns {Object} Query result object with data, loading state, and error
 */
export function useExams(filters, options = {}) {
  return useQuery({
    queryKey: examKeys.list(filters),
    queryFn: async () => {
      try {
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
    retry: false, // Disable automatic retries for this query
    ...options,
  });
}

/**
 * Hook to fetch exam details
 * @param {string|number} id - Exam ID
 * @returns {Object} Query result object with data, loading state, and error
 */
export function useExamDetail(id) {
  return useQuery({
    queryKey: examKeys.detail(id),
    queryFn: async () => {
      const response = await getExamDetail(id);
      return response.data;
    },
    enabled: !!id, // Only run the query if id exists
  });
}

/**
 * Hook to fetch exam questions
 * @param {string|number} id - Exam ID
 * @returns {Object} Query result object with data, loading state, and error
 */
export function useExamQuestions(id) {
  return useQuery({
    queryKey: examKeys.question(id),
    queryFn: async () => {
      try {
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
    enabled: !!id, // Only run the query if id exists
    retry: false, // Disable automatic retries for this query
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
