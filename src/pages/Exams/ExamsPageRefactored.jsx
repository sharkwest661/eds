// src/pages/Exams/ExamsPageRefactored.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Text,
  Flex,
  HStack,
  Select,
  Button,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Card,
  CardHeader,
  CardBody,
  useToast,
} from "@chakra-ui/react";
import ExamsBackground from "../../assets/images/examsBackground.png";
import {
  getExams,
  getExamTypes,
  getTopTopics,
} from "../../services/api/queries/examQueries";
import { useNavigate } from "react-router";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useCompanyStore } from "../../store/useCompanyStore";
import { Calendar, MagnifyingGlass } from "@phosphor-icons/react";
import dayjs from "dayjs";
import { formatDate } from "../../utils/tools/helpers";
import ExamSubjectCard from "../Home/ExamSubjectCard";

// Constants extracted for reusability and easier maintenance
const colors = [
  "#4AE49D", // Original green-blue
  "#FFA753", // Original orange
  "#28B5FF", // Original bright blue
  "#FFD700", // Gold yellow
  "#FF6347", // Tomato red
  "#7B68EE", // Medium slate blue
  "#FF69B4", // Hot pink
  "#00FA9A", // Medium spring green
  "#FF4500", // Orange red
  "#6A5ACD", // Slate blue
];

export default function ExamsPageRefactored() {
  // State management
  const [topTopics, setTopTopics] = useState([]);
  const [selected, setSelected] = useState({
    from: dayjs(new Date()).subtract(7, "days").toDate(),
    to: new Date(),
  });
  const [examType, setExamType] = useState("");
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState({
    topics: false,
    exams: false,
  });

  // Hooks
  const navigate = useNavigate();
  const toast = useToast();
  const companyData = useCompanyStore((state) => state.companyData);

  useEffect(() => {
    initTopTopics();
    initExamTypes();
  }, []);

  // Fetch top topics using the refactored API service
  const initTopTopics = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, topics: true }));
      const data = await getTopTopics();
      if (data) {
        setTopTopics(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch top topics",
        status: "error",
        duration: 5000,
        position: "bottom-right",
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, topics: false }));
    }
  };

  // Fetch exam types if not available in company data
  const initExamTypes = async () => {
    if (!companyData?.examTypes?.length) {
      try {
        const data = await getExamTypes();
        // This would be handled by the store normally, but shown for example
        if (data) {
          console.log("Exam types fetched:", data);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch exam types",
          status: "error",
          duration: 5000,
          position: "bottom-right",
        });
      }
    }
  };

  // Fetch exams with the filter criteria
  const initExams = async () => {
    const filters = {
      examType,
      beginDate: formatDate(selected?.from),
      endDate: formatDate(selected?.to),
    };

    try {
      setIsLoading((prev) => ({ ...prev, exams: true }));
      const data = await getExams(filters);
      if (data) {
        setExams(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch exams",
        status: "error",
        duration: 5000,
        position: "bottom-right",
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, exams: false }));
    }
  };

  return (
    <>
      <Stack mb="200px">
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="45vh"
          backgroundImage={`url(${ExamsBackground})`}
          backgroundSize="cover"
          zIndex="-1"
        />

        <Text
          textAlign="center"
          color="white"
          fontSize={{ base: "40px", sm: "60px" }}
          fontWeight="bold"
          mb="50px"
        >
          İmtahanlar
        </Text>
      </Stack>
      <Text fontSize="40px" fontWeight="semiBold" mb={10}>
        SINAQLAR
      </Text>
      <HStack
        alignItems="flex-start"
        justifyContent="flex-end"
        gap="1rem"
        mb={20}
      >
        <Popover>
          <PopoverTrigger>
            <IconButton icon={<Calendar />} isDisabled={isLoading.exams} />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverBody>
              <Box maxW="250px">
                <DayPicker
                  mode="range"
                  min={1}
                  max={60}
                  selected={selected}
                  onSelect={setSelected}
                />
              </Box>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Select
          placeholder="Choose exam type"
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          marginLeft={0}
          width={300}
          isDisabled={isLoading.exams}
        >
          {companyData?.examTypes?.map((type) => (
            <option value={type} key={type}>
              {type}
            </option>
          ))}
        </Select>

        <IconButton
          icon={<MagnifyingGlass />}
          onClick={initExams}
          isLoading={isLoading.exams}
        />
      </HStack>

      {exams && (
        <Flex wrap="wrap" justify="center" mb={10} gap={5}>
          {exams.length === 0 && !isLoading.exams ? (
            <Text>No exams found matching your criteria</Text>
          ) : (
            exams.map((exam) => (
              <Card variant="outline" key={exam?.id}>
                <CardHeader>{exam?.name}</CardHeader>
                <CardBody>
                  <Text>Exam date: {formatDate(exam?.examDate)}</Text>
                  <Text>Start time: {exam?.startTime}</Text>
                  <Text>End time: {exam?.endTime}</Text>
                </CardBody>
              </Card>
            ))
          )}
        </Flex>
      )}

      <Flex
        justifyContent="center"
        gap={4}
        direction={{ base: "column", lg: "row" }}
        alignItems="center"
        mb="200px"
      >
        {isLoading.topics ? (
          <Text>Loading topics...</Text>
        ) : (
          topTopics.map((topic, index) => (
            <ExamSubjectCard
              key={index}
              title={topic?.subject}
              description={topic?.subject}
              imageSrc={topic?.iconUrl}
              borderColor={colors[index % colors.length]}
              onClick={() =>
                navigate(`/test/${index + 1}`, {
                  state: { subject: topic?.subject },
                })
              }
            />
          ))
        )}
      </Flex>
    </>
  );
}
