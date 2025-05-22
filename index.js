// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Gemini API Setup
const geminiApiKey = process.env.GEMINI_API_KEY;
const googleAI = new GoogleGenerativeAI(geminiApiKey);

// Route for Gemini Chat
app.post('/ask-gemini', async (req, res) => {
  const { userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: 'Missing userMessage in request body' });
  }

  try {
    const model = googleAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{
            text: `act like you are the presenter for 1upX, here is the knowledge base : 
            Your Privacy. Your IP. Your Control.
            At 1upX, your intellectual property and data privacy are non-negotiable.
            We Do Not Train Public LLMs on Your Data: Your personal AI model is trained in isolation. None of your work, decisions, or unique thought patterns are ever used to train a general-purpose AI.
            Your Knowledge = Your Asset: Your workflows, decision-making patterns, and unique chain of thought are encrypted and converted into a unique NFT. This ensures that your knowledge is verifiable, ownable, and protected as a digital asset.
            Fully Private & Secure Pipelines: All your data stays compartmentalized and accessible only by your personal AI. No other user or model can access or benefit from your work unless you explicitly choose to share or license it.
            You Own Your Clone: The AI version of you is yours—completely. We don’t monetize your data or clone without your permission. Ever.
            With 1upX, your genius remains yours.`
          }]
        },
        {
          role: "model",
          parts: [{ text: "yes i understand and will remember this" }]
        }
      ],
      generationConfig: {
        temperature: 0.9,
        topP: 1,
        topK: 1,
        maxOutputTokens: 4096
      }
    });

    const result = await chat.sendMessage(userMessage);
    const responseText = await result.response.text();

    res.json({ response: responseText });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to get response from Gemini' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
