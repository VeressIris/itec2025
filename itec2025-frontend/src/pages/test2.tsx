import React, { useState } from "react";
import {
  Button,
  Typography,
  CircularProgress,
  Box,
  TextField,
} from "@mui/material";

const PdfSummaryPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setSummary("");
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch("http://localhost:3002/api/summarize-pdf", {
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
    <Box maxWidth="600px" mx="auto" mt={5} textAlign="center">
      <Typography variant="h5" gutterBottom>
        Upload PDF to Summarize
      </Typography>

      <input type="file" accept=".pdf" onChange={handleFileChange} />

      <Box mt={2}>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Summarize"
          )}
        </Button>
      </Box>

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

      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default PdfSummaryPage;
