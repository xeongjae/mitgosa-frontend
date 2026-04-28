import { NextResponse } from "next/server";

/** 서버 전용. Vercel 등에서는 환경변수 `BASE_URL`에 배포된 백엔드 베이스 URL 설정. */
function getBackendBaseUrl(): string {
  const raw = process.env.BASE_URL ?? "http://localhost:8000";
  return raw.replace(/\/+$/, "");
}

export async function GET(request: Request) {
  try {
    const baseUrl = getBackendBaseUrl();
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit") ?? "20";

    const response = await fetch(
      `${baseUrl}/api/recent-analyses?limit=${encodeURIComponent(limit)}`,
      {
        method: "GET",
      },
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { items: [], error: "백엔드 서버에 연결할 수 없습니다." },
      { status: 502 },
    );
  }
}

