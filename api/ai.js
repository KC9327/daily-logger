import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // Vercel requires this check to prevent 405 errors
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;
    const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.status(200).json({ result: response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
