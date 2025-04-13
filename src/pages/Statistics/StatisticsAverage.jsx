import React from "react";
import { Flex, Box, Text, Image } from "@chakra-ui/react";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import Average from "../../assets/images/average.svg";

export const StatisticsAverage = () => {
  const data = [{ name: "L1", value: 73 }];

  // Set larger size for the RadialBarChart
  const circleWidth = 300; // Increase width further
  const circleHeight = 300; // Increase height further

  return (
    <Flex
      direction="column"
      backgroundColor="#DBEFFA"
      px={{ base: 5, sm: 10, md: 20, xl: 100 }}
    >
      <Flex
        justify="space-between"
        align="center"
        direction={{ base: "column", md: "row" }}
        gap={10}
      >
        <Flex
          gap={5}
          direction={{ base: "column", lg: "row" }}
          mt={{ base: "-100px", md: 0 }}
        >
          {/* First item */}
          <Box textAlign="center" mt="-20px">
            <Text fontSize="lg" fontWeight="bold">
              24/25 sual
            </Text>
            <Text>Cavablandırılmamış</Text>
          </Box>
          {/* Second item */}
          <Box textAlign="center" mt="-20px">
            <Text fontSize="lg" fontWeight="bold">
              1 sual
            </Text>
            <Text>Cavablandırılmamış</Text>
          </Box>
        </Flex>
        {/* chart  */}
        <Box order={{ base: -1, md: 0 }}>
          <RadialBarChart
            width={circleWidth}
            height={circleHeight}
            cx={circleWidth / 2}
            cy={circleHeight / 2} // Centering the chart
            innerRadius={100} // Increase inner radius
            outerRadius={120} // Increase outer radius
            barSize={30} // Increase bar size for better visibility
            data={data}
            startAngle={180} // Start from the left
            endAngle={0} // End at the right
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: "#393939" }}
              clockWise
              dataKey="value"
              cornerRadius={circleWidth / 2} // Adjust corner radius
              fill="#FF965E"
            />
            <text
              x={circleWidth / 2}
              y={circleHeight / 2.1} // Center the label vertically
              textAnchor="middle"
              dominantBaseline="middle"
              className="progress-label"
              fontSize="48" // Increase font size if needed
            >
              {data[0]?.value || 0}%
            </text>
          </RadialBarChart>
        </Box>
        <Flex gap={5} direction={{ base: "column", lg: "row" }}>
          {/* Third item */}
          <Box textAlign="center" mt="-20px">
            <Text fontSize="lg" fontWeight="bold">
              24 sual
            </Text>
            <Text>Cavablandırılmış</Text>
          </Box>
          {/* Fourth item */}
          <Box textAlign="center" mt="-20px">
            <Text fontSize="lg" fontWeight="bold">
              35.ci yer
            </Text>
            <Text>Qiymətləndirmə cədvəlində</Text>
          </Box>
        </Flex>
      </Flex>
      {/* New Flex container for the last block */}
      <Flex
        justify="center"
        align="center"
        gap={2}
        mb="2rem"
        mt={{ base: "2rem", md: "-3rem" }}
      >
        <Image src={Average} alt="Average" />
        <Text ml={2} fontSize="2xl" fontWeight="bold" textAlign="center">
          Orta statistik göstərici {data[0].value}%{" "}
        </Text>
      </Flex>
    </Flex>
  );
};
