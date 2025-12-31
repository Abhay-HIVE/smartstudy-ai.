export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question, board, grade } = req.body;

    if (!question) {
      return res.status(400).json({ error: "No question provided" });
    }

    const prompt = `
You are an AI study mentor for Indian school students.
Board: ${board}
Class: ${grade}

Student question:
"${question}"

Give a clear, simple, correct answer suitable for the class level.
Avoid advanced jargon.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4
      })
    });

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "Try revising your textbook once.";

    res.status(200).json({ answer });

  } catch (err) {
    res.status(500).json({ error: "AI service error" });
  }
}
