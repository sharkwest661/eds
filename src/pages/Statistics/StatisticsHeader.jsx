import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

export const StatisticsHeader = () => {
  return (
    <>
      <Flex
        as="header"
        justify="space-between"
        align="center"
        bg="#B6DFF5"
        minHeight="50px"
        px={{ base: 5, sm: 10, md: 100 }}
      >
        {/* Logo */}
        <Box>
          <Text fontSize="xl" fontWeight="bold">
            Logo
          </Text>
        </Box>

        {/* Statistika Title */}
        <Box position="relative">
          <Text fontSize="2xl" fontWeight="bold" position="relative">
            Statistika
          </Text>
          <Box
            position="absolute"
            bottom="-2px"
            left="0"
            width="100%"
            height="4px"
            bg="#4AE49E"
            borderRadius="full"
          />
        </Box>

        {/* Avatar and Name */}
        <Flex align="center">
          <Avatar name="A. Murad" size="sm" mr={2} />
          <Text>A. Murad</Text>
        </Flex>
      </Flex>
    </>
  );
};
