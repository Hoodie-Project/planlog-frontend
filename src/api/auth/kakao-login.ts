import { ApiError } from "@/api/client";
import type { AuthResponseDto } from "@/types/auth";

type KakaoLoginDto = {
  accessToken: string;
};

export async function kakaoLogin(payload: KakaoLoginDto) {
  const response = await fetch("/api/auth/kakao", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await response.text();
  const responsePayload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError(`Request failed: ${response.status}`, response.status, responsePayload);
  }

  return responsePayload as AuthResponseDto;
}
