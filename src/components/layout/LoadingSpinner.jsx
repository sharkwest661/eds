import { Flex } from "@chakra-ui/react";
import { PacmanLoader } from "react-spinners";

export const LoadingSpinner = () => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      height="100vh"
      overflow="hidden"
    >
      <PacmanLoader />
    </Flex>
  );
};
