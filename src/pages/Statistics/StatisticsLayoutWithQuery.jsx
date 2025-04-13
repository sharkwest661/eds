import React from "react";
import { StatisticsHeaderWithQuery } from "./StatisticsHeaderWithQuery";
import { StatisticsAverageWithQuery } from "./StatisticsAverageWithQuery";
import { StatisticsTopicsWithQuery } from "./StatisticsTopicsWithQuery";
import { StatisticsLineChartSectionWithQuery } from "./StatisticsLineChartSectionWithQuery";
import { QueryErrorBoundary } from "../../components/common/QueryErrorBoundary";
import { Box, Spinner, Flex } from "@chakra-ui/react";

const StatisticsWithQuery = () => {
  return (
    <QueryErrorBoundary>
      <StatisticsHeaderWithQuery />
      <StatisticsAverageWithQuery />
      <StatisticsTopicsWithQuery />
      <StatisticsLineChartSectionWithQuery />
    </QueryErrorBoundary>
  );
};

export default StatisticsWithQuery;
