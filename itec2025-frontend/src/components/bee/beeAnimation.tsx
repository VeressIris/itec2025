import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Box, useTheme } from "@mui/material";

export default function BeeAnimation() {
    const theme = useTheme();

    const images = [
        "/images/bee-closed-eyes.svg",
        "/images/bee-open-eyes.svg"
    ];

    const [currentBeeImage, setCurrentBeeImage] = useState(images[0]);
    const transitionDelays = [140, 2000];
    const indexRef = useRef(0);

    useEffect(() => {
        const cycleImages = () => {
            indexRef.current = (indexRef.current + 1) % images.length;
            setCurrentBeeImage(images[indexRef.current]);

            setTimeout(cycleImages, transitionDelays[indexRef.current]);
        };

        const timeout = setTimeout(cycleImages, transitionDelays[0]);

        return () => clearTimeout(timeout);
    });

    return (

        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
                width: {xs: 200, md: 250},
                height: {xs: 200, md: 250},
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    backgroundColor: theme.palette.background.paper,
                    position: "absolute",
                    zIndex: 0,
                }}
            />

            <Box sx={{ position: "relative", zIndex: 1, top: -63, right: -7, transform: {xs: "scale(0.75)", md: "none"}}}>
                <Image
                    src={currentBeeImage}
                    alt="Bee Animation"
                    width={320}
                    height={320}
                    priority
                />
            </Box>
        </Box>

    );
}
