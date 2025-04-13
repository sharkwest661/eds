import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

/**
 * Custom default query function that adds headers to identify query requests
 * This allows the API interceptors to handle 401 errors differently for queries
 */
const defaultQueryFn = async ({ queryKey }) => {
  const response = await axios.get(queryKey[0], {
    headers: {
      "X-Is-Query-Request": "true",
    },
  });
  return response.data;
};

/**
 * Centralized QueryClient configuration for the application
 * Controls default behavior for all queries
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - how long data is considered fresh
      cacheTime: 1000 * 60 * 30, // 30 minutes - how long inactive data remains in cache
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      retry: 1, // Retry failed requests once
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      useErrorBoundary: (error) => {
        // Use error boundaries for authentication errors
        return error.status === 401 || error.status >= 500;
      },
    },
    mutations: {
      onError: (error) => {
        // Log mutation errors but don't use error boundary
        console.error("Mutation error:", error);
      },
    },
  },
});

export default queryClient;
