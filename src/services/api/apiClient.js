// src/services/api/apiClient.js
import axios from "axios";
import { EDU_URL } from "./constants";
import { useAuthStore } from "../../store/useAuthStore";
import config from "../../config/appConfig";

/**
 * Creates a configured axios instance with all necessary interceptors and settings
 * @param {Object} options - Configuration options
 * @returns {Object} Configured axios instance
 */
export const createApiClient = (options = {}) => {
  const defaultOptions = {
    baseURL: config.api.baseUrl || EDU_URL,
    timeout: config.api.timeout || 30000,
    withCredentials: config.api.withCredentials,
    retryLimit: 3,
    retryDelay: 1000,
    retryStatusCodes: [408, 429, 500, 502, 503, 504],
    ...options,
  };

  // Create the axios instance with our configuration
  const client = axios.create({
    baseURL: defaultOptions.baseURL,
    timeout: defaultOptions.timeout,
    withCredentials: defaultOptions.withCredentials,
    headers: {
      "Content-Type": "application/json",
      ...(defaultOptions.headers || {}),
    },
  });

  // Request interceptor for authentication and CSRF tokens
  client.interceptors.request.use(
    (config) => {
      // Add CSRF token if available
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }

      // Add custom tracking
      config.metadata = {
        startTime: new Date().getTime(),
        retryCount: 0,
      };

      return config;
    },
    (error) => {
      // Log request errors in development
      if (config.isDevelopment && config.development.logApiCalls) {
        console.error("API Request Error:", error);
      }
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling and retry logic
  client.interceptors.response.use(
    (response) => {
      // Add response time metadata
      const endTime = new Date().getTime();
      const startTime = response.config.metadata.startTime;
      response.config.metadata.responseTime = endTime - startTime;

      // Log response time in development
      if (config.isDevelopment && config.development.logApiCalls) {
        console.log(
          `API Response time: ${response.config.metadata.responseTime}ms for ${response.config.url}`
        );
      }

      return response;
    },
    async (error) => {
      const { config } = error;

      // If no config is available, reject immediately
      if (!config) {
        return Promise.reject(error);
      }

      // Initialize metadata if not present
      config.metadata = config.metadata || { retryCount: 0 };

      // Check if we should retry the request
      const shouldRetry =
        config.metadata.retryCount < defaultOptions.retryLimit &&
        defaultOptions.retryStatusCodes.includes(error.response?.status);

      // Handle authentication errors (401)
      if (error.response?.status === 401) {
        // Clear auth state on 401 responses
        const authStore = useAuthStore.getState();
        if (authStore.isAuthenticated) {
          await authStore.logout();
          // Only redirect to login if we're not already there
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      }

      // Implement retry logic
      if (shouldRetry) {
        config.metadata.retryCount += 1;

        // Calculate exponential backoff delay
        const delay =
          defaultOptions.retryDelay *
          Math.pow(2, config.metadata.retryCount - 1);

        // Log retry attempt in development
        if (config.isDevelopment && config.development.logApiCalls) {
          console.log(
            `Retrying request to ${config.url} (attempt ${config.metadata.retryCount} of ${defaultOptions.retryLimit})`
          );
        }

        // Wait for the calculated delay
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Retry the request
        return client(config);
      }

      // Log API errors in development
      if (config.isDevelopment && config.development.logApiCalls) {
        console.error("API Response Error:", error);
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Create default API client
export const apiClient = createApiClient();

/**
 * Enhanced API request with error handling and retry logic
 * @param {Function} requestFn - Function that executes the API request
 * @param {Object} options - Additional options for error handling
 * @returns {Promise} - Promise with response data or error
 */
export const apiRequest = async (requestFn, options = {}) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    const errorResponse = error.response || {};
    const status = errorResponse.status;
    const data = errorResponse.data || {};

    // Determine appropriate error message
    const errorMessage =
      data.message || error.message || "An unexpected error occurred";

    // Log error (in development/non-production environments)
    if (process.env.NODE_ENV !== "production") {
      console.error(`API Error (${status || "unknown"}):`, errorMessage, error);
    }

    // Structured error response for consistent handling
    const errorObject = {
      success: false,
      message: errorMessage,
      status,
      data,
      originalError: error,
    };

    // Call custom error handler if provided
    if (typeof options.onError === "function") {
      options.onError(errorObject);
    }

    throw errorObject;
  }
};
