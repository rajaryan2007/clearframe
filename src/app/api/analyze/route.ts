import { inngest } from "@/inngest/client";
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
  const { userId } = await auth();
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  await inngest.send({
    name: "app/analyze.text",
    data: {
      text,
      userId: userId || "anonymous",
    },
  });

  const response = NextResponse.json({ message: "Analysis started" });
  response.headers.set('Access-Control-Allow-Origin', origin || '*');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}
