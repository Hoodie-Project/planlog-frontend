import { NextRequest, NextResponse } from "next/server";
import { proxyAuthRequest } from "@/app/api/auth/_utils";

const mePaths = ["/api/auth/me", "/auth/me"] as const;

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get("Authorization");
    const response = await proxyAuthRequest(mePaths, {
      method: "GET",
      headers: authorization ? { Authorization: authorization } : undefined,
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
        message: error instanceof Error ? error.message : "내 정보 프록시 요청에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
