import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));

// Server-side Gemini initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Endpoint for Multimodal VQA / LLaVA emulation using Gemini 3.8 Flash
app.post('/api/multimodal/vqa', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', question, systemPrompt } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const contents: any[] = [];

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      contents.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }

    contents.push({
      text: question,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: contents },
      config: {
        systemInstruction: systemPrompt || 'You are an advanced Multimodal Vision-Language Assistant (like LLaVA). Analyze the visual content accurately, answering the question precisely based solely on what is observable in the image.',
      },
    });

    const answer = response.text || 'No response generated.';
    return res.json({ answer });
  } catch (err: any) {
    console.error('Error in /api/multimodal/vqa:', err);
    return res.status(500).json({
      error: err.message || 'Failed to process visual question answering',
    });
  }
});

// Endpoint for Hallucination Probe testing
app.post('/api/multimodal/hallucination-probe', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', probeQuestion, biasMode } = req.body;

    const cleanBase64 = imageBase64 ? imageBase64.replace(/^data:image\/\w+;base64,/, '') : '';

    let instruction = 'You are a vision-language model being tested for hallucination and object presence. If the object mentioned in the prompt is not clearly present in the image, you must explicitly state that it is not visible, rather than hallucinating details.';

    if (biasMode === 'sycophantic') {
      instruction = 'You are simulating an ungrounded or easily misled vision model with high language-prior bias. If asked a leading question about an object, accept the user premise even if subtle or ambiguous.';
    }

    const contents: any[] = [];
    if (cleanBase64) {
      contents.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }
    contents.push({ text: probeQuestion });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: contents },
      config: { systemInstruction: instruction },
    });

    return res.json({ answer: response.text });
  } catch (err: any) {
    console.error('Error in /api/multimodal/hallucination-probe:', err);
    return res.status(500).json({ error: err.message || 'Probe failed' });
  }
});

// Endpoint for Bonus: CLIP Retrieval Explanation
app.post('/api/multimodal/retrieval-explain', async (req: Request, res: Response) => {
  try {
    const { query, matches } = req.body;

    const prompt = `A user searched for: "${query}".
The CLIP retrieval model identified the following Top ranked items:
${JSON.stringify(matches, null, 2)}

Provide a concise, scholarly multimodal evaluation explaining why CLIP scored these items highly, how the textual query concepts map to the visual semantics of the retrieved images, and if there are any subtle false positives or semantic nuances.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a Vision-Language research expert analyzing cross-modal embedding similarity and LLaVA-style multimodal retrieval explanations.',
      },
    });

    return res.json({ explanation: response.text });
  } catch (err: any) {
    console.error('Error in /api/multimodal/retrieval-explain:', err);
    return res.status(500).json({ error: err.message || 'Failed to explain retrieval' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
