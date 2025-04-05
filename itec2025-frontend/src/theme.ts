"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  palette: {
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
      paper: "#0b1028",
    },
    mode: "light",
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "32px",
          backgroundColor: "white",
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
  },
});

export default theme;
