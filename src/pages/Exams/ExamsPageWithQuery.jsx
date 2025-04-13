import React, { useState, useEffect } from "react";
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
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import ExamsBackground from "../../assets/images/examsBackground.png";
import { useNavigate } from "react-router";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useCompanyStore } from "../../store/useCompanyStore";
import { useAuthStore } from "../../store/useAuthStore";
import { Calendar, MagnifyingGlass } from "@phosphor-icons/react";
import dayjs from "dayjs";
import { formatDate } from "../../utils/tools/helpers";
import ExamSubjectCard from "../Home/ExamSubjectCard";
import { useTopTopics, useExams } from "../../services/query/examQueries";

// Colors array for the exam subject cards
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

export default function ExamsPageWithQuery() {
  // State for date range selection
  const [selected, setSelected] = useState({
    from: dayjs(new Date()).subtract(7, "days").toDate(),
    to: new Date(),
  });
  const [examType, setExamType] = useState("");
  const [searchEnabled, setSearchEnabled] = useState(false);

  // Navigation hook
  const navigate = useNavigate();

  // Auth state
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);

  // Log authentication state for debugging
  useEffect(() => {
    console.log("ExamsPage auth state:", {
      isAuthenticated,
      hasToken: !!token,
    });
  }, [isAuthenticated, token]);

  // Company data from Zustand store
  const companyData = useCompanyStore((state) => state.companyData);

  // Query for top topics - runs immediately and doesn't depend on user actions
  const {
    data: topTopics,
    isLoading: isLoadingTopTopics,
    error: topTopicsError,
    refetch: refetchTopTopics,
  } = useTopTopics();

  // Filter parameters for exams query
  const filters = {
    examType,
    beginDate: formatDate(selected?.from),
    endDate: formatDate(selected?.to),
  };

  // Query for exams with filters - only runs when search is enabled
  const {
    data: exams,
    isLoading: isLoadingExams,
    error: examsError,
    refetch: refetchExams,
  } = useExams(filters, {
    enabled: searchEnabled, // Only fetch when the user explicitly requests it
  });

  // Handle search button click
  const handleSearch = () => {
    setSearchEnabled(true);
    refetchExams().catch((error) => {
      // Explicitly catch and handle errors to prevent automatic redirects
      console.error("Search error:", error);
      // Don't automatically logout - let the error component handle display
    });
  };

  // Handle authentication errors for top topics
  if (topTopicsError && topTopicsError.message?.includes("Authentication")) {
    return (
      <Alert
        status="warning"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
        my={8}
        borderRadius="md"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Authentication Required
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          <Text mb={4}>
            Your session may have expired. Please log in again to continue.
          </Text>
          <Button colorScheme="blue" onClick={() => navigate("/login")} mr={3}>
            Log In
          </Button>
          <Button variant="ghost" onClick={() => refetchTopTopics()}>
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Handle authentication errors for exams search
  if (examsError && examsError.message?.includes("Authentication")) {
    return (
      <Alert
        status="warning"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
        my={8}
        borderRadius="md"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Authentication Required
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          <Text mb={4}>
            Your session may have expired. Please log in again to continue.
          </Text>
          <Button colorScheme="blue" onClick={() => navigate("/login")} mr={3}>
            Log In
          </Button>
          <Button variant="ghost" onClick={() => refetchExams()}>
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      {/* Header section with background image */}
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

      {/* Exams section */}
      <Text fontSize="40px" fontWeight="semiBold" mb={10}>
        SINAQLAR
      </Text>

      {/* Filter controls section */}
      <HStack
        alignItems="flex-start"
        justifyContent="flex-end"
        gap="1rem"
        mb={20}
      >
        {/* Date picker popover */}
        <Popover>
          <PopoverTrigger>
            <IconButton
              icon={<Calendar />}
              isDisabled={isLoadingExams}
              aria-label="Select date range"
            />
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

        {/* Exam type selector */}
        <Select
          placeholder="Choose exam type"
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          marginLeft={0}
          width={300}
          isDisabled={isLoadingExams}
        >
          {companyData?.examTypes?.map((type) => (
            <option value={type} key={type}>
              {type}
            </option>
          ))}
        </Select>

        {/* Search button */}
        <IconButton
          icon={<MagnifyingGlass />}
          onClick={handleSearch}
          isLoading={isLoadingExams}
          loadingText="Searching..."
          aria-label="Search exams"
        />
      </HStack>

      {/* Exams results section */}
      <Box mb={10}>
        {/* Show general error if any */}
        {examsError && !examsError.message?.includes("Authentication") && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            Failed to load exams: {examsError.message}
          </Alert>
        )}

        {/* Show loading spinner or exam cards */}
        {isLoadingExams ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="xl" />
          </Flex>
        ) : (
          searchEnabled && (
            <Flex wrap="wrap" justify="center" gap={5}>
              {exams && exams.length === 0 ? (
                <Text>No exams found matching your criteria</Text>
              ) : (
                exams &&
                exams.map((exam) => (
                  <Card variant="outline" key={exam?.id} maxW="300px">
                    <CardHeader fontWeight="bold">{exam?.name}</CardHeader>
                    <CardBody>
                      <Text>Exam date: {formatDate(exam?.examDate)}</Text>
                      <Text>Start time: {exam?.startTime}</Text>
                      <Text>End time: {exam?.endTime}</Text>
                    </CardBody>
                  </Card>
                ))
              )}
            </Flex>
          )
        )}
      </Box>

      {/* Top Topics section */}
      <Box mb="200px">
        {/* Show general error if any */}
        {topTopicsError &&
          !topTopicsError.message?.includes("Authentication") && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              Failed to load topics: {topTopicsError.message}
            </Alert>
          )}

        {/* Show loading spinner or topic cards */}
        {isLoadingTopTopics ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <Flex
            justifyContent="center"
            gap={4}
            direction={{ base: "column", lg: "row" }}
            alignItems="center"
          >
            {topTopics &&
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
              ))}
          </Flex>
        )}
      </Box>
    </>
  );
}
