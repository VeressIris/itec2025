
import {
    Button,
    Card,
    Container,
    Divider,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
  } from "@mui/material";
  import GitHubIcon from "@mui/icons-material/GitHub";
  import React from "react";
  
  interface ProfileFormValues {
    name: string;
    profileImage?: File;
    age: number;
    gender: string;
    githubLink: string;
    country: string;
    city: string;
    languages: string[];
    technologies: string[];
    description: string;
    codingTimePreference: string[];
  }
  
  interface ProfileContentProps {
    formValues: ProfileFormValues;
    edit: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleGenderChange: (e: SelectChangeEvent) => void;
    handleEdit: () => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleReset: () => void;
  }
  
  export default function ProfileContent({
    formValues,
    edit,
    handleChange,
    handleGenderChange,
    handleEdit,
    handleSubmit,
    handleReset,
  }: ProfileContentProps) {
    return (
      <Container maxWidth="sm">
        <Stack
          component="form"
          onSubmit={handleSubmit}
          alignItems="center"
          justifyContent="center"
        >
          <Stack component={Card} width={{ xs: "100%", sm: 550 }} p={3} my={2} gap={2}>
            <Typography variant="h5" align="center">My Profile</Typography>
            <Divider />
  
            <TextField label="Name" name="name" value={formValues.name} onChange={handleChange} required fullWidth disabled={!edit} />
            <TextField label="Age" name="age" type="number" value={formValues.age} onChange={handleChange} required fullWidth disabled={!edit} />
  
            <FormControl fullWidth required disabled={!edit}>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                name="gender"
                labelId="gender-label"
                value={formValues.gender}
                onChange={handleGenderChange}
                label="Gender"
              >
                <MenuItem disabled value="">Select a value</MenuItem>
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
                <MenuItem value="DONOTWANTTOSAY">Prefer not to say</MenuItem>
              </Select>
            </FormControl>
  
            <TextField
              label="GitHub Link"
              name="githubLink"
              value={formValues.githubLink}
              onChange={handleChange}
              type="url"
              required
              fullWidth
              disabled={!edit}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GitHubIcon />
                  </InputAdornment>
                ),
                endAdornment: !edit ? (
                  <InputAdornment position="end">
                    <Button
                      variant="text"
                      onClick={() => window.open(formValues.githubLink, "_blank")}
                      disabled={!formValues.githubLink}
                    >
                      Open
                    </Button>
                  </InputAdornment>
                ) : null,
              }}
            />
  
            <TextField label="Country" name="country" fullWidth required value={formValues.country} onChange={handleChange} disabled={!edit} />
            <TextField label="City" name="city" fullWidth required value={formValues.city} onChange={handleChange} disabled={!edit} />
            <TextField label="Description" name="description" multiline rows={3} fullWidth value={formValues.description} onChange={handleChange} disabled={!edit} />
  
            <input type="file" name="profileImage" disabled={!edit} onChange={handleChange} />
  
            <Divider />
            <Stack direction="row" gap={1}>
              {edit ? (
                <>
                  <Button variant="contained" type="submit" sx={{ flex: 1 }}>Save</Button>
                  <Button variant="outlined" type="button" onClick={handleReset} sx={{ flex: 1 }}>Cancel</Button>
                </>
              ) : (
                <Button variant="outlined" type="button" onClick={handleEdit} sx={{ flex: 1 }}>Edit</Button>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    );
  }
  