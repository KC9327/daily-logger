export default async function handler(req, res) {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt || "Give insights" }] }],
        generationConfig: { maxOutputTokens: 1000 }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini error:", data);
      return res.status(400).json({ error: data });
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    res.status(200).json({ result });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
}
