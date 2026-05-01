import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // 1. Prevent the 405 error
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;
    
    // 2. Initialize SDK
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 3. THE FIX: Use the active 2.0 model, NOT the retired 1.5 model!
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    // 4. Send success back to your frontend
    res.status(200).json({ result: response.text });
    
  } catch (error) {
    // 5. Catch any lingering errors and display them safely
    res.status(200).json({ result: `🚨 GOOGLE API ERROR: ${error.message}` });
  }
}
