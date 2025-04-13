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
} from "@chakra-ui/react";

const topicsData = [
  { topic: "Problemi həll etmə və düzgün qərar verilməsi", level: 70 }, // 70% completion
  { topic: "Mövzular arası əlaqələrin qurulması", level: 40 }, // 40% completion
  { topic: "Qavrama və kontekst", level: 60 }, // 60% completion
  { topic: "Təxmin etmə və fikir yürütmə", level: 20 }, // 20% completion
  { topic: "Araşdırma və cavablar arasında körpü yaratmaq", level: 90 }, // 90% completion
];

export const StatisticsTopics = () => {
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
        {" "}
        {/* No border for table itself */}
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
          {topicsData.map((item, index) => (
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
