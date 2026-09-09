import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/**
 * Next 서버 라우트 → 백엔드(NestJS) 프록시.
 * 브라우저가 백엔드를 직접 호출하지 않고 same-origin API 경유(CORS 회피, auth 프록시와 동일 패턴).
 */
export async function proxyToBackend(
  path: string,
  request: NextRequest,
  init: { method: string; body?: string }
) {
  const url = `${API_BASE_URL}${path}${request.nextUrl.search}`;
  const authorization = request.headers.get("Authorization");

  try {
    const response = await fetch(url, {
      method: init.method,
      headers: {
        "Content-Type": "application/json",
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: init.body,
      cache: "no-store",
    });

    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "백엔드 프록시 요청에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
