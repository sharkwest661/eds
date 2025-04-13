// src/utils/validation/validationSchemas.js

/**
 * Centralized validation schemas and utilities for form validation
 * Using React Hook Form validation patterns
 */

// Common validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  USERNAME: /^[a-zA-Z0-9._-]{5,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
  PHONE: /^\+?[0-9]{10,15}$/,
};

// Common validation error messages
export const ERROR_MESSAGES = {
  REQUIRED: "This field is required",
  EMAIL: "Please enter a valid email address",
  USERNAME:
    "Username must be 5-20 characters and may include letters, numbers, dots, underscores, and hyphens",
  PASSWORD:
    "Password must be at least 8 characters and include uppercase, lowercase, and numbers",
  PASSWORD_MATCH: "Passwords do not match",
  MIN_LENGTH: (min) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max) => `Cannot exceed ${max} characters`,
  PHONE: "Please enter a valid phone number",
};

/**
 * Common validation schemas for React Hook Form
 */
export const validationSchemas = {
  /**
   * Username validation schema
   * @param {boolean} required - Whether the field is required
   * @returns {Object} Validation schema for username
   */
  username: (required = true) => ({
    required: required ? ERROR_MESSAGES.REQUIRED : false,
    minLength: {
      value: 5,
      message: ERROR_MESSAGES.MIN_LENGTH(5),
    },
    maxLength: {
      value: 20,
      message: ERROR_MESSAGES.MAX_LENGTH(20),
    },
    pattern: {
      value: VALIDATION_PATTERNS.USERNAME,
      message: ERROR_MESSAGES.USERNAME,
    },
  }),

  /**
   * Email validation schema
   * @param {boolean} required - Whether the field is required
   * @returns {Object} Validation schema for email
   */
  email: (required = true) => ({
    required: required ? ERROR_MESSAGES.REQUIRED : false,
    pattern: {
      value: VALIDATION_PATTERNS.EMAIL,
      message: ERROR_MESSAGES.EMAIL,
    },
  }),

  /**
   * Password validation schema
   * @param {boolean} required - Whether the field is required
   * @returns {Object} Validation schema for password
   */
  password: (required = true) => ({
    required: required ? ERROR_MESSAGES.REQUIRED : false,
    minLength: {
      value: 8,
      message: ERROR_MESSAGES.MIN_LENGTH(8),
    },
    pattern: {
      value: VALIDATION_PATTERNS.PASSWORD,
      message: ERROR_MESSAGES.PASSWORD,
    },
  }),

  /**
   * Confirm password validation schema
   * @param {string} passwordFieldName - Name of the password field to match against
   * @returns {Object} Validation schema for confirm password
   */
  confirmPassword: (passwordFieldName = "password") => ({
    required: ERROR_MESSAGES.REQUIRED,
    validate: (value, formValues) =>
      value === formValues[passwordFieldName] || ERROR_MESSAGES.PASSWORD_MATCH,
  }),

  /**
   * Phone number validation schema
   * @param {boolean} required - Whether the field is required
   * @returns {Object} Validation schema for phone number
   */
  phone: (required = true) => ({
    required: required ? ERROR_MESSAGES.REQUIRED : false,
    pattern: {
      value: VALIDATION_PATTERNS.PHONE,
      message: ERROR_MESSAGES.PHONE,
    },
  }),

  /**
   * Text input validation schema with length constraints
   * @param {boolean} required - Whether the field is required
   * @param {number} minLength - Minimum length required
   * @param {number} maxLength - Maximum length allowed
   * @returns {Object} Validation schema for text input
   */
  text: (required = true, minLength = 0, maxLength = undefined) => {
    const schema = {
      required: required ? ERROR_MESSAGES.REQUIRED : false,
    };

    if (minLength > 0) {
      schema.minLength = {
        value: minLength,
        message: ERROR_MESSAGES.MIN_LENGTH(minLength),
      };
    }

    if (maxLength) {
      schema.maxLength = {
        value: maxLength,
        message: ERROR_MESSAGES.MAX_LENGTH(maxLength),
      };
    }

    return schema;
  },
};

/**
 * Form error display component with standardized styling
 */
export const FormErrorMessage = ({ children, ...props }) => {
  return (
    <Text color="red.500" fontSize="sm" mt={1} {...props}>
      {children}
    </Text>
  );
};

/**
 * Utility function to check if a form has validation errors
 * @param {Object} errors - React Hook Form errors object
 * @returns {boolean} Whether the form has errors
 */
export const hasFormErrors = (errors) => {
  return errors && Object.keys(errors).length > 0;
};
