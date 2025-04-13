import React from "react";
import FeatureCardSection from "./FeatureCardSection";
import LeadersSection from "./LeaderSection";
import PricingSection from "./PricingSection";
import ServiceCardSection from "./ServiceCardSection";
import TopSubjects from "./TopSubjects";
import { Box, VStack } from "@chakra-ui/react";

export const HomeSection = () => {
  return (
    <VStack mt={20} gap={{ base: "30px", md: "60px", lg: "100px" }}>
      <FeatureCardSection />
      <ServiceCardSection />
      <TopSubjects />
      <LeadersSection />
      <PricingSection />
    </VStack>
  );
};
