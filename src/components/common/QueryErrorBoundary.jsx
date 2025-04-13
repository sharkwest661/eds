import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Box,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary"; // Import from react-error-boundary

/**
 * Error boundary component specifically for handling query errors
 * Prevents automatic logout redirects and provides user-friendly error messages
 */
export const QueryErrorBoundary = ({ children }) => {
  const { reset } = useQueryErrorResetBoundary();
  const navigate = useNavigate();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => {
        const isAuthError =
          error?.status === 401 ||
          error?.response?.status === 401 ||
          error.message?.includes("Authentication");

        return (
          <VStack spacing={4} align="stretch" p={5}>
            <Alert
              status={isAuthError ? "warning" : "error"}
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              borderRadius="md"
              py={5}
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                {isAuthError ? "Authentication Required" : "Error Loading Data"}
              </AlertTitle>
              <AlertDescription maxWidth="md">
                <Text mb={4}>
                  {isAuthError
                    ? "Your session may have expired. Please log in again to continue."
                    : error.message ||
                      "An unexpected error occurred. Please try again."}
                </Text>
                <Box mt={4}>
                  {isAuthError ? (
                    <Button
                      colorScheme="blue"
                      onClick={() => navigate("/login")}
                    >
                      Log In
                    </Button>
                  ) : (
                    <Button
                      colorScheme="blue"
                      onClick={() => {
                        resetErrorBoundary();
                      }}
                    >
                      Try Again
                    </Button>
                  )}
                </Box>
              </AlertDescription>
            </Alert>
          </VStack>
        );
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
