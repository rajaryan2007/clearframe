import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const model = process.env.GROQ_MODEL_NAME || "llama-3.3-70b-versatile";

export const uploadThePromptToTheLLM = async (prompt: string) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
    });
    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq Bot Error:", error);
    throw error;
  }
};

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const response = await uploadThePromptToTheLLM(prompt);
    return new Response(JSON.stringify({ response }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}