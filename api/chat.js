import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {

  // CORS (Hostinger frontend)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
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

    // Manejo seguro de la respuesta
    const output =
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text ||
      "Lo siento, no pude generar una respuesta.";

    res.status(200).json({ reply: output });
  } catch (error) {
    console.error("OpenAI error:", error); // <-- log completo en Vercel
    res.status(500).json({ error: "Error al generar respuesta" });
  }
}


