import React from "react";
import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import Azlang from "../../assets/images/azlang.png";
import Math2 from "../../assets/images/math2.png";
import Math from "../../assets/images/math.png";
import SubjectCard from "./ExamSubjectCard";

const subjects = [
  {
    title: "Riyaziyyat",
    description: "Lorem ipsum dolor sit amet consectetur.",
    imageSrc: Math,
    borderColor: "#4AE49D",
  },
  {
    title: "Azərbaycan Dili",
    description: "Lorem ipsum dolor sit amet consectetur.",
    imageSrc: Azlang,
    borderColor: "#FFA753",
  },
  {
    title: "Riyaziyyat-2",
    description: "Lorem ipsum dolor sit amet consectetur.",
    imageSrc: Math2,
    borderColor: "#28B5FF",
  },
];

export default function TopSubjects() {
  return (
    <>
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        mb="100px"
      >
        <Heading as="h3" size="lg" mb={8}>
          TOP FƏNLƏR!
        </Heading>
        <Flex
          justifyContent="center"
          gap={4}
          direction={{ base: "column", lg: "row" }}
          alignItems="center"
        >
          {subjects.map((subject, index) => (
            <SubjectCard
              key={index}
              title={subject.title}
              description={subject.description}
              imageSrc={subject.imageSrc}
              borderColor={subject.borderColor}
              staticImage={true}
            />
          ))}
        </Flex>
      </Flex>
    </>
  );
}
