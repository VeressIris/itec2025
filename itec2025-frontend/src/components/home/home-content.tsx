
"use client";
import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";

export default function HomeContent() {
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
          <Stack gap={2}>
            <Typography
              fontWeight="bold"
              textAlign="center"
              sx={{
                fontSize: {
                  xs: "1.5rem",  
                  sm: "1.75rem", 
                  md: "2rem",    
                  lg: "2.25rem", 
                },
              }}
            >
              Welcome to BrainCircle!
            </Typography>

            <Typography
              lineHeight={1.6}
              sx={{
                fontSize: {
                  xs: "1rem",    
                  sm: "1.05rem",
                  md: "1.1rem",  
                  lg: "1.2rem",  
                },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Create study sessions, connect with others, and share knowledge in an interactive,
              collaborative space—whether you're preparing for exams or exploring new topics. 
              Learn smarter, together.
            </Typography>
          </Stack>
          <Image
            src="/images/robot.svg"
            alt="Robot"
            width={350}
            height={350}
          />
        </Stack>
      </Container>
    </Box>
  );
}
