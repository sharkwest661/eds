import { Flex, Box, Heading, Text, Image } from "@chakra-ui/react";

const FeatureCard = ({ bg, imageSrc, heading, text }) => (
  <Box
    bg={bg}
    w={{ base: "full", sm: "380px" }}
    textAlign="center"
    p={8}
    display="flex"
    flexDirection="column"
    alignItems="center"
    borderRadius="10px"
    mb={8}
  >
    <Image src={imageSrc} mb={8} />
    <Heading as="h3" size="md">
      {heading}
    </Heading>
    <Text>{text}</Text>
  </Box>
);

export default FeatureCard;
