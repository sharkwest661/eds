import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  List,
  ListItem,
  Skeleton,
  Stack,
  Textarea,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Question } from "@phosphor-icons/react";
import { Controller, useForm } from "react-hook-form";
import { RenderHTML } from "../../components/common/RenderHTML";
import {
  ExamAnswerTypes,
  QuestionTypesList,
} from "../../utils/statics/constants";
import { useExamStore } from "../../store/useExamStore";

export const QuestionRenderer = ({ question, loading, examSubjectId }) => {
  const examAnswers = useExamStore((state) => state.examAnswers);
  const setExamAnswerType = useExamStore((state) => state.setExamAnswerType);
  const selectedQuizAnswer = examAnswers[examSubjectId]?.[question?.questionId];

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;

    const newType = isChecked
      ? "marked"
      : selectedQuizAnswer?.value
      ? "answered"
      : "missed";

    setExamAnswerType(examSubjectId, question?.questionId, newType);
  };

  if (loading) {
    return (
      <VStack w="full">
        <Skeleton height="30px" w="full" />
        <Skeleton height="30px" w="full" />
        <Skeleton height="30px" w="full" />
      </VStack>
    );
  }

  if (!question) {
    return (
      <Alert status="error" w="max-content">
        <AlertIcon />
        <AlertTitle>Xeta</AlertTitle>
        <AlertDescription>Sual tapilmadi!</AlertDescription>
      </Alert>
    );
  }

  return (
    <Box>
      {QuestionTypesList[question?.questionType] !== "open" && (
        <HStack alignItems="center" mb="2rem">
          <VStack align="center" alignItems="flex-start">
            {/* <Heading as="h5" fontSize="30px"> */}
            <RenderHTML htmlString={question?.questionText} />
            {/* </Heading> */}
          </VStack>
          <Tooltip label="quiz">
            <Question size={40} />
          </Tooltip>
        </HStack>
      )}

      <QuestionBody question={question} examSubjectId={examSubjectId} />
      <FormControl display="flex" justifyContent="flex-end">
        <Checkbox
          isChecked={selectedQuizAnswer?.type === "marked"}
          onChange={handleCheckboxChange}
        >
          Yeniden bax
        </Checkbox>
      </FormControl>
    </Box>
  );
};

const QuestionBody = ({ question, examSubjectId }) => {
  const examAnswers = useExamStore((state) => state.examAnswers);
  const setExamAnswersByQuestion = useExamStore(
    (state) => state.setExamAnswersByQuestion
  );
  const selectedQuestionAnswer =
    examAnswers?.[examSubjectId]?.[question?.questionId];
  // console.log("question", question);
  const { register, handleSubmit, setValue, control } = useForm({
    defaultValues: {
      textAreaAnswer: selectedQuestionAnswer?.value,
      matrissa: {
        1: [],
        2: [],
        3: [],
      },
    },
  });

  useEffect(() => {
    setValue("textAreaAnswer", selectedQuestionAnswer?.value);
  }, [selectedQuestionAnswer, setValue]);

  if (QuestionTypesList[question?.questionType] === "closed") {
    return (
      <List display="flex" flexDirection="column" gap="1rem">
        {question?.answers.map((answer) => (
          <ListItem
            key={answer?.id}
            display="flex"
            alignItems="center"
            gap="2rem"
          >
            <Button
              borderRadius={0}
              border={
                selectedQuestionAnswer?.value == answer?.id ? "" : "1px solid"
              }
              display="flex"
              fontSize="24px"
              w="40px"
              h="40px"
              justifyContent="center"
              alignItems="center"
              bg={
                selectedQuestionAnswer?.value == answer?.id ? "lightBlue" : ""
              }
              onClick={() =>
                setExamAnswersByQuestion(examSubjectId, question.questionId, {
                  value: answer?.id,
                  type:
                    selectedQuestionAnswer?.type === ExamAnswerTypes.marked
                      ? ExamAnswerTypes.marked
                      : ExamAnswerTypes.answered,
                })
              }
            >
              {answer?.variant}
            </Button>
            <RenderHTML htmlString={answer?.answer} />
          </ListItem>
        ))}
      </List>
    );
  }

  if (
    QuestionTypesList[question?.questionType] === "open" ||
    QuestionTypesList[question?.questionType] === "full"
  ) {
    return (
      <VStack gap={5}>
        {QuestionTypesList[question?.questionType] === "open" && (
          <>
            <RenderHTML htmlString={question?.questionHeaderText} />
            {/* <Heading as="h5" fontSize="30px"> */}
            <RenderHTML htmlString={question?.questionText} />
            {/* </Heading> */}
          </>
        )}
        <Textarea
          placeholder="cavabi yazin"
          maxH="300px"
          {...register("textAreaAnswer")}
        />
        <Button
          onClick={handleSubmit((data) =>
            setExamAnswersByQuestion(examSubjectId, question.questionId, {
              value: data?.textAreaAnswer,
              type:
                selectedQuestionAnswer?.type === ExamAnswerTypes.marked
                  ? ExamAnswerTypes.marked
                  : ExamAnswerTypes.answered,
            })
          )}
        >
          Submit answer
        </Button>
      </VStack>
    );
  }

  if (QuestionTypesList[question?.questionType] === "matrissa") {
    return (
      <VStack gap={6}>
        {[1, 2, 3].map((num) => (
          <FormControl key={num} as={Flex} alignItems="center" gap={10}>
            <FormLabel m="0">{num}</FormLabel>
            <Controller
              name={`matrissa.${num}`}
              control={control}
              render={({ field }) => (
                <CheckboxGroup
                  {...field}
                  onChange={(val) => field.onChange(val)} // this ensures the value gets updated
                  value={field?.value || []}
                >
                  <Stack spacing={8} direction="row">
                    <Checkbox value="a">a</Checkbox>
                    <Checkbox value="b">b</Checkbox>
                    <Checkbox value="c">c</Checkbox>
                    <Checkbox value="d">d</Checkbox>
                    <Checkbox value="e">e</Checkbox>
                  </Stack>
                </CheckboxGroup>
              )}
            />
          </FormControl>
        ))}
        <Button
          onClick={handleSubmit((data) => {
            setExamAnswersByQuestion(examSubjectId, question.questionId, {
              value: data?.matrissa,
              type:
                selectedQuestionAnswer?.type === ExamAnswerTypes.marked
                  ? ExamAnswerTypes.marked
                  : ExamAnswerTypes.answered,
            });
          })}
        >
          Submit answer
        </Button>
      </VStack>
    );
  }
};
