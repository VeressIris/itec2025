// components/ProfileSkeleton.tsx
import { Card, Container, Divider, Skeleton, Stack, Typography } from "@mui/material";
import React from "react";

export default function ProfileSkeleton() {
  return (
    <Container maxWidth="sm">
      <Stack component={Card} width={{ xs: "100%", sm: 550 }} p={3} my={2} gap={2}>
        <Typography variant="h5" align="center">My Profile</Typography>
        <Divider />
        {[...Array(8)].map((_, i) => (
          <React.Fragment key={i}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rectangular" height={40} />
          </React.Fragment>
        ))}
        <Divider />
        <Stack direction="row" gap={1}>
          <Skeleton variant="rectangular" height={40} width="100%" />
          <Skeleton variant="rectangular" height={40} width="100%" />
        </Stack>
      </Stack>
    </Container>
  );
}
