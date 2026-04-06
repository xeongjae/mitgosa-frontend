import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q");
  return NextResponse.json({ message: "analyze", q });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as unknown;
  return NextResponse.json({ ok: true, body });
}
