import express from "express";
import cors from "cors";
import multer from "multer";
import pdf from "pdf-parse";
import fs from "fs/promises";
import "dotenv/config";
import OpenAI from "openai";

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.send("Hello itec2025!");
});

app.post("/api/summarize-pdf/", upload.single("pdf"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileBuffer = await fs.readFile(filePath);
    const pdfData = await pdf(fileBuffer);
    const text = pdfData.text;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes documents.",
        },
        { role: "user", content: `Summarize this PDF content:\n\n${text}` },
      ],
      temperature: 0.5,
    });

    await fs.unlink(filePath); // Clean up temp file
    res.json({ summary: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
