"use client";
import React from "react";
import { Box, Container, Skeleton, Stack } from "@mui/material";

export default function HomeSkeleton() {
  return (
    <Box
      sx={{
        minHeight: { xs: "calc(100vh - 56px)", md: "calc(100vh - 64px)" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          "linear-gradient(to right, rgb(70, 23, 163), rgb(138, 41, 202))",
        color: "white",
        position: "relative",
        px: 3,
        pb: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Stack
          spacing={5}
          alignItems="center"
          direction={{
            xs: "column-reverse",
            sm: "column-reverse",
            md: "row",
            lg: "row",
          }}
        >
    
          <Stack gap={2} width={{ xs: "100%", md: "60%" }}>
            <Skeleton
              variant="text"
              height={60}
              width="100%"
              sx={{ bgcolor: "rgba(255,255,255,0.3)" }}
            />
            <Skeleton
              variant="text"
              height={40}
              width="100%"
              sx={{ bgcolor: "rgba(255,255,255,0.3)" }}
            />
            <Skeleton
              variant="text"
              height={40}
              width="100%"
              sx={{ bgcolor: "rgba(255,255,255,0.3)" }}
            />
          </Stack>

 
          <Skeleton
            variant="rectangular"
            width={350}
            height={350}
            sx={{ borderRadius: "12px", bgcolor: "rgba(255,255,255,0.2)" }}
          />
        </Stack>
      </Container>
    </Box>
  );
}
