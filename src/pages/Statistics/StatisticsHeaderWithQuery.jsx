import { Avatar, Box, Flex, Text, Skeleton } from "@chakra-ui/react";
import React from "react";
import { useAuthStore } from "../../store/useAuthStore";

export const StatisticsHeaderWithQuery = () => {
  // Use auth store to get user information
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.initTokenLoading);

  // Get user's first initial and last name if available
  const userDisplay = user?.name
    ? `${user.name.charAt(0)}. ${user.username || "Murad"}`
    : "A. Murad"; // Default if no user data

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
          {isLoading ? (
            <>
              <Skeleton height="32px" width="32px" borderRadius="full" mr={2} />
              <Skeleton height="20px" width="80px" />
            </>
          ) : (
            <>
              <Avatar name={userDisplay} size="sm" mr={2} />
              <Text>{userDisplay}</Text>
            </>
          )}
        </Flex>
      </Flex>
    </>
  );
};
