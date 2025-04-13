import React from "react";
import { Flex, Heading, Image, Text, VStack } from "@chakra-ui/react";

import greenCircle from "../../assets/images/green_circle.png";

export const AuthTitleSection = ({ titleText, description }) => {
  return (
    <Flex justifyContent="space-between" alignItems="center" gap={5}>
      <VStack alignItems="flex-start" width="40%">
        <Heading
          color="#393939"
          fontSize={{ base: "24px", sm: "40px", md: "60px" }}
        >
          {titleText}
        </Heading>
        <Text>{description}</Text>
      </VStack>
      <Image
        src={greenCircle}
        alt="circle"
        width={{ base: "50%", md: "auto" }}
      />
    </Flex>
  );
};
