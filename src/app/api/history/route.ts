import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Analysis from "@/models/Analysis";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const history = await Analysis.find({ userId }).sort({ createdAt: -1 }).limit(20);
  return NextResponse.json(history);
}
