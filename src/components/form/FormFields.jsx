// src/components/form/FormFields.jsx
import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Text,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { Eye, EyeClosed } from "@phosphor-icons/react";

/**
 * Reusable form input field with standardized error handling
 */
export const FormTextField = ({
  name,
  label,
  register,
  errors,
  placeholder,
  isRequired = false,
  isDisabled = false,
  type = "text",
  validationSchema = {},
  ...props
}) => {
  return (
    <FormControl isInvalid={!!errors[name]} isRequired={isRequired} {...props}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        isDisabled={isDisabled}
        {...register(name, validationSchema)}
      />
      {errors[name] && (
        <FormErrorMessage>{errors[name].message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

/**
 * Reusable password field with show/hide functionality
 */
export const PasswordField = ({
  name,
  label,
  register,
  errors,
  placeholder = "Enter password",
  isRequired = false,
  isDisabled = false,
  validationSchema = {},
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl isInvalid={!!errors[name]} isRequired={isRequired} {...props}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <InputGroup>
        <Input
          id={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          isDisabled={isDisabled}
          {...register(name, validationSchema)}
        />
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            size="sm"
            onClick={() => setShowPassword((prev) => !prev)}
            variant="ghost"
            isDisabled={isDisabled}
          >
            {showPassword ? <EyeClosed /> : <Eye />}
          </Button>
        </InputRightElement>
      </InputGroup>
      {errors[name] && (
        <FormErrorMessage>{errors[name].message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

/**
 * Reusable select field component
 */
export const FormSelectField = ({
  name,
  label,
  register,
  errors,
  options = [],
  placeholder = "Select an option",
  isRequired = false,
  isDisabled = false,
  validationSchema = {},
  ...props
}) => {
  return (
    <FormControl isInvalid={!!errors[name]} isRequired={isRequired} {...props}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Select
        id={name}
        placeholder={placeholder}
        isDisabled={isDisabled}
        {...register(name, validationSchema)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {errors[name] && (
        <FormErrorMessage>{errors[name].message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

/**
 * Reusable text area component
 */
export const FormTextareaField = ({
  name,
  label,
  register,
  errors,
  placeholder,
  isRequired = false,
  isDisabled = false,
  validationSchema = {},
  ...props
}) => {
  return (
    <FormControl isInvalid={!!errors[name]} isRequired={isRequired} {...props}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Textarea
        id={name}
        placeholder={placeholder}
        isDisabled={isDisabled}
        {...register(name, validationSchema)}
        {...props}
      />
      {errors[name] && (
        <FormErrorMessage>{errors[name].message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

/**
 * Reusable form error summary component
 */
export const FormErrorSummary = ({ errors, showSummary = true }) => {
  if (!showSummary || !errors || Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <Text color="red.500" mt={4} textAlign="center">
      Please correct the errors in the form before submitting.
    </Text>
  );
};
