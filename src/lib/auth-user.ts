import type { AuthUserDto } from "@/types/auth";

export function isGeneratedKakaoNickname(user?: AuthUserDto | null) {
  return user?.provider === "KAKAO" && /^카카오사용자[_\s-]*\d*$/u.test(user.nickname.trim());
}
