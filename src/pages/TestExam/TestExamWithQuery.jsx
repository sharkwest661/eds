import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  Text,
  VStack,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
} from "@chakra-ui/react";

import { useLocation, useNavigate } from "react-router";
import { Navigation } from "./Navigation";
import { QuestionRenderer } from "./QuestionRenderer";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useExamStore } from "../../store/useExamStore";
import {
  useExamQuestions,
  useSubmitExamAnswers,
} from "../../services/query/examQueries";
import { useAuthStore } from "../../store/useAuthStore";

const TestExamWithQuery = () => {
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const setExamAnswers = useExamStore((state) => state.setExamAnswers);
  const toast = useToast();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);

  const location = useLocation();
  const examSubject = location?.state?.subject;
  const examSubjectId = location?.pathname.split("/")[2];

  // Log authentication state for debugging
  useEffect(() => {
    console.log("TestExam auth state:", { isAuthenticated, hasToken: !!token });
  }, [isAuthenticated, token]);

  // Use Tanstack Query to fetch exam questions with error handling
  const {
    data: questions,
    isLoading,
    error,
    isError,
    refetch,
  } = useExamQuestions(examSubjectId);

  // Use Tanstack Query mutation for submitting answers
  const { mutate: submitAnswers, isLoading: isSubmitting } =
    useSubmitExamAnswers();

  // Initialize exam answers when questions are loaded
  useEffect(() => {
    if (questions) {
      // Check localStorage for existing exam answers
      const savedExamAnswers = JSON.parse(localStorage.getItem("examAnswers"));

      if (!savedExamAnswers || !savedExamAnswers[examSubjectId]) {
        // Initialize default answers with type "missed"
        const newExamAnswers = questions.reduce((acc, question) => {
          acc[question.questionId] = { value: "", type: "missed" };
          return acc;
        }, {});

        // Update Zustand store
        setExamAnswers(examSubjectId, newExamAnswers);
      }
    }
  }, [questions, examSubjectId, setExamAnswers]);

  // Handle exam submission
  const handleSubmit = () => {
    const examAnswers = useExamStore.getState().examAnswers[examSubjectId];

    submitAnswers(
      { examId: examSubjectId, answers: examAnswers },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Your answers have been submitted successfully",
            status: "success",
            duration: 5000,
            position: "bottom-right",
          });

          // Navigate to results or another page
          setTimeout(() => {
            navigate("/statistics");
          }, 1500);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to submit answers",
            status: "error",
            duration: 5000,
            position: "bottom-right",
          });
        },
      }
    );
  };

  // Handle authentication errors
  if (isError && error?.message?.includes("Authentication")) {
    return (
      <Alert
        status="warning"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
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
          <Button variant="ghost" onClick={() => refetch()}>
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="400px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Alert status="error" my={8}>
        <AlertIcon />
        <Box>
          <Text fontWeight="bold">Failed to load exam questions</Text>
          <Text>{error.message}</Text>
          <Button mt={3} onClick={() => refetch()}>
            Try Again
          </Button>
        </Box>
      </Alert>
    );
  }

  return (
    <VStack align="center" gap="2rem">
      <Heading textAlign="center">{examSubject}</Heading>

      <Navigation
        questionList={questions}
        currentQuestion={currentQuestionId}
        setCurrentQuestion={setCurrentQuestionId}
        examSubjectId={examSubjectId}
      />

      <QuestionRenderer
        question={questions?.[currentQuestionId - 1]}
        loading={isLoading}
        examSubjectId={examSubjectId}
      />

      <HStack width="100%" justifyContent="space-between">
        <Button
          bg="transparent"
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          isDisabled={currentQuestionId <= 1}
          onClick={() => setCurrentQuestionId((prev) => prev - 1)}
        >
          <ArrowLeft size="32" />
          <Text>Əvvəlki</Text>
        </Button>

        {currentQuestionId >= questions?.length ? (
          <Button
            colorScheme="teal"
            isLoading={isSubmitting}
            loadingText="Submitting..."
            onClick={handleSubmit}
          >
            Təqdim et
          </Button>
        ) : (
          <Button
            bg="transparent"
            display="flex"
            flexDirection="column"
            isDisabled={!questions || currentQuestionId >= questions.length}
            onClick={() => setCurrentQuestionId((prev) => prev + 1)}
          >
            <ArrowRight size="32" />
            Sonraki
          </Button>
        )}
      </HStack>
    </VStack>
  );
};

export default TestExamWithQuery;
