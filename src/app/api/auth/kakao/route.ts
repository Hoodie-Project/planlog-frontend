import { NextRequest, NextResponse } from "next/server";
import { proxyAuthRequest } from "@/app/api/auth/_utils";

const kakaoPaths = ["/api/auth/kakao", "/auth/kakao"] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const response = await proxyAuthRequest(kakaoPaths, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
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
        message: error instanceof Error ? error.message : "카카오 로그인 프록시 요청에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
