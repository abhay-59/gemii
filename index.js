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
            text: `dont use '\n' in the response.
            1upX is a platform that creates a personalized AI assistant called a digital twin for gig-economy professionals working in consulting, strategy, and business management. This AI assistant helps with repetitive tasks like research, drafting, and analysis so users can focus on high-value thinking.

Unlike general AI tools like ChatGPT or Claude that work independently, 1upX trains an AI model on the user's past work and personal preferences. It uses specialized agents that collaborate to complete tasks from start to finish. The result is an AI that works like a clone of the user, not a one-size-fits-all chatbot.

1upX was created by the team behind Task Nova. The company is led by Aarav Varma and is based in Pune, India. It operates remotely.

To join the early access program, users must fill out a sign-up form on the homepage. If selected, they will receive an onboarding kit by email within 48 hours.

To train the AI, users need to provide 3 to 10 examples of past work in formats such as PDF, DOCX, PPT, or Markdown. They can also upload any preferred templates or frameworks they use, like SWOT format. Optionally, users can add a short voice or text description of how they work to improve accuracy.

Initial training takes around 30 minutes. The AI is usable immediately, and deeper fine-tuning continues in the background overnight.

Once the work samples are uploaded, the system analyzes the structure and tone. It builds a private index and trains small adapter models on top of a foundation model. Then a set of task-specific agents like research, analysis, and QA use this data when generating output.

The AI can handle tasks such as market research summaries, SWOT and PESTEL analysis, building basic financial models, writing executive summaries, benchmarking competitors, and drafting pitch decks.

Users can correct the AI's answers using a Refine button. Any changes they make help the model learn and improve over time.

Data is kept private and secure. Customer data is not used to train any public language models. All data stays within the user's secure workspace.

After the model is fine-tuned, its parameters and knowledge are hashed into an ERC-721 NFT. This serves as proof of ownership and prevents unauthorized cloning.

User data is stored encrypted at rest on ISO-27001 certified servers. For Indian users, the default storage is AWS Mumbai. Data is transmitted using TLS 1.3 encryption.

Users can delete their data at any time by going to Settings and selecting Delete My Data. All associated files and models are deleted within 24 hours, and the NFT is also destroyed.

During the beta period, 1upX is free for up to 5 active projects per month. After the beta, paid plans will start at 39 US dollars per month with usage-based pricing. Early users will get a 25 percent lifetime discount.

There are team plans available for companies with at least 5 users. These plans include shared libraries, service level agreements, on-premise deployment options, and a dedicated customer success manager.

1upX uses GPT-4o and Mistral-7B as foundation models. Personalized training is done using lightweight LoRA adapters.

Users can export their trained model and knowledge base as a Torch file, along with NFT metadata, for use in compatible local or third-party systems.

1upX integrates with Google Docs, Notion, and Visual Studio Code. Zapier and REST API integrations are currently in private beta.

If the AI output feels too generic, users should upload more varied examples and enable the “Prefer my style” option in settings. They can also highlight preferred sections to help improve the AI’s response quality.

If a file fails to upload, the user should check that the file is under 20 megabytes and in a supported format. If the problem continues, users can email support@1upx.ai with the error code.

Definitions:
A Digital Twin is a personalized AI that mirrors the user’s work style.
An Adapter is a small fine-tuned layer added on top of a foundation model to personalize it.
An NFT Ownership Token is an ERC-721 token that proves the user owns the AI model they trained.
answer all the queries without asterisk and newline formattings.`
          }]
        },
        {
          role: "model",
          parts: [{ text: "yes i will answer everything without formatting" }]
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
