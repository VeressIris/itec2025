"use client";
import {
  Button,
  Card,
  Divider,
  Stack,
  TextField,
  Typography,
  Skeleton,
  Container,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useClerk } from "@clerk/nextjs";

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  username: string;
  grade: string;
  email: string;
}

const defaultState: ProfileFormValues = {
  firstName: "",
  lastName: "",
  username: "",
  grade: "",
  email: "",
};

export default function ProfilePage(): React.ReactElement {
  const [edit, setEdit] = useState(false);
  const [formValues, setFormValues] = useState<ProfileFormValues>({ ...defaultState });
  const [formPrevValues, setFormPrevValues] = useState<ProfileFormValues>({ ...defaultState });
  const [loading, setLoading] = useState(true);
  const { user } = useClerk();

  useEffect(() => {
    if (user) {
      const values = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        grade: "",
        email: user.emailAddresses[0]?.emailAddress || "",
      };
      setFormValues(values);
      setFormPrevValues({ ...values });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setFormPrevValues({ ...formValues });
    setEdit(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!edit) return;
    setEdit(false);
  };

  const handleReset = () => {
    setFormValues(formPrevValues);
    setEdit(false);
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Stack component={Card} width="100%" p={3} my={2} gap={2} borderRadius={4}>
          <Typography variant="h5" align="center">My Profile</Typography>
          <Divider />
          {[...Array(5)].map((_, i) => (
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

  return (
    <Container maxWidth="sm">
      <Stack component="form" onSubmit={handleSubmit} alignItems="center" justifyContent="center">
        <Stack
          component={Card}
          width="100%"
          p={3}
          my={2}
          gap={2}
          borderRadius={4}
          sx={{
            backgroundColor: "#e6d6f3",
            boxShadow: 4,
          }}
        >
          <Typography variant="h5" align="center">My Profile</Typography>
          <Divider />

          <TextField
            label="First Name"
            name="firstName"
            value={formValues.firstName}
            onChange={handleChange}
            required
            fullWidth
            slotProps={{ input: { readOnly: !edit } }}
          />

          <TextField
            label="Last Name"
            name="lastName"
            value={formValues.lastName}
            onChange={handleChange}
            required
            fullWidth
            slotProps={{ input: { readOnly: !edit } }}
          />

          <TextField
            label="Username"
            name="username"
            value={formValues.username}
            onChange={handleChange}
            required
            fullWidth
            slotProps={{ input: { readOnly: !edit } }}
          />

          <TextField
            label="Grade"
            name="grade"
            value={formValues.grade}
            onChange={handleChange}
            required
            fullWidth
            slotProps={{ input: { readOnly: !edit } }}
          />

          <TextField
            label="Email"
            name="email"
            value={formValues.email}
            fullWidth
            disabled // păstrăm disabled ca să nu apară label suprapus
          />

          <Divider />
          <Stack direction="row" gap={1}>
            {edit ? (
              <>
                <Button variant="contained" type="submit" sx={{ flex: 1 }}>Save</Button>
                <Button variant="outlined" type="button" sx={{ flex: 1 }} onClick={handleReset}>Cancel</Button>
              </>
            ) : (
              <Button variant="contained" type="button" sx={{ flex: 1 }} onClick={handleEdit}>Edit</Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
