import { inngest } from "@/inngest/client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  // Send event to Inngest
  await inngest.send({
    name: "app/analyze.text",
    data: {
      text,
      userId,
    },
  });

  return NextResponse.json({ message: "Analysis started" });
}
