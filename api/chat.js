import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { message } = req.body;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
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
      reply: response.output_text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al generar respuesta" });
  }
}

