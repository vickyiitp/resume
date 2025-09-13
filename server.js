import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";

const app = express();
const port = process.env.PORT || 3000;

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set. This is required for the app to function.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Define a reusable error handler
const handleError = (res, error, context) => {
  console.error(`Error in ${context}:`, error);
  res.status(500).json({ error: `An error occurred in ${context}. Please try again.` });
};

app.post('/api/generate', async (req, res) => {
  const { model, contents, config } = req.body;

  if (!model || !contents) {
    return res.status(400).json({ error: 'Missing required fields: model and contents.' });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config,
    });
    res.json(response);
  } catch (error) {
    handleError(res, error, 'content generation');
  }
});

// Serve frontend files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname)));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Serving frontend files in production mode.');
  }
});