import { Box } from "@chakra-ui/react";
import React from "react";
import { AuthTitleSection } from "../../components/form/AuthTitleSection";
import { textTemplates } from "../../utils/statics/templates";
import { LoginForm } from "./LoginForm";

const Login = () => {
  return (
    <Box>
      <AuthTitleSection
        titleText="Giriş səhifəsi"
        description={textTemplates.loremText}
      />
      <LoginForm />
    </Box>
  );
};

export default Login;
