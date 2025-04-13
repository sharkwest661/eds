import { Container } from "@chakra-ui/react";
import { Outlet } from "react-router";
import { Header } from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export const RootLayout = () => {
  return (
    <Container maxWidth="1500px" padding={{ base: "1rem" }}>
      <Header />
      <Container
        as="main"
        maxWidth="1200px"
        padding={{ base: "1rem", sm: "1.5rem", md: "2rem" }}
      >
        <Outlet />
      </Container>
      <Footer />
    </Container>
  );
};
