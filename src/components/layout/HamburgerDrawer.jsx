import { useRef } from "react";
import {
  Box,
  Button,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  UnorderedList,
  ListItem,
  Text,
} from "@chakra-ui/react";
import {
  ChartLine,
  CreditCard,
  Exam,
  House,
  Info,
  List,
  Question,
  SignIn,
} from "@phosphor-icons/react";
import { NavLink } from "react-router-dom";

const sidebarMenuList = [
  { title: "Home", path: "/", icon: <House size={32} /> },
  { title: "About", path: "/about", icon: <Info size={32} /> },
  { title: "Login", path: "/login", icon: <SignIn size={32} /> },
  { title: "Register", path: "/register", icon: <SignIn size={32} /> },
  { title: "Faq", path: "/faq", icon: <Question size={32} /> },
  { title: "Exams", path: "/exams", icon: <Exam size={32} /> },
  { title: "Payment", path: "/payment", icon: <CreditCard size={32} /> },
  { title: "Statistics", path: "/statistics", icon: <ChartLine size={32} /> },
];

export const HamburgerDrawer = ({ isDarkBgPages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  // Define button styles based on isDarkBgPages
  const buttonStyles = {
    color: isDarkBgPages ? "#ffffff" : "#111", // Change color based on the page
    bg: "transparent", // Keep background transparent
    _hover: {
      bg: isDarkBgPages ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)", // Light hover effect
    },
  };

  return (
    <Box>
      <Button
        ref={btnRef}
        onClick={onOpen}
        variant="ghost"
        padding={0}
        sx={buttonStyles} // Apply conditional styles
      >
        <List size={32} color={buttonStyles.color} />{" "}
        {/* Ensure icon color matches button text */}
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent bg="dark" color="white">
          <DrawerCloseButton />
          <DrawerHeader></DrawerHeader>

          <DrawerBody>
            <UnorderedList
              styleType="none"
              display="flex"
              flexDirection="column"
              gap={6}
            >
              {sidebarMenuList.map((menu, ind) => (
                <ListItem key={ind} display="flex" alignItems="center" gap={5}>
                  {menu?.icon}
                  <NavLink to={menu.path}>
                    <Text
                      fontSize={24}
                      transition=".4s"
                      _hover={{ textShadow: "2px 2px #ffffff40" }}
                    >
                      {menu.title}
                    </Text>
                  </NavLink>
                </ListItem>
              ))}
            </UnorderedList>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
