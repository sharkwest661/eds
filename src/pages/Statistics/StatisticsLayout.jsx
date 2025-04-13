import React from "react";
import { StatisticsHeader } from "./StatisticsHeader";
import { StatisticsAverage } from "./StatisticsAverage";
import { StatisticsTopics } from "./StatisticsTopics";
import { StatisticsLineChartSection } from "./StatisticsLineChartSection.";

const Statistics = () => {
  return (
    <>
      <StatisticsHeader />
      <StatisticsAverage />
      <StatisticsTopics />
      <StatisticsLineChartSection />
    </>
  );
};

export default Statistics;
