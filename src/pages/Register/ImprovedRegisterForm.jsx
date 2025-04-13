// src/pages/Register/ImprovedRegisterForm.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Alert,
  AlertIcon,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useDebounce } from "ahooks";

import {
  FormTextField,
  FormSelectField,
  PasswordField,
  FormErrorSummary,
} from "../../components/form/FormFields";
import { validationSchemas } from "../../utils/validation/validationSchemas";
import { ErrorHandler } from "../../utils/errorHandling/errorHandler";
import enhancedApiService from "../../services/api/enhancedApiService";

export const ImprovedRegisterForm = ({
  registeredUserType,
  setRegisteredUserType,
}) => {
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      type: registeredUserType,
      username: "",
      name: "",
      password: "",
      email: "",
      gender: "",
    },
  });

  const watchUsername = watch("username");
  const watchEmail = watch("email");

  // Apply debounce to username and email
  const debouncedUsername = useDebounce(watchUsername, 500);
  const debouncedEmail = useDebounce(watchEmail, 500);

  // Check username availability
  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (debouncedUsername && debouncedUsername.length >= 5) {
        try {
          const response = await enhancedApiService.checkUsername(
            debouncedUsername
          );
          setUsernameError(response.data);
        } catch (error) {
          // Don't show error toast for availability checks
          console.error("Username check error:", error);
        }
      }
    };

    checkUsernameAvailability();
  }, [debouncedUsername]);

  // Check email availability
  useEffect(() => {
    const checkEmailAvailability = async () => {
      if (debouncedEmail && debouncedEmail.includes("@")) {
        try {
          const response = await enhancedApiService.checkEmail(debouncedEmail);
          setEmailError(response.data);
        } catch (error) {
          // Don't show error toast for availability checks
          console.error("Email check error:", error);
        }
      }
    };

    checkEmailAvailability();
  }, [debouncedEmail]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const onSubmit = async (data) => {
    try {
      // Perform final validation checks
      const usernameAvailableRes = await enhancedApiService.checkUsername(
        data.username
      );
      const emailAvailableRes = await enhancedApiService.checkEmail(data.email);

      if (usernameAvailableRes.data) {
        setUsernameError(true);
        return; // Stop submission if username is taken
      }

      if (emailAvailableRes.data) {
        setEmailError(true);
        return; // Stop submission if email is taken
      }

      // All validations passed, proceed with user registration
      const result = await enhancedApiService.addUser(data);

      // Success message
      toast({
        title: "Success",
        description:
          "Your account has been created successfully. You can now log in.",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });

      // Optionally redirect to login page
      // navigate('/login');
    } catch (error) {
      ErrorHandler.handleApiError(error, {
        fallbackMessage: "Registration failed. Please try again.",
      });
    }
  };

  // Gender options for select field
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  return (
    <Flex justifyContent="center" width="full" mt={10}>
      <Box
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        width={{ base: "full", md: "60%" }}
        onKeyDown={handleKeyDown}
      >
        <VStack gap={10}>
          {/* Username field with availability check */}
          <FormTextField
            name="username"
            label="Hesab adı"
            register={register}
            errors={{
              ...errors,
              username: usernameError
                ? { message: "Bu istifadeci adi movcuddur" }
                : errors.username,
            }}
            placeholder="Cemile123"
            validationSchema={validationSchemas.username()}
            isInvalid={usernameError || !!errors.username}
            w="full"
          />

          {/* Name field */}
          <FormTextField
            name="name"
            label="Adı"
            register={register}
            errors={errors}
            placeholder="Cemile"
            validationSchema={validationSchemas.text(true, 2, 50)}
            w="full"
          />

          {/* Password field */}
          <PasswordField
            name="password"
            label="Parol"
            register={register}
            errors={errors}
            placeholder="Enter password"
            validationSchema={validationSchemas.password()}
            w="full"
          />

          {/* Email field with availability check */}
          <FormTextField
            name="email"
            label="Email"
            register={register}
            errors={{
              ...errors,
              email: emailError
                ? { message: "Bu email artiq movcuddur" }
                : errors.email,
            }}
            placeholder="cemile@gmail.com"
            type="email"
            validationSchema={validationSchemas.email()}
            isInvalid={emailError || !!errors.email}
            w="full"
          />

          {/* Gender selection */}
          <FormSelectField
            name="gender"
            label="Cins"
            register={register}
            errors={errors}
            placeholder="Seçin"
            options={genderOptions}
            validationSchema={{ required: "Please select a gender" }}
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
              onClick={() => setRegisteredUserType(null)}
              paddingInline="2.2rem"
              isDisabled={isSubmitting}
            >
              Geri
            </Button>
            <Button
              colorScheme="teal"
              size="md"
              type="submit"
              paddingInline="2.2rem"
              isLoading={isSubmitting}
              loadingText="Qeydiyyat..."
            >
              İndi təsdiq et
            </Button>
          </ButtonGroup>
        </VStack>
      </Box>
    </Flex>
  );
};

export default ImprovedRegisterForm;
