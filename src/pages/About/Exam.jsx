import React from "react";
import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import Image1 from "../../assets/images/image1.png";
import Image2 from "../../assets/images/image2.png";
import Image3 from "../../assets/images/image3.png";
import { useNavigate } from "react-router";
import { textTemplates } from "./../../utils/statics/templates";

function Exam() {
  const navigate = useNavigate();
  return (
    <Box mt="50rem">
      <Box textAlign="center" mb="50px">
        <Heading as="h3" size="lg">
          SINAQLAR
        </Heading>
        <Text>{textTemplates.loremText}</Text>
      </Box>
      <Flex gap="50px">
        <Box>
          <Flex gap={10}>
            <Image borderRadius="20px" src={Image1} />
            <Box>
              <Image borderRadius="20px" src={Image2} paddingBottom={2} />
              <Image borderRadius="20px" src={Image3} paddingTop={2} />
            </Box>
          </Flex>
        </Box>
        <Box>
          <Text fontSize="40px" fontWeight="700" textColor="#484848" mb={2}>
            Riyaziyyat
          </Text>
          <Text fontSize="16px" fontWeight="700" textColor="#484848" mb={3}>
            18.05.2023
          </Text>
          <Text mb="80px">Lorem ipsum dolor sit amet consectetur...</Text>
          <Button bg="#A4D7F2" w="100%" onClick={() => navigate("/register")}>
            QEYDİYYATDAN KEÇ
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}

export default Exam;
