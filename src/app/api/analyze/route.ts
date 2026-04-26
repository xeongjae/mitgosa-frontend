import { NextResponse } from "next/server";

/** 서버 전용. Vercel 등에서는 환경변수 `BASE_URL`에 배포된 백엔드 베이스 URL 설정. */
function getBackendBaseUrl(): string {
  const raw = process.env.BASE_URL ?? "http://localhost:8000";
  return raw.replace(/\/+$/, "");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const baseUrl = getBackendBaseUrl();
    const response = await fetch(`${baseUrl}/api/analyze`, {
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