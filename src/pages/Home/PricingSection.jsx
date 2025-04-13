import React from "react";
import { Flex, Heading } from "@chakra-ui/react";
import PriceCard from "./PriceCard";

// Data array simulating an API response
const pricePackages = [
  {
    id: 1,
    packageName: "Standart Paket",
    price: "$80 / Ay",
    description: "Lorem ipsum dolor sit amet consectetur.",
    buttonText: "QEYDIYYATDAN KEÇ",
    buttonColor: "#A4D7F2",
  },
  {
    id: 2,
    packageName: "Premium Paket",
    price: "$120 / Ay",
    description: "Lorem ipsum dolor sit amet consectetur.",
    buttonText: "QEYDIYYATDAN KEÇ",
    buttonColor: "#A4D7F2",
  },
  {
    id: 3,
    packageName: "VIP Paket",
    price: "$200 / Ay",
    description: "Lorem ipsum dolor sit amet consectetur.",
    buttonText: "QEYDIYYATDAN KEÇ",
    buttonColor: "#A4D7F2",
  },
];

export default function PriceSection() {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      mb="150px"
    >
      <Heading as="h3" size="lg" mb="100px">
        TƏHSİL PAKETLƏRİMİZ
      </Heading>

      <Flex
        justifyContent="center"
        gap={4}
        direction={{ base: "column", lg: "row" }}
        alignItems="center"
      >
        {pricePackages.map(
          ({
            id,
            packageName,
            price,
            description,
            buttonText,
            buttonColor,
          }) => (
            <PriceCard
              key={id}
              packageName={packageName}
              price={price}
              description={description}
              buttonText={buttonText}
              buttonColor={buttonColor}
            />
          )
        )}
      </Flex>
    </Flex>
  );
}
