import "@/styles/globals.css";
import theme from "@/theme";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default MyApp;
