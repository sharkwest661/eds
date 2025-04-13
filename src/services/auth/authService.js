// src/services/auth/authService.js
import axios from "axios";
import { EDU_URL } from "../api/constants";
import config from "../../config/appConfig";
import { api } from "../api/apiService";

const AUTH_ENDPOINTS = {
  LOGIN: "/accessToken",
  REFRESH: "/refreshToken",
  LOGOUT: "/logout",
  VERIFY: "/verifyToken",
};

// Create an axios instance with appropriate credentials support
const authAxios = axios.create({
  baseURL: config.api.baseUrl || EDU_URL,
  withCredentials: config.api.withCredentials,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a response interceptor for token refresh
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 (Unauthorized) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        await refreshToken();
        // Retry the original request
        return authAxios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Login user and set HTTP-only cookies
 * @param {Object} credentials - User credentials (username, password)
 * @returns {Promise} - Promise with user data
 */
export const login = async (credentials) => {
  try {
    const response = await authAxios.post(AUTH_ENDPOINTS.LOGIN, credentials);

    // IMPORTANT: Check if the response indicates a failed login
    // The API returns { answer: false } for failed logins
    if (response.data && response.data.answer === false) {
      // Instead of throwing an error, we return the response
      // so the caller can handle the failure appropriately
      return response;
    }

    // Extract token from response if it exists
    if (response.data && response.data.token) {
      // For backward compatibility, we'll still use the token from the response
      // This will be removed once HTTP-only cookies are fully implemented
      console.log("Token received from server");
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
/**
 * Refresh the access token
 * @returns {Promise} - Promise with refresh response
 */
export const refreshToken = async () => {
  try {
    const response = await authAxios.post(AUTH_ENDPOINTS.REFRESH);
    return response;
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error;
  }
};

/**
 * Logout user and clear cookies
 * @returns {Promise} - Promise with logout response or success status
 */
export const logout = async () => {
  try {
    // In development, we might not have a real logout endpoint
    if (config.isDevelopment && config.development.mockAuth) {
      if (config.development.logApiCalls) {
        console.log("Using mock logout in development mode");
      }
      // Simulate successful logout
      return {
        status: 200,
        data: { success: true, message: "Logged out successfully" },
      };
    }

    // Attempt regular logout with the API
    const response = await authAxios.post(AUTH_ENDPOINTS.LOGOUT);

    // Clear any CSRF tokens after logout
    if (authAxios.defaults.headers.common["X-CSRF-Token"]) {
      delete authAxios.defaults.headers.common["X-CSRF-Token"];
    }
    if (api.defaults.headers.common["X-CSRF-Token"]) {
      delete api.defaults.headers.common["X-CSRF-Token"];
    }

    return response;
  } catch (error) {
    console.warn("Logout API error:", error.message);

    // Even if the API call fails, we consider the user logged out locally
    // This ensures users aren't stuck in a logged-in state
    if (authAxios.defaults.headers.common["X-CSRF-Token"]) {
      delete authAxios.defaults.headers.common["X-CSRF-Token"];
    }
    if (api.defaults.headers.common["X-CSRF-Token"]) {
      delete api.defaults.headers.common["X-CSRF-Token"];
    }

    // Return a successful status anyway - the user will be locally logged out
    return {
      status: 200,
      data: {
        success: true,
        message: "Logged out locally (API call failed)",
        error: error.message,
      },
    };
  }
};

/**
 * Verify if user is authenticated
 * @returns {Promise<boolean>} - Promise resolving to authentication status
 */
export const verifyAuthentication = async () => {
  try {
    const response = await authAxios.get(AUTH_ENDPOINTS.VERIFY);
    return response.data?.authenticated || false;
  } catch (error) {
    console.error("Verification error:", error);
    return false;
  }
};

/**
 * Get CSRF token and add it to subsequent requests
 * Note: This assumes the backend supports CSRF protection
 * Includes fallback for development/testing environments
 */
export const setupCSRF = async () => {
  // Skip CSRF setup if disabled in config
  if (!config.auth.csrfEnabled) {
    if (config.development.logApiCalls) {
      console.log("CSRF protection disabled in configuration");
    }
    return null;
  }

  try {
    // For development, make the request without credentials to avoid CORS issues
    const requestConfig = config.isDevelopment
      ? { withCredentials: false }
      : {};

    const response = await authAxios.get("/csrf-token", requestConfig);
    const csrfToken = response.data.csrfToken;

    // Add CSRF token to all future requests
    authAxios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
    api.defaults.headers.common["X-CSRF-Token"] = csrfToken; // Also update the main API instance

    if (config.development.logApiCalls) {
      console.log("CSRF token retrieved successfully");
    }

    return csrfToken;
  } catch (error) {
    console.warn("CSRF setup failed, using fallback approach:", error.message);

    // Fallback: Generate a simple token for development or when the endpoint fails
    // This isn't secure but allows development to continue
    if (config.isDevelopment || config.development.mockAuth) {
      const fallbackToken = `dev-csrf-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}`;
      authAxios.defaults.headers.common["X-CSRF-Token"] = fallbackToken;
      api.defaults.headers.common["X-CSRF-Token"] = fallbackToken; // Also update the main API instance

      if (config.development.logApiCalls) {
        console.log("Using fallback CSRF token:", fallbackToken);
      }

      return fallbackToken;
    }

    // In production, we might still want to continue without CSRF
    // This is a compromise but better than completely breaking the app
    return null;
  }
};
