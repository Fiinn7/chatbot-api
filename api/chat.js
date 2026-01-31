import OpenAI from "openai";


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {

  
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
    console.log("Mensaje recibido:", message); // log del mensaje

    
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: "Eres un asistente amable para una página web." },
        { role: "user", content: message }
      ],
    });

    console.log("Respuesta completa de OpenAI:", response); // log completo de la respuesta

    
    const output =
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text ||
      "Lo siento, no pude generar una respuesta.";

    res.status(200).json({ reply: output });

  } catch (error) {
    console.error("OpenAI API error completo:", error); // log completo del error
    res.status(500).json({ error: "Error al generar respuesta" });
  }
}


