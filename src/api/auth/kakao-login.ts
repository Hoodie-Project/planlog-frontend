import { apiFetch } from "@/api/client";
import type { AuthResponseDto } from "@/types/auth";

type KakaoLoginDto = {
  accessToken: string;
};

export async function kakaoLogin(payload: KakaoLoginDto) {
  return apiFetch<AuthResponseDto>("/api/auth/kakao", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
