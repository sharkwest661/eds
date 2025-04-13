import {
  Box,
  Flex,
  Heading,
  HStack,
  List,
  ListItem,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { DotsNine } from "@phosphor-icons/react";
import React from "react";
import { useExamStore } from "../../store/useExamStore";

const navigationLabels = [
  { label: "Cavablandırılmış", color: "navigation.answered" },
  { label: "Buraxılmış", color: "navigation.missed" },
  { label: "İşarələnmiş", color: "navigation.marked" },
];

const hardCodedExamId = 1;

export const Navigation = ({
  currentQuestion,
  setCurrentQuestion,
  examSubjectId,
}) => {
  const examAnswers = useExamStore((state) => state.examAnswers);
  const changeQuestion = useExamStore((state) => state.changeQuestion);

  return (
    <Box
      border="2px solid #FF7D39"
      borderRadius="4px"
      p={{ base: ".5rem", sm: "1rem" }}
      w={{ base: "100%", sm: "300px" }}
      aspectRatio="1/1"
    >
      <VStack gap={7}>
        <HStack>
          <DotsNine size={32} />
          <Heading as="h5">Suallar</Heading>
        </HStack>
        <SimpleGrid columns={5} spacing={3}>
          {examAnswers[examSubjectId] &&
            Object.values(examAnswers[examSubjectId]).map((answer, ind) => (
              <Flex
                key={ind}
                borderRadius="50%"
                bg={`navigation.${answer?.type}`}
                w="32px"
                h="32px"
                justifyContent="center"
                alignItems="center"
                cursor="pointer"
                onClick={() => {
                  changeQuestion(currentQuestion, ind + 1);
                  setCurrentQuestion(ind + 1);
                }}
              >
                <Text color="black">{ind + 1}</Text>
              </Flex>
            ))}
        </SimpleGrid>
        <List>
          {navigationLabels.map((nav) => (
            <ListItem
              display="flex"
              gap={2}
              alignItems="center"
              key={nav.label}
            >
              <Box bg={nav.color} borderRadius="50%" w="9px" h="9px"></Box>
              <Text>{nav.label}</Text>
            </ListItem>
          ))}
        </List>
      </VStack>
    </Box>
  );
};
