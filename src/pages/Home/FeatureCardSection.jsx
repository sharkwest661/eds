import { Flex, Heading } from "@chakra-ui/react";
import FeatureCard from "./FeatureCard";
import Arrow from "../../assets/images/arrow.png";
import LightBulb from "../../assets/images/light.png";

// Data array simulating an API response
const cardData = [
  {
    id: 1,
    bg: "#FFA753",
    imageSrc: Arrow,
    heading: "YARIŞLAR",
    text: "Lorem ipsum dolor sit amet consectetur. Turpis venenatis tincidunt",
  },
  {
    id: 2,
    bg: "#A4D7F2",
    imageSrc: LightBulb,
    heading: "SINAQLAR",
    text: "Lorem ipsum dolor sit amet consectetur. Turpis venenatis tincidunt",
  },
];

const FeatureCardSection = () => (
  <Flex direction="column" justifyContent="center" alignItems="center">
    <Heading as="h3" size="lg" mb={8}>
      BİZİMLƏ SINA!
    </Heading>

    <Flex
      justifyContent="center"
      gap={4}
      direction={{ base: "column", lg: "row" }}
      alignItems="center"
    >
      {cardData.map(({ id, bg, imageSrc, heading, text }) => (
        <FeatureCard
          key={id}
          bg={bg}
          imageSrc={imageSrc}
          heading={heading}
          text={text}
        />
      ))}
    </Flex>
  </Flex>
);

export default FeatureCardSection;
