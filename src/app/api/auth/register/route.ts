import { NextResponse } from "next/server";

function getBackendBaseUrl(): string {
  const raw = process.env.BASE_URL ?? "http://localhost:8000";
  return raw.replace(/\/+$/, "");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${getBackendBaseUrl()}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "백엔드 서버에 연결할 수 없습니다." },
      { status: 502 }
    );
  }
}
