import { Flex, Heading, Image, Text, VStack } from "@chakra-ui/react";
import React from "react";

import greenCircle from "../../assets/images/green_circle.png";

export const RegisterTitle = () => {
  return (
    <Flex justifyContent="space-between" alignItems="center" gap={5}>
      <VStack alignItems="flex-start" width="40%">
        <Heading
          color="#393939"
          fontSize={{ base: "24px", sm: "40px", md: "60px" }}
        >
          Qeydiyyat səhifəsi
        </Heading>
        <Text>
          Lorem ipsum dolor sit amet consectetur. Turpis venenatis tincidunt
          egestas vitae
        </Text>
      </VStack>
      <Image
        src={greenCircle}
        alt="circle"
        width={{ base: "50%", md: "auto" }}
      />
    </Flex>
  );
};
