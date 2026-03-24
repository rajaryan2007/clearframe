import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL_NAME || "gemini-2.5-flash-lite" });

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error.status === 503 || error.status === 429)) {
      const waitTime = error.status === 429 ? 30000 : delay;
      console.warn(`Gemini Error ${error.status}. Retrying in ${waitTime}ms... (${retries} retries left)`);
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
    console.error("Failed to parse Gemini response:", text);
    throw new Error("Invalid intelligence response format");
  }
}

export async function detectEmotions(text: string) {
  const prompt = `Detect emotional triggers in the text. Return ONLY a valid JSON object with intensity scores for fear, anger, hope, sadness (all 0-1).
  Text: "${text}"
  JSON format: {"fear": 0.5, "anger": 0.2, "hope": 0.1, "sadness": 0.0}`;

  const result = await withRetry(() => model.generateContent(prompt));
  return extractJson(result.response.text());
}

export async function analyzeBias(text: string) {
  const prompt = `Analyze political or ideological bias. Classify as left, right, or neutral. Explain reasoning briefly. Return ONLY a valid JSON object.
  Text: "${text}"
  JSON format: {"direction": "left" | "right" | "neutral", "confidence": 0.8, "explanation": "string"}`;

  const result = await withRetry(() => model.generateContent(prompt));
  return extractJson(result.response.text());
}

export async function identifyMissingContext(text: string) {
  const prompt = `Identify important missing facts, perspectives, or data that would give a more complete understanding. Return ONLY a valid JSON array of strings.
  Text: "${text}"
  JSON format: ["fact 1", "fact 2"]`;

  const result = await withRetry(() => model.generateContent(prompt));
  return extractJson(result.response.text());
}

export async function generateNeutralRewrite(text: string) {
  const prompt = `Rewrite the text in a neutral, factual, unbiased tone without emotional manipulation. Return ONLY the rewritten text as a string inside a JSON object.
  Text: "${text}"
  JSON format: {"rewrite": "string"}`;

  const result = await withRetry(() => model.generateContent(prompt));
  const json = extractJson(result.response.text());
  return json.rewrite;
}

export async function calculateManipulationScore(emotions: any, bias: any, contextCount: number) {
  const prompt = `Based on emotional intensity (${JSON.stringify(emotions)}), bias (${JSON.stringify(bias)}), and ${contextCount} missing points of context, generate a manipulation score from 0 to 100. Return ONLY a JSON object.
  JSON format: {"score": 75}`;

  const result = await withRetry(() => model.generateContent(prompt));
  const json = extractJson(result.response.text());
  return json.score;
}
