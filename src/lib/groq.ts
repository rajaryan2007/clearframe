import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const model = process.env.GROQ_MODEL_NAME || "llama-3.3-70b-versatile";

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error.status === 429 || error.status === 503)) {
      const waitTime = error.status === 429 ? 30000 : delay;
      console.warn(`Groq Error ${error.status}. Retrying in ${waitTime}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

function extractJson(text: string) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse Groq response:", text);
    throw new Error("Invalid intelligence response format");
  }
}

async function generateResponse(prompt: string) {
  const completion = await withRetry(() =>
    groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
      response_format: { type: "json_object" },
    })
  );
  return completion.choices[0]?.message?.content || "";
}

export async function detectEmotions(text: string) {
  const prompt = `Detect emotional triggers in the text. Return ONLY a valid JSON object with intensity scores for fear, anger, hope, sadness (all 0-1).
  Text: "${text}"
  JSON format: {"fear": 0.5, "anger": 0.2, "hope": 0.1, "sadness": 0.0}`;

  const responseText = await generateResponse(prompt);
  return extractJson(responseText);
}

export async function analyzeBias(text: string) {
  const prompt = `Analyze political or ideological bias. Classify as left, right, or neutral. Explain reasoning briefly. Return ONLY a valid JSON object.
  Text: "${text}"
  JSON format: {"direction": "left" | "right" | "neutral", "confidence": 0.8, "explanation": "string"}`;

  const responseText = await generateResponse(prompt);
  return extractJson(responseText);
}

export async function identifyMissingContext(text: string) {
  const prompt = `Identify important missing facts, perspectives, or data that would give a more complete understanding. Return ONLY a valid JSON object containing an array of strings under the key "missing_context".
  Text: "${text}"
  JSON format: {"missing_context": ["fact 1", "fact 2"]}`;

  const responseText = await generateResponse(prompt);
  const json = extractJson(responseText);
  return json.missing_context || [];
}

export async function generateNeutralRewrite(text: string) {
  const prompt = `Rewrite the text in a neutral, factual, unbiased tone without emotional manipulation. Return ONLY the rewritten text as a string inside a JSON object.
  Text: "${text}"
  JSON format: {"rewrite": "string"}`;

  const responseText = await generateResponse(prompt);
  const json = extractJson(responseText);
  return json.rewrite;
}

export async function calculateManipulationScore(emotions: any, bias: any, contextCount: number) {
  const prompt = `Based on emotional intensity (${JSON.stringify(emotions)}), bias (${JSON.stringify(bias)}), and ${contextCount} missing points of context, generate a manipulation score from 0 to 100. Return ONLY a JSON object.
  JSON format: {"score": 75}`;

  const responseText = await generateResponse(prompt);
  const json = extractJson(responseText);
  return json.score;
}
