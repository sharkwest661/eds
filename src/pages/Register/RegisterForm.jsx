import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Eye, EyeClosed } from "@phosphor-icons/react";
import { useDebounce } from "ahooks";
import {
  addUser,
  checkEmail,
  checkUsername,
} from "../../services/api/apiService";
import {
  registerFormControlStyle,
  registerInputStyle,
  registerLabelStyle,
} from "../../assets/styles/chakraStyles";

export const RegisterForm = ({ registeredUserType, setRegisteredUserType }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: registeredUserType,
    },
  });

  const watchUsername = watch("username");
  const watchEmail = watch("email");

  // Apply debounce to username and email
  const debouncedUsername = useDebounce(watchUsername, {
    wait: 500,
  });
  const debouncedEmail = useDebounce(watchEmail, {
    wait: 500,
  });

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (debouncedUsername) {
        const usernameAvailableRes = await checkUsernameAvailable(
          debouncedUsername
        );
        setUsernameError(usernameAvailableRes);
      }
    };

    checkUsernameAvailability();
  }, [debouncedUsername]);

  useEffect(() => {
    const checkEmailAvailability = async () => {
      if (debouncedEmail) {
        const emailAvailableRes = await checkEmailAvailable(debouncedEmail);
        setEmailError(emailAvailableRes);
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
    // console.log(data);
    try {
      const usernameAvailableRes = await checkUsernameAvailable(data.username);
      const emailAvailableRes = await checkEmailAvailable(data.email);

      if (usernameAvailableRes) {
        setUsernameError(true);
      }

      if (emailAvailableRes) {
        setEmailError(true);
      }

      if (!usernameAvailableRes && !emailAvailableRes) {
        const result = await addUser(data);
        console.log("addUser res", result);
        // toast({
        //   title: "success",
        //   description: result?.data?.message,
        //   status: "success",
        //   position: "bottom-right",
        // });
      }
    } catch (error) {
      console.error("registerUser error: ", error);
    }
  };

  const checkUsernameAvailable = async (username) => {
    try {
      const { data } = await checkUsername(username);
      return data;
    } catch (error) {
      console.error("checkUsername error:", error);
    }
  };

  const checkEmailAvailable = async (email) => {
    try {
      const { data } = await checkEmail(email);
      return data;
    } catch (error) {
      console.error("checkEmail error:", error);
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
          {/* username (Hesab Adı) */}
          <FormControl {...registerFormControlStyle} isInvalid={usernameError}>
            <FormLabel {...registerLabelStyle}>Hesab adı</FormLabel>
            <Box w="65%">
              <Input
                {...register("username", {
                  required: true,
                  minLength: 5,
                })}
                {...registerInputStyle}
                placeholder="Cemile123"
              />
              {usernameError && (
                <FormErrorMessage>bu istifadeci adi movcuddur</FormErrorMessage>
              )}
            </Box>
          </FormControl>

          {/* name (Adı) */}
          <FormControl {...registerFormControlStyle}>
            <FormLabel {...registerLabelStyle}>Adı</FormLabel>
            <Input
              {...register("name", {
                required: true,
                minLength: 5,
              })}
              {...registerInputStyle}
              placeholder="Cemile"
            />
          </FormControl>

          {/* password */}
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

          {/* email */}
          <FormControl {...registerFormControlStyle} isInvalid={emailError}>
            <FormLabel {...registerLabelStyle}>Email</FormLabel>
            <Box w="65%">
              <Input
                type="email"
                {...register("email", {
                  required: "Email Address is required",
                  minLength: 5,
                })}
                {...registerInputStyle}
                placeholder="cemile@gmail.com"
              />
              {emailError && (
                <FormErrorMessage>bu email artiq movcuddur</FormErrorMessage>
              )}
            </Box>
          </FormControl>

          {/* gender */}
          <FormControl {...registerFormControlStyle}>
            <FormLabel {...registerLabelStyle}>Cins</FormLabel>
            <Select {...register("gender")} {...registerInputStyle}>
              <option disabled>Seçin</option>
              <option value="male">male</option>
              <option value="female">female</option>
            </Select>
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
              onClick={() => setRegisteredUserType(null)}
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
          </ButtonGroup>
        </VStack>
      </Box>
    </Flex>
  );
};
