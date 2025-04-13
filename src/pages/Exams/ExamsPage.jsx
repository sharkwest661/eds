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
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import ExamsBackground from "../../assets/images/examsBackground.png";
import Azlang from "../../assets/images/azlang.png";
import Math2 from "../../assets/images/math2.png";
import Math from "../../assets/images/math.png";
import ExamSubjectCard from "../Home/ExamSubjectCard";
import { getExams, getTopTopics } from "../../services/api/apiService";
import { useNavigate } from "react-router";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useCompanyStore } from "../../store/useCompanyStore";
import { Calendar, MagnifyingGlass } from "@phosphor-icons/react";
import dayjs from "dayjs";
import { formatDate } from "../../utils/tools/helpers";

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

export default function ExamsPage() {
  const [topTopics, setTopTopics] = useState([]);
  const [selected, setSelected] = useState({
    from: dayjs(new Date()).subtract(7, "days").toDate(),
    to: new Date(),
  });
  const [examType, setExamType] = useState("");
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();
  const companyData = useCompanyStore((state) => state.companyData);

  useEffect(() => {
    initTopTopics();
    initExams();
  }, []);

  const initTopTopics = async () => {
    try {
      const result = await getTopTopics();
      if (result.data) {
        setTopTopics(result.data);
      }
    } catch (error) {
      console.error("getTopTopics error", error);
    }
  };

  const initExams = async () => {
    const body = {
      examType,
      beginDate: formatDate(selected?.from),
      endDate: formatDate(selected?.to),
    };
    try {
      const res = await getExams(body);
      if (res?.data) {
        setExams(res.data);
      }
    } catch (error) {
      console.error("initExams error: ", error);
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
          // backgroundSize="contain"
          // backgroundPosition="center"
          // backgroundRepeat="no-repeat"
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
            <IconButton icon={<Calendar />} />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
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
        >
          {companyData?.examTypes?.map((type) => (
            <option value={type} key={type}>
              {type}
            </option>
          ))}
        </Select>

        <IconButton icon={<MagnifyingGlass />} onClick={initExams} />
      </HStack>

      {exams && (
        <Flex wrap="wrap" justify="center" mb={10} gap={5}>
          {exams.map((exam) => (
            <Card variant="outline" key={exam?.id}>
              <CardHeader>{exam?.name}</CardHeader>
              <CardBody>
                <Text>Exam date: {formatDate(exam?.examDate)}</Text>
                <Text>Start time: {exam?.startTime}</Text>
                <Text>End date: {exam?.endTime}</Text>
              </CardBody>
            </Card>
          ))}
        </Flex>
      )}

      <Flex
        justifyContent="center"
        gap={4}
        direction={{ base: "column", lg: "row" }}
        alignItems="center"
        mb="200px"
      >
        {topTopics.map((topic, index) => (
          <ExamSubjectCard
            key={index}
            title={topic?.subject}
            description={topic?.subject}
            imageSrc={topic?.iconUrl}
            borderColor={colors[index]}
            onClick={() =>
              navigate(`/test/${index + 1}`, {
                state: { subject: topic?.subject },
              })
            }
          />
        ))}
      </Flex>
    </>
  );
}
