"use client";
// "#4617a3"
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  palette: {
    primary: {
      main: "#8723db",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6817a3",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f6f0fe",
      paper: "#1c0f41",
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
