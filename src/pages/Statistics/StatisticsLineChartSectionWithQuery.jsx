import {
  Box,
  Flex,
  Heading,
  Image,
  List,
  ListItem,
  Text,
  Skeleton,
  SkeletonText,
  Alert,
  AlertIcon,
  Button,
  Select,
} from "@chakra-ui/react";
import React, { useState } from "react";
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
import {
  usePerformanceData,
  useUserActivity,
} from "../../services/query/statisticsQueries";

export const StatisticsLineChartSectionWithQuery = () => {
  // State for period selection
  const [period, setPeriod] = useState("month");

  // Use query hooks
  const {
    data: performanceData,
    isLoading: isLoadingPerformance,
    error: performanceError,
    refetch: refetchPerformance,
  } = usePerformanceData(period);

  const {
    data: activityData,
    isLoading: isLoadingActivity,
    error: activityError,
    refetch: refetchActivity,
  } = useUserActivity();

  // Handle period change
  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

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
              {isLoadingActivity ? (
                <Skeleton height="60px" width="100%" />
              ) : (
                <>
                  <Text fontSize="xl" fontWeight="bold">
                    {activityData?.completedTests || 3}
                  </Text>
                  <Text>tamamlanmış sınaq</Text>
                </>
              )}
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
              {isLoadingActivity ? (
                <Skeleton height="60px" width="100%" />
              ) : (
                <>
                  <Text fontSize="xl" fontWeight="bold">
                    {activityData?.incompleteTests || 1}
                  </Text>
                  <Text>tamamlanmamış sınaq</Text>
                </>
              )}
            </Box>
          </Flex>

          {/* Period selector */}
          <Flex justifyContent="flex-end" mb={4}>
            <Select
              value={period}
              onChange={handlePeriodChange}
              width="180px"
              size="sm"
            >
              <option value="day">Bu gün</option>
              <option value="week">Bu həftə</option>
              <option value="month">Bu ay</option>
              <option value="year">Bu il</option>
            </Select>
          </Flex>

          {/* Line Chart */}
          <Box mt={4}>
            <Text fontSize="xl" fontWeight="bold" textAlign="center">
              {period === "month"
                ? "İyun"
                : period === "year"
                ? "Il"
                : period === "week"
                ? "Həftə"
                : "Gün"}{" "}
              ayı üzrə müvəqqiyyət göstəricisi
            </Text>

            {performanceError ? (
              <Alert status="error" my={4}>
                <AlertIcon />
                <Box>
                  <Text>Xəta baş verdi: {performanceError.message}</Text>
                  <Button size="sm" onClick={refetchPerformance} mt={2}>
                    Yenidən cəhd edin
                  </Button>
                </Box>
              </Alert>
            ) : isLoadingPerformance ? (
              <Skeleton height="300px" width="100%" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
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
            )}
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
          {isLoadingActivity ? (
            <SkeletonText
              noOfLines={10}
              spacing="4"
              skeletonHeight="4"
              width="100%"
            />
          ) : activityError ? (
            <Alert status="error">
              <AlertIcon />
              <Box>
                <Text>Xəta baş verdi: {activityError.message}</Text>
                <Button size="sm" onClick={refetchActivity} mt={2}>
                  Yenidən cəhd edin
                </Button>
              </Box>
            </Alert>
          ) : (
            <Flex gap={4}>
              <Flex direction="column">
                <Text fontSize="2xl" mb={4}>
                  Tədris fəaliyyəti{" "}
                </Text>
                <List
                  flex="1"
                  borderRight="2px solid orange"
                  pr={4}
                  spacing={3}
                >
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
                  <ListItem fontWeight="bold">
                    {activityData?.dailyScore || 14} /30
                  </ListItem>
                  <ListItem fontWeight="bold">
                    {activityData?.monthlyScore || 25} /100
                  </ListItem>
                  <ListItem fontWeight="bold">
                    {activityData?.yearlyScore || 60} /600
                  </ListItem>
                  <ListItem fontWeight="bold">
                    {activityData?.ranking || 3}.cü yer
                  </ListItem>
                  <ListItem fontWeight="bold">
                    {activityData?.totalScore || 256}
                  </ListItem>
                </List>
              </Flex>
            </Flex>
          )}
        </Box>
      </Flex>
    </>
  );
};
