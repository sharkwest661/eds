import React from "react";
import { Box, Image, Flex, Heading, Text } from "@chakra-ui/react";

export default function LeaderCard({
  borderColor,
  badgeSrc,
  avatarSrc,
  name,
  description,
  score,
  scoreColor,
}) {
  return (
    <Box
      w="full"
      borderRadius="10px"
      border={`3px solid ${borderColor}`}
      position="relative"
      transition="transform 0.3s ease, background-color 0.3s ease"
      cursor="pointer"
      _hover={{
        transform: "scale(1.05)",
      }}
    >
      <Image
        src={badgeSrc}
        position="absolute"
        bg="white"
        borderRadius="100%"
        border="8px solid white"
        top="-25px"
        left="20px"
        width={{ base: "50px", sm: "auto" }}
      />

      <Image
        src={avatarSrc}
        position="absolute"
        top={{ base: "30px", sm: "25px" }}
        left="50%"
        transform="translate(-50%)"
        width={{ base: "60px", sm: "auto" }}
      />
      <Box h="70px" bg={borderColor} mb={10} />

      <Flex
        justifyContent="center"
        alignItems="center"
        gap={2}
        direction="column"
        textAlign="center"
        padding={{ base: "5px", sm: "10px" }}
      >
        <Heading as="h5" size="md">
          {name}
        </Heading>
        <Text>{description}</Text>
        <Heading as="h1" color={scoreColor}>
          {score}
        </Heading>
      </Flex>
    </Box>
  );
}
