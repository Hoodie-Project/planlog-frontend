import { NextResponse } from "next/server";
import { proxyAuthRequest } from "@/app/api/auth/_utils";

const guestPaths = ["/api/auth/guest", "/auth/guest"] as const;

export async function POST() {
  try {
    const response = await proxyAuthRequest(guestPaths, {
      method: "POST",
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
        message: error instanceof Error ? error.message : "게스트 로그인 프록시 요청에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
