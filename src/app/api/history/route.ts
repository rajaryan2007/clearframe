import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Analysis from "@/models/Analysis";

export async function OPTIONS(req: Request) {
  const origin = req.headers.get('origin');
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    }
  });
}

export async function GET(req: Request) {
  const origin = req.headers.get('origin');
  const { userId } = await auth();


  const filter = userId ? { userId } : { userId: "anonymous" };

  await dbConnect();
  const history = await Analysis.find(filter).sort({ createdAt: -1 }).limit(20);
  const response = NextResponse.json(history);
  response.headers.set('Access-Control-Allow-Origin', origin || '*');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}
