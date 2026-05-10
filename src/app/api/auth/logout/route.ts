import { NextResponse } from "next/server";

function getBackendBaseUrl(): string {
  const raw = process.env.BASE_URL ?? "http://localhost:8000";
  return raw.replace(/\/+$/, "");
}

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const authHeader = request.headers.get("authorization") ?? "";

    const response = await fetch(`${getBackendBaseUrl()}/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
        Authorization: authHeader,
      },
    });

    const data = await response.json();
    const nextResponse = NextResponse.json(data, { status: response.status });

    const setCookie = response.headers.get("set-cookie");
    if (setCookie) nextResponse.headers.set("set-cookie", setCookie);

    return nextResponse;
  } catch {
    return NextResponse.json(
      { message: "백엔드 서버에 연결할 수 없습니다." },
      { status: 502 }
    );
  }
}
