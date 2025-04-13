import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeClosed } from "@phosphor-icons/react";
import { useNavigate } from "react-router";

import { useAuthStore } from "../../store/useAuthStore";
import {
  registerFormControlStyle,
  registerInputStyle,
  registerLabelStyle,
} from "../../assets/styles/chakraStyles";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

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
        toast({
          title: "Error",
          description: result.error || "Login failed",
          status: "error",
          position: "bottom-right",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Login error: ", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        status: "error",
        position: "bottom-right",
        duration: 5000,
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
          {/* username  */}
          <FormControl
            {...registerFormControlStyle}
            isInvalid={errors.username}
          >
            <FormLabel {...registerLabelStyle}>Hesab adı</FormLabel>
            <Box w="65%">
              <Input
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 5,
                    message: "Username must be at least 5 characters",
                  },
                })}
                {...registerInputStyle}
                placeholder="Enter username"
                isDisabled={isAuthenticating}
              />
              {errors.username && (
                <Text color="red.500" mt={1} fontSize="sm">
                  {errors.username.message}
                </Text>
              )}
            </Box>
          </FormControl>

          {/* password  */}
          <FormControl
            {...registerFormControlStyle}
            isInvalid={errors.password}
          >
            <FormLabel {...registerLabelStyle}>Parol</FormLabel>
            <InputGroup {...registerInputStyle}>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                {...register("password", {
                  required: "Password is required",
                })}
                isDisabled={isAuthenticating}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShowPassword((prev) => !prev)}
                  variant="ghost"
                  isDisabled={isAuthenticating}
                >
                  {showPassword ? <EyeClosed /> : <Eye />}
                </Button>
              </InputRightElement>
            </InputGroup>
            {errors.password && (
              <Text color="red.500" mt={1} fontSize="sm" ml="35%">
                {errors.password.message}
              </Text>
            )}
          </FormControl>

          {/* Display authentication error if any */}
          {authError && (
            <Text color="red.500" textAlign="center">
              {authError}
            </Text>
          )}

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
