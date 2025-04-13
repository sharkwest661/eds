// src/utils/errorHandling/errorHandler.js

import { toast } from "@chakra-ui/react";

/**
 * A centralized error handling utility that provides consistent error handling
 * across the application.
 */
export class ErrorHandler {
  /**
   * Handle API errors and provide consistent user feedback
   * @param {Error} error - The error object
   * @param {Object} options - Configuration options
   * @param {string} options.fallbackMessage - Message to show if no error message is available
   * @param {Function} options.onError - Custom callback to handle error
   * @param {boolean} options.showToast - Whether to show a toast notification (default: true)
   * @param {Object} options.toastOptions - Custom options for toast notification
   * @returns {Object} Structured error object
   */
  static handleApiError(error, options = {}) {
    const {
      fallbackMessage = "An unexpected error occurred",
      onError,
      showToast = true,
      toastOptions = {},
    } = options;

    // Extract error details
    const errorResponse = error.response || {};
    const status = errorResponse.status;
    const data = errorResponse.data || {};

    // Determine appropriate error message
    const errorMessage = data.message || error.message || fallbackMessage;

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

    // Display toast notification if enabled
    if (showToast) {
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        ...toastOptions,
      });
    }

    // Call custom error handler if provided
    if (typeof onError === "function") {
      onError(errorObject);
    }

    return errorObject;
  }

  /**
   * Handle form validation errors
   * @param {Object} errors - React Hook Form errors object
   * @param {Object} options - Configuration options
   * @param {boolean} options.showToast - Whether to show a toast for the first error
   * @returns {string} First error message for toast display
   */
  static handleFormErrors(errors, options = {}) {
    const { showToast = true } = options;

    if (!errors || Object.keys(errors).length === 0) {
      return null;
    }

    // Get first error message for toast notification
    const firstErrorField = Object.keys(errors)[0];
    const firstError = errors[firstErrorField];
    const firstErrorMessage =
      firstError?.message || "Please check the form for errors";

    // Show toast with first error if enabled
    if (showToast) {
      toast({
        title: "Form Error",
        description: firstErrorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }

    return firstErrorMessage;
  }

  /**
   * Create a standardized error response object
   * @param {string} message - Error message
   * @param {number} status - HTTP status code
   * @param {any} data - Additional error data
   * @returns {Object} Standardized error object
   */
  static createErrorResponse(message, status = 400, data = null) {
    return {
      success: false,
      message,
      status,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Error boundary component to catch and display UI errors
 * Usage:
 * <ErrorBoundary fallback={<ErrorFallback />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service or console
    console.error("UI Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div className="error-boundary">
            <h2>Something went wrong.</h2>
            <p>
              Please try refreshing the page or contact support if the problem
              persists.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
