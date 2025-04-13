import React from "react";

import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

export default function PriceCard({
  packageName,
  price,
  description,
  buttonText,
  buttonColor,
}) {
  return (
    <Box
      bg="transparent"
      p="30px"
      borderRadius="10px"
      border="1px solid black"
      transition="transform 0.3s ease, background-color 0.3s ease"
      cursor="pointer"
      _hover={{
        transform: "scale(1.05)",
      }}
    >
      <Flex
        justifyContent="center"
        alignItems="center"
        direction="column"
        textAlign="center"
      >
        <Heading as="h5" size="md">
          {packageName}
        </Heading>
        <Heading as="h5" size="lg" mt="40px">
          {price}
        </Heading>
        <Text mt="25px">{description}</Text>
        <Button bg={buttonColor} w="100%" mt="40px">
          {buttonText}
        </Button>
      </Flex>
    </Box>
  );
}
