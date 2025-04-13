import { Flex, Box, Heading, Text, Image } from "@chakra-ui/react";
import greenCircle from "../../assets/images/green_circle.svg";
import { textTemplates } from "../../utils/statics/templates";

const HeaderSection = () => (
  <Flex
    direction={{ base: "column", sm: "row" }}
    justify="space-between"
    p={6}
    mb="100px"
  >
    {/* Left side content */}
    <Box flex="1" mr={{ sm: 12 }}>
      <Heading mb={4}>HAQQIMIZDA</Heading>
      <Text>{textTemplates.loremText}</Text>
    </Box>

    {/* Right side image */}
    <Box flexShrink={0}>
      {" "}
      {/* Prevent the box from shrinking */}
      <Image src={greenCircle} alt="circle" />
    </Box>
  </Flex>
);

export default HeaderSection;
