import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Highlight,
  Image,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";

// import heroImage from "../../assets/images/herosection-girl.png";
import greenCircle from "../../assets/images/green_circle.svg";

import { EDU_URL } from "../../services/api/constants";
import { useCompanyStore } from "../../store/useCompanyStore";

export const HeroSection = () => {
  const companyData = useCompanyStore((state) => state.companyData);

  return (
    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={10}>
      <Flex
        direction="column"
        justify="space-evenly"
        alignItems="center"
        gap="6px"
      >
        <Heading>
          <Highlight query="GƏLƏCƏYİ" styles={{ color: "green" }}>
            ÖVLADINIZIN GƏLƏCƏYİ ÜÇÜN ÇALIŞIRIQ!
          </Highlight>
        </Heading>
        <Text>{companyData.headerText} </Text>
        <Button>İNDİ ƏLAQƏ SAXLA</Button>
      </Flex>
      <Box position="relative">
        <Image
          src={greenCircle}
          position="absolute"
          left={{ base: "10px", md: "25px", lg: "40px" }}
          w="500px"
        />

        {companyData?.headerImage ? (
          <Image src={EDU_URL + companyData?.headerImage} alt="girl book" />
        ) : (
          "loadin"
        )}
      </Box>
    </SimpleGrid>
  );
};
