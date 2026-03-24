import { 
  detectEmotions, 
  analyzeBias, 
  identifyMissingContext, 
  generateNeutralRewrite, 
  calculateManipulationScore 
} from "@/lib/gemini";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function OPTIONS(req: Request) {
  const origin = req.headers.get('origin');
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    }
  });
}

export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  try {
    // Perform parallel AI analysis
    const [emotions, bias, context, rewrite] = await Promise.all([
      detectEmotions(text),
      analyzeBias(text),
      identifyMissingContext(text),
      generateNeutralRewrite(text)
    ]);

    const score = await calculateManipulationScore(emotions, bias, context.length);

    const result = {
      emotions,
      bias,
      missing_context: context,
      rewrite,
      manipulation_score: score,
    };

    const response = NextResponse.json({ 
      message: "Analysis complete",
      input: text,
      result 
    });
    
    response.headers.set('Access-Control-Allow-Origin', origin || '*');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  } catch (error: any) {
    console.error("Analysis failed:", error);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
