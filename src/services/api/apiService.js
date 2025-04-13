import axios from "axios";
import { EDU_URL } from "./constants";
import { Languages } from "../../utils/statics/constants";
import { useAuthStore } from "../../store/useAuthStore";

import config from "../../config/appConfig";

// Create axios instance with configuration from app config
export const api = axios.create({
  baseURL: config.api.baseUrl || EDU_URL,
  withCredentials: config.api.withCredentials,
  timeout: config.api.timeout,
});

// Add request interceptor for potential CSRF tokens
api.interceptors.request.use(
  (config) => {
    // Add CSRF token if available
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    // Add token in the format the server expects
    const authStore = useAuthStore.getState();
    if (authStore.isAuthenticated && authStore.token) {
      config.headers["Token"] = authStore.token; // Original format the server expects
      config.headers["Authorization"] = `Bearer ${authStore.token}`; // New format for future compatibility
    }

    // Check if this is a query request that should not trigger automatic logout
    if (
      config.url &&
      (config.url.includes("/getExams") ||
        config.url.includes("/getExamQuestions") ||
        config.url.includes("/getTopTopics"))
    ) {
      config.headers["X-Is-Query-Request"] = "true";
    }

    return config;
  },
  (error) => Promise.reject(error)
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
        // Clear auth state on 401 responses
        const authStore = useAuthStore.getState();
        if (authStore.isAuthenticated) {
          console.log("401 error detected, logging out user");
          await authStore.logout();
          // Optionally redirect to login page
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
    return Promise.reject(error);
  }
);

// Public API endpoints (no authentication required)
export const getCompanyData = async (lang = Languages["aze"]) => {
  const url = `/home/${lang}`;
  return api.get(url);
};

export const addUser = async (body) => {
  const url = "/addUser";
  return api.post(url, body);
};

export const accessToken = async (body) => {
  const url = "/accessToken";
  return api.post(url, body);
};

export const checkEmail = async (email) => {
  const url = `/checkEmail/${email}`;
  return api.get(url);
};

export const checkUsername = async (username) => {
  const url = `/checkUsername/${username}`;
  return api.get(url);
};

// Protected API endpoints (authentication required)
export const getTopics = async () => {
  const url = "/getTopics";
  return api.get(url);
};

export const getTopTopics = async () => {
  const url = "/getTopTopics";
  return api.get(url, {
    headers: {
      "X-Is-Query-Request": "true", // Add header to prevent automatic logout
    },
  });
};

export const getExamTypes = async () => {
  const url = "/examTypes";
  return api.get(url);
};

export const getExams = async (body) => {
  const url = "/getExams";
  return api.post(url, body, {
    headers: {
      "X-Is-Query-Request": "true", // Add header to prevent automatic logout
    },
  });
};

export const getExamDetail = async (id) => {
  const url = `/getExamDetail/${id}`;
  return api.get(url);
};

export const getExamQuestions = async (id) => {
  const url = `/getExamQuestions/${id}`;
  return api.get(url, {
    headers: {
      "X-Is-Query-Request": "true", // Add header to prevent automatic logout
    },
  });
};

// Centralized error handler
export const handleApiError = (
  error,
  fallbackMessage = "An error occurred"
) => {
  const errorMessage =
    error.response?.data?.message || error.message || fallbackMessage;

  console.error(`API Error: ${errorMessage}`, error);
  return {
    success: false,
    message: errorMessage,
    status: error.response?.status,
    data: error.response?.data,
  };
};
