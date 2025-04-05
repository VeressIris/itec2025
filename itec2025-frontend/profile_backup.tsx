import {
  Button,
  Card,
  Divider,
  Stack,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  InputAdornment,
  SelectChangeEvent,
  Container,
  Box,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import { backendUrl, urlToFile } from "@/utils";
import { useClerk, useUser } from "@clerk/nextjs";

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

const defaultState: ProfileFormValues = {
  name: "",
  age: 0,
  gender: "",
  githubLink: "",
  country: "",
  city: "",
  languages: [],
  technologies: [],
  description: "",
  codingTimePreference: [],
};

export default function ProfilePage(): React.ReactElement {
  const { user } = useClerk();

  const getCurrentUser = async () => {
    const params = new URLSearchParams({
      userId: user?.id || "",
    });
    console.log(user?.id);

    const response = await fetch(`${backendUrl}/getUser?${params.toString()}`);
    const data = await response.json();
    console.log(data);
    return data;
  };

  const [edit, setEdit] = useState(false);
  const [formValues, setFormValues] = useState<ProfileFormValues>({
    ...defaultState,
  });
  const [formPrevValues, setFormPrevValues] = useState<ProfileFormValues>({
    ...defaultState,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      console.log(user);
      try {
        const userData = await getCurrentUser();
        if (userData) {
          const values = {
            name: userData.name || "",
            profileImage: userData.profileImage
              ? await urlToFile(
                  user?.imageUrl ? user?.imageUrl : userData.profileImage
                )
              : undefined,
            age: userData.age || 0,
            gender: userData.gender || "",
            githubLink: userData.githubLink || "",
            country: userData.country || "",
            city: userData.city || "",
            languages: userData.languages || [],
            technologies: userData.technologies || [],
            description: userData.description || "",
            codingTimePreference: userData.codingTimePreference || [],
          };
          setFormValues(values);
          setFormPrevValues({ ...values });
        } else {
          setFormValues({ ...defaultState });
          setEdit(true);
        }
      } catch (error) {
        //console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = event.target;
    console.log(event.target);
    if (type === "file" && files && files.length > 0) {
      setFormValues((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGenderChange = (event: SelectChangeEvent) => {
    setFormValues((prev) => ({
      ...prev,
      gender: event.target.value,
    }));
  };

  const handleMultiSelectChange = (name: string, value: string[]) => {
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
    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, value.join(","));
      } else {
        formData.append(key, value as string | Blob);
      }
    });
    //await addOrUpdateUser(formData);
    setEdit(false);
  };

  const handleReset = () => {
    setFormValues(formPrevValues);
    setEdit(false);
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Stack
          component={Card}
          width={{ xs: "100%", sm: 550 }}
          p={3}
          my={2}
          gap={2}
        >
          <Typography variant="h5" align="center">
            My Profile
          </Typography>
          <Divider />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rectangular" height={40} />
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
      <Stack
        component="form"
        onSubmit={handleSubmit}
        alignItems="center"
        justifyContent="center"
      >
        <Stack
          component={Card}
          width={{ xs: "100%", sm: 550 }}
          p={3}
          my={2}
          gap={2}
        >
          <Typography variant="h5" align="center">
            My Profile
          </Typography>
          <Divider />

          <TextField
            label="Name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            required
            slotProps={{ input: { readOnly: !edit } }}
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            fullWidth
            value={formValues.age}
            onChange={handleChange}
            required
            slotProps={{ input: { readOnly: !edit } }}
          />

          <FormControl fullWidth required>
            <InputLabel id="profile-gender-label">Gender</InputLabel>
            <Select
              name="gender"
              labelId="profile-gender-label"
              label="Gender"
              required
              value={formValues.gender}
              onChange={handleGenderChange}
              slotProps={{ input: { readOnly: !edit } }}
            >
              <MenuItem disabled value="">
                Select a value
              </MenuItem>
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
              <MenuItem value="DONOTWANTTOSAY">Prefer not to say</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="GitHub Link"
            type="url"
            name="githubLink"
            fullWidth
            required
            value={formValues.githubLink}
            onChange={handleChange}
            slotProps={{
              input: {
                readOnly: !edit,
                startAdornment: (
                  <InputAdornment position="start">
                    <GitHubIcon />
                  </InputAdornment>
                ),
                endAdornment: !edit && (
                  <InputAdornment position="end">
                    <Button
                      variant="text"
                      onClick={() =>
                        window.open(formValues.githubLink, "_blank")
                      }
                      disabled={!formValues.githubLink}
                    >
                      Open
                    </Button>
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label="Country"
            name="country"
            fullWidth
            required
            value={formValues.country}
            onChange={handleChange}
            slotProps={{ input: { readOnly: !edit } }}
          />
          <TextField
            label="City"
            name="city"
            fullWidth
            required
            value={formValues.city}
            onChange={handleChange}
            slotProps={{ input: { readOnly: !edit } }}
          />

          <TextField
            label="Description"
            name="description"
            multiline
            rows={3}
            fullWidth
            value={formValues.description}
            onChange={handleChange}
            required
            slotProps={{ input: { readOnly: !edit } }}
          />

          <input
            type="file"
            name="profileImage"
            disabled={!edit}
            onChange={handleChange}
          />

          <Divider />
          <Stack direction="row" gap={1}>
            {edit ? (
              <>
                <Button variant="contained" type="submit" sx={{ flex: 1 }}>
                  Save
                </Button>
                <Button
                  variant="outlined"
                  type="button"
                  sx={{ flex: 1 }}
                  onClick={handleReset}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                type="button"
                sx={{ flex: 1 }}
                onClick={handleEdit}
              >
                Edit
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
