// src/pages/Login/ImprovedLoginForm.jsx
import React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Text,
  useToast,
  VStack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { useAuthStore } from "../../store/useAuthStore";
import {
  FormTextField,
  PasswordField,
  FormErrorSummary,
} from "../../components/form/FormFields";
import { validationSchemas } from "../../utils/validation/validationSchemas";
import { ErrorHandler } from "../../utils/errorHandling/errorHandler";

export const ImprovedLoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur", // Validate on blur
    criteriaMode: "all", // Show all validation criteria
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const toast = useToast();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isAuthenticating = useAuthStore((state) => state.isAuthenticating);
  const authError = useAuthStore((state) => state.error);

  const onSubmit = async (data) => {
    try {
      const result = await login(data);

      if (result.success) {
        toast({
          title: "Success",
          description: "Login successful",
          status: "success",
          position: "bottom-right",
          duration: 3000,
        });

        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        // Use our error handler instead of manual toast
        ErrorHandler.handleApiError(
          {
            message: result.error || "Login failed",
          },
          {
            fallbackMessage:
              "Login failed. Please check your credentials and try again.",
          }
        );
      }
    } catch (error) {
      ErrorHandler.handleApiError(error, {
        fallbackMessage:
          "An unexpected error occurred during login. Please try again.",
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <Flex justifyContent="center" width="full" mt={10}>
      <Box
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        width={{ base: "full", md: "60%" }}
        onKeyDown={handleKeyDown}
      >
        <VStack gap={10}>
          {/* Display authentication error if any */}
          {authError && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {authError}
            </Alert>
          )}

          {/* Username field */}
          <FormTextField
            name="username"
            label="Hesab adı"
            register={register}
            errors={errors}
            placeholder="Enter username"
            isDisabled={isAuthenticating}
            validationSchema={validationSchemas.username()}
            w="full"
          />

          {/* Password field */}
          <PasswordField
            name="password"
            label="Parol"
            register={register}
            errors={errors}
            placeholder="Enter password"
            isDisabled={isAuthenticating}
            validationSchema={validationSchemas.password()}
            w="full"
          />

          {/* Form error summary */}
          <FormErrorSummary errors={errors} />

          <ButtonGroup
            justifyContent="space-between"
            width="100%"
            mt={4}
            flexWrap="wrap"
            gap="10px"
          >
            <Button
              colorScheme="teal"
              size="md"
              onClick={() => navigate("/")}
              paddingInline="2.2rem"
              isDisabled={isAuthenticating}
            >
              Geri
            </Button>
            <Button
              colorScheme="teal"
              size="md"
              type="submit"
              paddingInline="2.2rem"
              isLoading={isAuthenticating}
              loadingText="Giriş edilir..."
            >
              İndi təsdiq et
            </Button>
          </ButtonGroup>
        </VStack>
      </Box>
    </Flex>
  );
};

export default ImprovedLoginForm;
