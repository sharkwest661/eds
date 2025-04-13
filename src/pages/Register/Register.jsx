import {
  Box,
  Heading,
  Image,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useState } from "react";

// components
import { RegisterTitle } from "./RegisterTitle";
import { RegisterForm } from "./RegisterForm";
import { AuthTitleSection } from "../../components/form/AuthTitleSection";

// icons
import studentIcon from "../../assets/images/student.svg";
import parentIcon from "../../assets/images/parent.svg";
import teacherIcon from "../../assets/images/teacher.svg";

// misc
import { textTemplates } from "../../utils/statics/templates";

const registeredUserTypesData = [
  {
    key: "child",
    label: "Şagird",
    color: "#4AE49D",
    description: "Lorem ipsum dolor sit amet consectetur.",
    icon: studentIcon,
  },
  {
    key: "parent",
    label: "Valideyn",
    color: "#FFA753",
    description: "Lorem ipsum dolor sit amet consectetur.",
    icon: parentIcon,
  },
  {
    key: "teacher",
    label: "Müəllim",
    color: "#A4D7F2",
    description: "Lorem ipsum dolor sit amet consectetur.",
    icon: teacherIcon,
  },
];

const Register = () => {
  const [registeredUserType, setRegisteredUserType] = useState(null);

  return (
    <Box>
      <AuthTitleSection
        titleText="Qeydiyyat səhifəsi"
        description={textTemplates.loremText}
      />
      <VStack alignItems="flex-start">
        {!registeredUserType && (
          <>
            <Heading mb={8}>Hesab tipi seçin</Heading>
            <Wrap justify="center" align="center" width="100%">
              {registeredUserTypesData.map((userType) => (
                <WrapItem key={userType.key}>
                  <Box
                    border={`.4rem solid ${userType.color}`}
                    _hover={{ borderWidth: `.8rem` }}
                    borderRadius="4px"
                    transition=".3s"
                    width="350px"
                    height="250px"
                    onClick={() => setRegisteredUserType(userType.key)}
                  >
                    <VStack align="center" justify="center" height="full">
                      <Image src={userType.icon} alt={userType.key} />
                      <Heading>{userType.label}</Heading>
                      <Text>{userType.description}</Text>
                    </VStack>
                  </Box>
                </WrapItem>
              ))}
            </Wrap>
          </>
        )}
      </VStack>
      {registeredUserType && (
        <RegisterForm
          registeredUserType={registeredUserType}
          setRegisteredUserType={setRegisteredUserType}
        />
      )}
    </Box>
  );
};

export default Register;
