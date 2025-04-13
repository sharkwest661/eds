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

// Custom error boundary class component
class ErrorBoundaryFallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Query error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback(this.state.error, () => {
        this.setState({ hasError: false, error: null });
        if (this.props.onReset) {
          this.props.onReset();
        }
      });
    }

    return this.props.children;
  }
}

// Wrapper component with hooks
export const QueryErrorBoundary = ({ children }) => {
  const { reset } = useQueryErrorResetBoundary();
  const navigate = useNavigate();

  // Render function for the fallback UI
  const renderFallback = (error, resetErrorBoundary) => {
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
                <Button colorScheme="blue" onClick={() => navigate("/login")}>
                  Log In
                </Button>
              ) : (
                <Button colorScheme="blue" onClick={resetErrorBoundary}>
                  Try Again
                </Button>
              )}
            </Box>
          </AlertDescription>
        </Alert>
      </VStack>
    );
  };

  return (
    <ErrorBoundaryFallback fallback={renderFallback} onReset={reset}>
      {children}
    </ErrorBoundaryFallback>
  );
};
