import { Flex, Box, Heading, Text, Image } from "@chakra-ui/react";

const SubjectCard = ({ title, description, imageSrc, borderColor }) => {
  return (
    <Box
      bg="transparent"
      // p="50px 30px"
      borderRadius="10px"
      border={`1px solid ${borderColor}`}
      cursor="pointer"
      transition="outline 0.3s ease, transform 0.3s ease"
      _hover={{
        outline: `3px solid ${borderColor}`,
        transform: "scale(1.02)",
      }}
    >
      <Flex justifyContent="center" gap={4} alignItems="center">
        <Image src={imageSrc} alt={title} />
        <Box>
          <Heading as="h5" size="md">
            {title}
          </Heading>
          <Text>{description}</Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default SubjectCard;
