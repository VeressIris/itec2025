import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import {
  ThemeProvider,
  CssBaseline,
  Stack,
  Toolbar,
  IconButton,
} from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { AppProps } from "next/app";
import Navbar from "@/components/navbar";
import { Roboto } from "next/font/google";
import { useEffect, useState } from "react";
import { darkTheme, lightTheme } from "@/theme";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) setDarkMode(storedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <ClerkProvider {...pageProps}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <CssBaseline />
          <div className={roboto.variable}>
            <Navbar />
            <Stack sx={{ minHeight: "100vh", px: 2 }}>
              <Toolbar
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <IconButton onClick={toggleTheme} color="inherit">
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Toolbar>
              <Component {...pageProps} />
            </Stack>
          </div>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </ClerkProvider>
  );
}
