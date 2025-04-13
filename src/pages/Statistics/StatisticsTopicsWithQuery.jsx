import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Text,
  TableContainer,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
} from "@chakra-ui/react";
import { useTopicStatistics } from "../../services/query/statisticsQueries";
import { useNavigate } from "react-router-dom";

export const StatisticsTopicsWithQuery = () => {
  // Use the topic statistics query hook
  const { data, isLoading, error, refetch } = useTopicStatistics();
  const navigate = useNavigate();

  // Handle authentication errors
  if (error?.message?.includes("Authentication")) {
    return (
      <Alert
        status="warning"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
        my={8}
        borderRadius="md"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Authentication Required
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          <Text mb={4}>
            Your session may have expired. Please log in again to view your
            topic statistics.
          </Text>
          <Button colorScheme="blue" onClick={() => navigate("/login")} mr={3}>
            Log In
          </Button>
          <Button variant="ghost" onClick={() => refetch()}>
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Handle general errors
  if (error) {
    return (
      <Alert status="error" my={8}>
        <AlertIcon />
        <Box>
          <AlertTitle>Error loading topic statistics</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
          <Button mt={3} onClick={() => refetch()} size="sm">
            Try Again
          </Button>
        </Box>
      </Alert>
    );
  }

  return (
    <TableContainer
      overflowX="auto"
      maxWidth="1040px"
      mx="auto"
      border="1px"
      borderColor="gray.300"
      borderRadius="xl"
      mt={10}
      mb={20}
    >
      <Table variant="simple" border="none">
        <Thead>
          <Tr>
            <Th
              fontSize="xl"
              borderBottom="2px"
              borderColor="gray.300"
              textTransform="none"
            >
              Mövzu anlayışları
            </Th>
            <Th
              fontSize="xl"
              borderBottom="2px"
              borderColor="gray.300"
              textTransform="none"
            >
              Səviyyə
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading
            ? // Show loading skeletons when data is loading
              Array.from({ length: 5 }).map((_, index) => (
                <Tr key={`loading-${index}`}>
                  <Td borderBottom="1px" borderColor="gray.300">
                    <Skeleton height="20px" width="80%" />
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.300">
                    <Skeleton height="24px" width="100%" />
                  </Td>
                </Tr>
              ))
            : // Show actual data when loaded
              data?.map((item, index) => (
                <Tr key={index}>
                  <Td borderBottom="1px" borderColor="gray.300">
                    {item.topic}
                  </Td>
                  <Td borderBottom="1px" borderColor="gray.300">
                    <Box>
                      <Progress
                        value={item.level}
                        size="lg"
                        borderRadius={100}
                        sx={{
                          bg: "white", // Background for the empty part
                          borderColor: "#4AE49E", // Border color
                          borderWidth: "1px", // Border width
                          borderStyle: "solid", // Border style
                          "& > div": {
                            backgroundColor: "#4AE49E", // Set the filled color
                          },
                        }}
                      />
                    </Box>
                  </Td>
                </Tr>
              ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
