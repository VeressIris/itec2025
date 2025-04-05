"use client";
import React from "react";
import { Box, Container, Stack, Typography, useTheme } from "@mui/material";
import BeeAnimation from "@/components/bee/beeAnimation";
import Image from "next/image";

import robot from "../../public/images/robot.svg"

export default function Home() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                height: {xs: "calc(100vh - 56px)", md: "calc(100vh - 64px)"},
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: "linear-gradient(to right, rgb(70, 23, 163),rgb(138, 41, 202))",
                color: "white",
                position: "relative",
                px: 3,
                
            }}
        >
            <Container maxWidth="md">
                <Stack
                    spacing={5}
                    alignItems="center"
                    direction={{ xs: "column-reverse", sm: "column-reverse", md: "row", lg: "row" }}
                >
                    <Stack gap={2}>
                        <Typography variant="h4" fontWeight="bold" textAlign="center">
                            Welcome to BrainCircle!
                        </Typography>
                        <Typography variant="h6" fontWeight="normal" lineHeight={1.6}>
                        Find fellow students, explore exciting events, and spark innovative solutions with like-minded peers. 
                        Join a community of future-driven students and shape the next generation of collaboration!
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
