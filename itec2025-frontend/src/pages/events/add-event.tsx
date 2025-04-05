import { backendUrl } from "@/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  Autocomplete,
  Chip,
  MenuItem,
  Stack,
  CircularProgress,
  Card,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";

const classTagOptions = [
  "Math",
  "Science",
  "Art",
  "History",
  "Chemistry",
  "Biology",
  "English",
  "Computer science",
];
const gradeOptions = ["9th", "10th", "11th", "12th"];

export default function AddEvent() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<{
    title: string;
    description: string;
    personLimit: number;
    date: Dayjs;
    class: string;
    classTags: string[];
    grade: string;
  }>({
    title: "",
    description: "",
    personLimit: 0,
    date: dayjs(),
    class: "",
    classTags: [],
    grade: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const token = await getToken();
      const res = await fetch(`${backendUrl}/addEvent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      setSuccess(true);
      console.log("success");
      setError(null);
      router.push("/events/my-events");
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: "5vh",  
        paddingBottom: "5vh",
        display: "flex",
        justifyContent: "center",

      }}
    >

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="sm">
          <Card sx={{
            p: 3,
            width: "100%",
            maxWidth: {
              xs: "80vw",
              sm: "80vw",
              md: "80vw",
              lg: 600,
            },
            mx: "auto",
          }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h5" gutterBottom>
                Add an event
              </Typography>

              {error && <Alert severity="error">{error}</Alert>}
              {success && (
                <Alert severity="success">Event saved successfully!</Alert>
              )}

              <TextField
                label="Event Name"
                name="title"
                value={form.title}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />

              <TextField
                label="Event Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                multiline
                margin="normal"
                required
              />

              <DatePicker
                label="Date"
                value={form.date}
                onChange={(newDate) => {
                  if (newDate) {
                    setForm((prev) => ({ ...prev, date: newDate }));
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal",
                  },
                }}
              />

              <TextField
                label="Person Limit"
                name="personLimit"
                type="number"
                value={form.personLimit}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />

              <TextField
                label="Subject"
                name="class"
                value={form.class}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />

              <TextField
                select
                label="Grade"
                name="grade"
                value={form.grade}
                onChange={handleChange}
                fullWidth
                margin="normal"
              >
                {gradeOptions.map((grade) => (
                  <MenuItem key={grade} value={grade} sx={{ color: "white" }}>
                    {grade}
                  </MenuItem>
                ))}
              </TextField>

              <Autocomplete
                multiple
                freeSolo
                options={classTagOptions}
                value={form.classTags}
                onChange={(e, newValue) =>
                  setForm((prev) => ({ ...prev, classTags: newValue }))
                }
                slotProps={{
                  paper: {
                    sx: {
                      "& .MuiAutocomplete-listbox": {
                        "& li": {
                          color: "white",
                        },
                      },
                      "& .MuiAutocomplete-noOptions": {
                        color: "white",
                        px: 2,
                        py: 1,
                      },
                    },
                  },
                }}
                renderTags={(value: string[], getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      color="secondary"
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Subject Tags"
                    margin="normal"
                  />
                )}
              />

<Stack direction="row" justifyContent="space-between">
  <Button
    type="submit"
    variant="contained"
    sx={{ mt: 2, minWidth: 120 }}
    disabled={loading}
  >
    {loading ? "Saving..." : "Save"}
  </Button>

  {loading && <CircularProgress size={24} sx={{ mr: 2, mt: 3 }} />}

  <Button
    type="submit"
    variant="outlined"
    href="/events/my-events"
    sx={{ mt: 2, minWidth: 140, ml: 1 }}
  >
    Back to events
  </Button>
</Stack>

            </Box>
          </Card>
        </Container>
      </LocalizationProvider>
    </div>
  );
}
