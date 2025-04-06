import { useState } from "react";
import { Button, Typography } from "@mui/material";

export default function TxtToAudio() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!selectedFile) return;

    const extension = selectedFile.name.split(".").pop()?.toLowerCase();
    const isPDF = extension === "pdf";
    const isTXT = extension === "txt";

    if (!isPDF && !isTXT) {
      alert("Te rugăm să încarci un fișier .pdf sau .txt");
      return;
    }

    // ✅ link direct către backendul Express (nu frontendul Next.js)
    const endpoint = isPDF
      ? "http://localhost:3001/api/pdf-to-audio"
      : "http://localhost:3001/api/txt-to-audio";

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert("Eroare de la server: " + errorText);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      alert("Eroare de rețea. Verifică dacă backendul e pornit pe portul 3001.");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h5" gutterBottom>
        PDF/TXT to Audio
      </Typography>

      <input
        type="file"
        accept=".pdf,.txt"
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        style={{ marginBottom: 16 }}
      />

      <Button
        variant="contained"
        onClick={handleUpload}
        disabled={!selectedFile}
        sx={{ borderRadius: "999px", px: 3 }}
      >
        Generează Audio
      </Button>

      {audioUrl && (
        <div style={{ marginTop: 24 }}>
          <audio controls src={audioUrl} />
        </div>
      )}
    </div>
  );
}
