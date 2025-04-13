import React from "react";
import { Box, Image, Heading, Text, Flex } from "@chakra-ui/react";

export default function ServiceCard({ imageSrc, heading, text }) {
  return (
    <>
      <Flex
        bg="transparent"
        w="full"
        p={4}
        borderRadius="10px"
        border="1px solid black"
        position="relative"
        height="195px"
        direction="column"
        align="center"
        justify="center"
        transition="transform 0.3s ease, background-color 0.3s ease"
        cursor="pointer"
        _hover={{
          transform: "scale(1.05)",
        }}
      >
        <Image
          src={imageSrc}
          position="absolute"
          top="-25%"
          right="10%"
          bg="white"
          border="15px solid white"
          width="96px"
          height="96px"
        />
        <Heading as="h5" size="md">
          {heading}
        </Heading>
        <Text>{text}</Text>
      </Flex>
    </>
  );
}
