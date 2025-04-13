import { extendTheme } from "@chakra-ui/react";
import { themeColors } from "./colors";
// import "@fontsource-variable/open-sans";
// import "@fontsource-variable/raleway";

const theme = extendTheme({
  styles: {
    global: {
      // reset default chakra styling
      ".chakra-select__wrapper": {
        marginLeft: "-1em",
      },
      ".chakra-input__group": {
        marginLeft: "-1em",
      },
      ".chakra-menu__menu-list": {
        minWidth: "auto",
      },
    },
  },
  fonts: {
    // heading: `'Open Sans', sans-serif`,
    // body: `'Raleway', sans-serif`,
  },
  colors: themeColors,
  breakpoints: {
    break1100: "1100px",
  },
});

export default theme;
