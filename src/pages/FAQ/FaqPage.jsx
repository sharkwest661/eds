import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import FaqBackground from "../../assets/images/faqBackground.png";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import { Minus, Plus } from "@phosphor-icons/react";

// Static data for accordion items
const accordionData = [
  {
    question: "Lorem ipsum dolor sit amet consectetur. Eget ultrices turpis?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    question: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem?",
    answer:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  },
  {
    question: "At vero eos et accusamus et iusto odio dignissimos ducimus?",
    answer:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
  },
  {
    question: "Lorem ipsum dolor sit amet consectetur. Eget ultrices turpis?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    question: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem?",
    answer:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  },
  {
    question: "At vero eos et accusamus et iusto odio dignissimos ducimus?",
    answer:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
  },
];

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
  };

  // Filter accordion data based on search input
  const filteredData = accordionData.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Stack mb="200px">
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="55vh"
          backgroundImage={`url(${FaqBackground})`}
          backgroundSize="cover"
          backgroundPosition="center"
          zIndex="-1"
        />

        <Text
          textAlign="center"
          color="white"
          fontSize="60px"
          fontWeight="bold"
        >
          Tez-tez verilən suallar
        </Text>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop="20px"
        >
          <Box
            display="flex"
            alignItems="center"
            bg="white"
            borderRadius="10px"
            border="0"
            width="500px"
            padding="10px 30px"
          >
            <MagnifyingGlass size={32} />
            <Input
              border="0"
              paddingLeft="30px"
              placeholder="vaxt itirmədən lazım olanı sualı axtar"
              focusBorderColor="transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
        </Box>
      </Stack>

      {/* Accordion section that renders filtered data */}
      <Accordion allowMultiple mb="20px">
        {filteredData.map((item, index) => (
          <AccordionItem key={index} borderBottom="1px solid #F5B898">
            {({ isExpanded }) => (
              <>
                <h2>
                  <AccordionButton
                    p="30px"
                    backgroundColor={isExpanded ? "#F5B898" : "transparent"}
                    _hover={{ backgroundColor: "#F5B898" }}
                  >
                    <Box
                      as="span"
                      flex="1"
                      textAlign="left"
                      fontSize="32px"
                      fontWeight="bold"
                    >
                      {item.question}
                    </Box>
                    {isExpanded ? <Minus size={32} /> : <Plus size={32} />}
                  </AccordionButton>
                </h2>
                <AccordionPanel
                  pb={4}
                  backgroundColor={isExpanded ? "#F5B898" : "transparent"}
                >
                  {item.answer}
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        ))}
      </Accordion>

      <Box as="form" onSubmit={handleSubmit} p={4} maxWidth="700px">
        <Flex direction={{ base: "column", md: "row" }} gap={4} mb={4}>
          <FormControl id="name" flex="1" isRequired>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ad"
              border="1px solid #FF7D39"
              height="60px"
            />
          </FormControl>

          <FormControl id="email" flex="1" isRequired>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-mail"
              border="1px solid #FF7D39"
              height="60px"
            />
          </FormControl>
        </Flex>

        <FormControl id="message" mb={4} isRequired>
          <Textarea
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            placeholder="Mesajınızı yazın"
            border="1px solid #FF7D39"
            height="200px"
            minH="100px"
            maxH="300px"
          />
        </FormControl>

        <Button type="submit" colorScheme="teal" mb="100px">
          Submit
        </Button>
      </Box>
    </>
  );
}
