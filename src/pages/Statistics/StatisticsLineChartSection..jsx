import {
  Box,
  Flex,
  Heading,
  Image,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import React from "react";
import Up from "../../assets/images/statisticsUp.png";
import Down from "../../assets/images/statisticsUp.png";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const StatisticsLineChartSection = () => {
  const data = [
    { date: "June 1", value: 0 },
    { date: "June 2", value: 5 },
    { date: "June 3", value: 10 },
    { date: "June 4", value: 15 },
    { date: "June 5", value: 20 },
    { date: "June 6", value: 30 },
    { date: "June 7", value: 40 },
    { date: "June 8", value: 50 },
    { date: "June 9", value: 60 },
    { date: "June 10", value: 65 },
    { date: "June 11", value: 70 },
    { date: "June 12", value: 75 },
    { date: "June 13", value: 75 },
    { date: "June 14", value: 75 },
    { date: "June 15", value: 75 },
    { date: "June 16", value: 75 },
    { date: "June 17", value: 75 },
    { date: "June 18", value: 75 },
    { date: "June 19", value: 75 },
    { date: "June 20", value: 75 },
    { date: "June 21", value: 75 },
    { date: "June 22", value: 75 },
    { date: "June 23", value: 80 },
    { date: "June 24", value: 85 },
    { date: "June 25", value: 90 },
    { date: "June 26", value: 95 },
    { date: "June 27", value: 100 },
    { date: "June 28", value: 100 },
    { date: "June 29", value: 100 },
    { date: "June 30", value: 100 },
  ];

  return (
    <>
      <Flex
        width="100%"
        gap={20}
        justifyContent="center"
        alignItems="center"
        direction={{ base: "column", break1100: "row" }}
      >
        {/* Left Section */}
        <Flex direction="column" flex="3" p={5}>
          <Flex align="center" gap={4} mb={5} alignSelf="flex-end">
            <Box
              bg="rgba(74, 228, 158, 0.4)"
              color="#292929"
              p={5}
              borderRadius="md"
              width={{ base: "100%", sm: "230px" }}
              textAlign="center"
              position="relative"
            >
              <Image
                src={Up}
                position="absolute"
                left="10%"
                bottom="75%"
                mb={2}
                border="2px solid white"
                borderRadius="2xl"
              />
              <Text fontSize="xl" fontWeight="bold">
                3
              </Text>
              <Text>tamamlanmış sınaq</Text>
            </Box>
            <Box
              bg="rgba(74, 228, 158, 0.4)"
              color="#292929"
              p={5}
              borderRadius="md"
              width={{ base: "100%", sm: "230px" }}
              textAlign="center"
              position="relative"
            >
              <Image
                src={Down}
                position="absolute"
                left="10%"
                bottom="75%"
                mb={2}
                border="2px solid white"
                borderRadius="2xl"
              />
              <Text fontSize="xl" fontWeight="bold">
                1
              </Text>
              <Text>tamamlanmamış sınaq</Text>
            </Box>
          </Flex>

          {/* Line Chart */}
          <Box mt={4}>
            <Text fontSize="xl" fontWeight="bold" textAlign="center">
              İyun ayı üzrə müvəqqiyyət göstəricisi
            </Text>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} ticks={[0, 50, 75, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Flex>

        {/* Right Section */}
        <Box
          flex="2"
          p={5}
          border="2px solid orange"
          borderRadius={10}
          maxWidth={600}
          height="350px"
          display="flex" // Ensure Box is also a flex container
          justifyContent="center" // Centers horizontally
          alignItems="center" // Centers vertically
        >
          {/* First list with right border colored orange */}

          <Flex gap={4}>
            <Flex direction="column">
              <Text fontSize="2xl" mb={4}>
                Tədris fəaliyyəti{" "}
              </Text>
              <List flex="1" borderRight="2px solid orange" pr={4} spacing={3}>
                <ListItem>Bugün üçün sınaqlar üzrə nəticə</ListItem>
                <ListItem>May ayı ərzində sınaqlar üzrə nəticə</ListItem>
                <ListItem>İl ərzində sınaqlar üzrə nəticə</ListItem>
                <ListItem>Sayt üzrə tutduğunuz mövqe</ListItem>
                <ListItem>Ümumi bal ortalamanız</ListItem>
              </List>
            </Flex>

            {/* Second list without border */}
            <Flex direction="column">
              <Text fontSize="2xl" fontWeight="bold" mb={4}>
                Fəaliyyəti sıfırla
              </Text>
              <List flex="1" spacing={3}>
                <ListItem fontWeight="bold">14 /30</ListItem>
                <ListItem fontWeight="bold">25 /100</ListItem>
                <ListItem fontWeight="bold">60 /600</ListItem>
                <ListItem fontWeight="bold">3.cü yer</ListItem>
                <ListItem fontWeight="bold">256</ListItem>
              </List>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};
