export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: req.body.prompt || "Give insights",
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("OpenAI error:", data);
      return res.status(400).json({ error: data });
    }

    res.status(200).json({
      result: data.choices?.[0]?.message?.content || "No response",
    });
  } catch (error) {
    console.log("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
}
