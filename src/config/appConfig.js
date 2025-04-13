/**
 * Application configuration that adapts to different environments
 */

// Determine environment
const isDevelopment =
  process.env.NODE_ENV === "development" ||
  window.location.hostname === "localhost";
const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

// Base configuration
const config = {
  isDevelopment,
  isProduction,
  isTest,

  // API configuration
  api: {
    baseUrl: import.meta.env.VITE_EDU_URL || "https://api.edumetrics.az",
    timeout: 30000, // 30 seconds
    withCredentials: !isDevelopment, // Only use credentials in production to avoid CORS issues
  },

  // Authentication configuration
  auth: {
    useHttpOnlyCookies: !isDevelopment, // Use cookies in production, fallback in development
    csrfEnabled: !isDevelopment, // Use CSRF in production, disable in development
    tokenStorageKey: "notSafeAuthToken", // Legacy storage key (for backward compatibility)
    loginPath: "/login",
    homePath: "/",
  },

  // Feature flags
  features: {
    enableErrorReporting: isProduction,
    enableAnalytics: isProduction,
    debugMode: isDevelopment,
  },

  // Development tools
  development: {
    mockAuth: isDevelopment, // Use mock authentication in development if needed
    mockApiResponses: false, // Set to true to use mock API responses
    logApiCalls: isDevelopment, // Log API calls in development
  },
};

export default config;
