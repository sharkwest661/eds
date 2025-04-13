import {
  Container,
  Image,
  Select,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
  Link,
  useToast,
} from "@chakra-ui/react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

import { HamburgerDrawer } from "./HamburgerDrawer";
import { useCompanyStore } from "../../store/useCompanyStore";
import { isEmptyObject } from "../../utils/tools/helpers";
import { EDU_URL } from "../../services/api/constants";
import { useAuthStore } from "../../store/useAuthStore";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { User } from "@phosphor-icons/react";

export const Header = () => {
  const { companyData, setLanguage } = useCompanyStore(
    useShallow((state) => ({
      companyData: state.companyData,
      setLanguage: state.setLanguage,
    }))
  );

  const { isAuthenticated, user, logout } = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      logout: state.logout,
    }))
  );

  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const pagePath = location.pathname;
  const darkBgPages = ["/faq", "/exams"]; // Replace with your actual paths
  const isDarkBgPages = darkBgPages.includes(pagePath);

  const handleLogout = async () => {
    // Set loading state if needed
    try {
      const success = await logout();

      // Always consider the user logged out locally
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
        status: "success",
        duration: 3000,
        position: "bottom-right",
      });

      // Always navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Error during logout process:", error);

      // Even if there's an error, we'll still log the user out locally
      toast({
        title: "Partial logout",
        description:
          "You've been logged out, but there might have been an issue with the server.",
        status: "warning",
        duration: 5000,
        position: "bottom-right",
      });

      // Navigate to login anyway
      navigate("/login");
    }
  };

  const selectStyles = {
    borderRadius: "10px",
    borderColor: "#f0f0f0",
    backgroundColor: "white",
    color: "#1a1a1a",
    fontSize: { base: "13px", sm: "initial" },
  };

  return (
    <Container
      width="full"
      height="88px"
      maxWidth="1200px"
      padding={{ base: ".7rem", sm: "1.2rem", md: "2rem" }}
      as="header"
      display="flex"
      alignItems="center"
    >
      <HamburgerDrawer isDarkBgPages={isDarkBgPages} />
      <Link as={NavLink} to="/" display={{ base: "none", sm: "block" }}>
        <Image
          src={EDU_URL + "/logo"}
          height={{ base: "40px", md: "60px" }}
          ml={{ base: "1rem", md: "4rem" }}
          filter={
            isDarkBgPages
              ? "invert(1) brightness(10000%) saturate(100%)"
              : "none"
          }
        />
      </Link>

      <Spacer />
      {isAuthenticated && (
        <Box mr="2rem">
          <Menu placement="bottom-end">
            <MenuButton as={Button}>
              <User />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleLogout}>Log out</MenuItem>
              {user && user.username && (
                <MenuItem isDisabled>Logged in as: {user.username}</MenuItem>
              )}
            </MenuList>
          </Menu>
        </Box>
      )}
      <Select
        w="80px"
        onChange={(e) => setLanguage(e.target.value?.toLowerCase())}
        sx={selectStyles}
      >
        {!isEmptyObject(companyData) &&
          companyData.languageList.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
      </Select>
    </Container>
  );
};
