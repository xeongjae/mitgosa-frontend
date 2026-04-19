import { NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${BASE_URL}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "백엔드 서버에 연결할 수 없습니다." },
      { status: 502 }
    );
  }
}