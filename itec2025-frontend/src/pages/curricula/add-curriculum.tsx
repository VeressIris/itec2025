import { backendUrl } from "@/utils";
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";

export default function AddCurriculum() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(null);
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setSummary("");
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch(`${backendUrl}/summarize-pdf`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSummary(data.summary);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            p: 3,
            width: "100%",
            maxWidth: {
              xs: "80vw",
              sm: "80vw",
              md: "80vw",
              lg: 600,
            },
            mx: "auto",
          }}
        >
          <Box component="form">
            <Typography variant="h5" textAlign={"center"} gutterBottom>
              Add an event
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}
            {success && (
              <Alert severity="success">Event saved successfully!</Alert>
            )}

            <input type="file" accept=".pdf" onChange={handleFileChange} />

            <Box mt={2}></Box>

            {summary && (
              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  Summary:
                </Typography>
                <TextField
                  value={summary}
                  fullWidth
                  multiline
                  rows={10}
                  variant="outlined"
                />
              </Box>
            )}

            <Stack direction="row" justifyContent="space-between">
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={!file || loading}
                sx={{ mt: 2, minWidth: 140, ml: 1 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Summarize"
                )}
              </Button>

              <Button
                type="button"
                variant="outlined"
                href="/curricula/my-curricula"
                sx={{ mt: 2, minWidth: 140, ml: 1 }}
              >
                Back to curricula
              </Button>
            </Stack>
          </Box>
        </Card>
      </Container>
    </div>
  );
}
