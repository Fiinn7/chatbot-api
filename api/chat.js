import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "Eres un asistente amable para una página web.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.status(200).json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al generar respuesta" });
  }
}
