// src/theme.ts
import { createTheme } from "@mui/material/styles";

const sharedComponents = {
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: "32px",
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: "100px",
      },
      contained: {
        boxShadow: "none",
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: "10px",
      },
    },
  },
};

export const darkTheme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#4617a3",
      contrastText: "#fff",
    },
    secondary: {
      main: "#a31755",
      contrastText: "#fff",
    },
    background: {
      default: "#0b1028",
      paper: "#131d4c",
    },
  },
  components: sharedComponents,
});

export const lightTheme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  palette: {
    mode: "light",
    primary: {
      main: "#4617a3",
      contrastText: "#fff",
    },
    secondary: {
      main: "#a31755",
      contrastText: "#fff",
    },
    background: {
      default: "#f6f0fe",
      paper: "#ffffff",
    },
  },
  components: sharedComponents,
});
