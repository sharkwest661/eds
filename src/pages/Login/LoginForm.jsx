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
import { accessToken } from "../../services/api/apiService";
import {
  registerFormControlStyle,
  registerInputStyle,
  registerLabelStyle,
} from "../../assets/styles/chakraStyles";
import { useLocalStorageState } from "ahooks";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const toast = useToast();
  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();
  const [localToken, setLocalToken] = useLocalStorageState("notSafeAuthToken", {
    defaultValue: token,
  });

  const onSubmit = async (data) => {
    try {
      const result = await accessToken(data);
      if (result?.data?.answer) {
        toast({
          title: "success",
          description: result?.data?.message,
          status: "success",
          position: "bottom-right",
        });
        setToken(result?.data?.token);
        setLocalToken(result?.data?.token);

        if (result?.data?.token) {
          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
      } else {
        toast({
          title: "error",
          description: result?.data?.message,
          status: "error",
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error("registerUser error: ", error);
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
          <FormControl {...registerFormControlStyle}>
            <FormLabel {...registerLabelStyle}>Hesab adı</FormLabel>
            <Box w="65%">
              <Input
                {...register("username", {
                  required: true,
                  minLength: 5,
                })}
                {...registerInputStyle}
                placeholder="Enter username"
              />
            </Box>
          </FormControl>

          {/* password  */}
          <FormControl {...registerFormControlStyle}>
            <FormLabel {...registerLabelStyle}>Parol</FormLabel>
            <InputGroup {...registerInputStyle}>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                {...register("password", { required: true })}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShowPassword((prev) => !prev)}
                  variant="ghost"
                >
                  {showPassword ? <EyeClosed /> : <Eye />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

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
              type="submit"
              onClick={() => navigate("/")}
              paddingInline="2.2rem"
            >
              Geri
            </Button>
            <Button
              colorScheme="teal"
              size="md"
              type="submit"
              paddingInline="2.2rem"
            >
              İndi təsdiq et
            </Button>
            {/* <Button colorScheme="teal" size="md" paddingInline="2.2rem">
              Təsdiq etmədən davam et
            </Button> */}
          </ButtonGroup>
        </VStack>
      </Box>
    </Flex>
  );
};
