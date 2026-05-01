import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // 1. Check if Vercel can actually see your key
  if (!process.env.GEMINI_API_KEY) {
    return res.status(200).json({ 
      result: "🚨 ERROR: Vercel cannot see your GEMINI_API_KEY. Go to Vercel Project Settings > Environment Variables, re-add it, make sure 'Production' is checked, and REDEPLOY." 
    });
  }

  try {
    const { prompt } = req.body;
    
    // 2. Initialize SDK
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 3. Call Google
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    // 4. Send success
    res.status(200).json({ result: response.text });
    
  } catch (error) {
    // 5. If Google rejects the key or model, SHOW IT ON SCREEN
    res.status(200).json({ result: `🚨 GOOGLE API ERROR: ${error.message}` });
  }
}
