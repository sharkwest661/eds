import { Flex, Box, Heading, Text, Image } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { RenderHTML } from "./../../components/common/RenderHTML";
import { EDU_URL } from "../../services/api/constants";

const ExamSubjectCard = ({
  title,
  description,
  imageSrc,
  borderColor,
  onClick,
  staticImage = false,
}) => {
  const [svgMarkup, setSvgMarkup] = useState("");

  useEffect(() => {
    if (!staticImage) {
      initSrc();
    }
  }, []);

  const initSrc = async () => {
    try {
      const url = EDU_URL + imageSrc;
      const res = await axios(url);
      if (res.data) {
        setSvgMarkup(
          res.data
            .replace(/<svg/, '<svg width="50" height="50"')
            .replace(/width="[^"]*"/, 'width="50"')
            .replace(/height="[^"]*"/, 'height="50"')
        );
      }
    } catch (error) {
      console.error("initSrc error: ", error);
    }
  };

  return (
    <Box
      bg="transparent"
      w={{ base: "full", sm: "320px" }}
      height="200px"
      p="50px 30px"
      borderRadius="10px"
      border={`1px solid ${borderColor}`}
      cursor="pointer"
      transition="outline 0.3s ease, transform 0.3s ease"
      _hover={{
        outline: `3px solid ${borderColor}`,
        transform: "scale(1.02)",
      }}
      onClick={onClick}
    >
      <Flex justifyContent="center" gap={4} alignItems="center">
        {staticImage && <Image src={imageSrc} alt={title} />}
        {!staticImage && <RenderHTML htmlString={svgMarkup} />}

        <Box>
          <Heading as="h5" size="md">
            {title}
          </Heading>
          <Text>{description}</Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default ExamSubjectCard;
