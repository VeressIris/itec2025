
import "@/styles/globals.css";
import theme from "@/theme";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider, CssBaseline, Stack, Toolbar } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { AppProps } from "next/app";
import Navbar from "@/components/navbar";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className={roboto.variable}>
            <Navbar />
            <Stack sx={{ minHeight: "100vh" }}>
              <Toolbar />
              <Component {...pageProps} />
            </Stack>
          </div>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </ClerkProvider>
  );
}

