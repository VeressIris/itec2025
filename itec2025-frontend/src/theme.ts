"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  palette: {
    primary: {
      main: "#4617a3",
      contrastText: "white",
    },
    secondary: {
      main: "#6817a3",
      contrastText: "#white",
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
          backgroundColor: "#d6c7f5",
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
