// src/services/api/enhancedApiService.js
import axios from "axios";
import { EDU_URL } from "./constants";
import { useAuthStore } from "../../store/useAuthStore";
import config from "../../config/appConfig";
import { ErrorHandler } from "../../utils/errorHandling/errorHandler";

/**
 * Enhanced API service with improved error handling
 */

// Create axios instance with configuration from app config
export const api = axios.create({
  baseURL: config.api.baseUrl || EDU_URL,
  withCredentials: config.api.withCredentials,
  timeout: config.api.timeout,
});

// Add request interceptor for authentication and CSRF tokens
api.interceptors.request.use(
  (config) => {
    // Add CSRF token if available
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    // Get authentication token from store
    const authStore = useAuthStore.getState();

    // Check if we have a token
    if (authStore.isAuthenticated && authStore.token) {
      // Add token in the original format the server expects
      config.headers["Token"] = authStore.token;

      // Add token in Bearer format for newer API servers
      config.headers["Authorization"] = `Bearer ${authStore.token}`;
    }

    // Mark data-fetching requests to prevent automatic logout
    if (
      config.headers &&
      config.url &&
      (config.url.includes("/getExams") ||
        config.url.includes("/getExamQuestions") ||
        config.url.includes("/getTopTopics") ||
        config.url.includes("/statistics"))
    ) {
      config.headers["X-Is-Query-Request"] = "true";
    }

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

// Add response interceptor for handling authentication errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Check if this is a query request (should not trigger automatic logout)
      const isQueryRequest =
        error.config?.headers?.["X-Is-Query-Request"] === "true";

      if (!isQueryRequest) {
        // Clear auth state on 401 responses for non-query requests
        console.log("401 error detected, logging out user");
        const authStore = useAuthStore.getState();
        if (authStore.isAuthenticated) {
          await authStore.logout();
          // Only redirect to login if we're not already there
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      } else {
        console.log(
          "401 error in query request, not triggering automatic logout"
        );
      }
    }

    // Log API errors in development
    if (config.isDevelopment && config.development.logApiCalls) {
      console.error("API Response Error:", error);
    }

    return Promise.reject(error);
  }
);

/**
 * Enhanced API request wrapper with error handling
 * @param {Function} apiCall - Function that makes the API call
 * @param {Object} options - Configuration options for error handling
 * @returns {Promise} - Promise with response or error
 */
export const withErrorHandling = async (apiCall, options = {}) => {
  try {
    const response = await apiCall();
    return response;
  } catch (error) {
    return ErrorHandler.handleApiError(error, options);
  }
};

/**
 * Enhanced GET request with error handling
 * @param {string} url - API endpoint
 * @param {Object} params - URL parameters
 * @param {Object} options - Additional options
 * @returns {Promise} - Promise with response or error
 */
export const apiGet = async (url, params = {}, options = {}) => {
  return withErrorHandling(() => api.get(url, { params }), options);
};

/**
 * Enhanced POST request with error handling
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @param {Object} options - Additional options
 * @returns {Promise} - Promise with response or error
 */
export const apiPost = async (url, data = {}, options = {}) => {
  return withErrorHandling(() => api.post(url, data), options);
};

/**
 * Enhanced PUT request with error handling
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @param {Object} options - Additional options
 * @returns {Promise} - Promise with response or error
 */
export const apiPut = async (url, data = {}, options = {}) => {
  return withErrorHandling(() => api.put(url, data), options);
};

/**
 * Enhanced DELETE request with error handling
 * @param {string} url - API endpoint
 * @param {Object} options - Additional options
 * @returns {Promise} - Promise with response or error
 */
export const apiDelete = async (url, options = {}) => {
  return withErrorHandling(() => api.delete(url), options);
};

// Updated API functions with enhanced error handling
export const enhancedApiService = {
  // Public API endpoints (no authentication required)
  getCompanyData: (lang) => apiGet(`/home/${lang}`),

  addUser: (data) => apiPost("/addUser", data),

  accessToken: (data) => apiPost("/accessToken", data),

  checkEmail: (email) => apiGet(`/checkEmail/${email}`),

  checkUsername: (username) => apiGet(`/checkUsername/${username}`),

  // Protected API endpoints (authentication required)
  getTopics: () => apiGet("/getTopics"),

  getTopTopics: () =>
    apiGet(
      "/getTopTopics",
      {},
      {
        headers: { "X-Is-Query-Request": "true" },
      }
    ),

  getExamTypes: () => apiGet("/examTypes"),

  getExams: (data) =>
    apiPost("/getExams", data, {
      headers: { "X-Is-Query-Request": "true" },
    }),

  getExamDetail: (id) => apiGet(`/getExamDetail/${id}`),

  getExamQuestions: (id) =>
    apiGet(
      `/getExamQuestions/${id}`,
      {},
      {
        headers: { "X-Is-Query-Request": "true" },
      }
    ),
};

export default enhancedApiService;
