import type { AuthResponseDto } from "@/types/auth";

export const MANUAL_MOCK_ACCESS_TOKEN = "manual-mock-access-token";

export const MANUAL_MOCK_AUTH_RESPONSE: AuthResponseDto = {
  accessToken: MANUAL_MOCK_ACCESS_TOKEN,
  user: {
    id: "manual-mock-user",
    provider: "GUEST",
    nickname: "하영",
    email: null,
    profileImage: null,
    isGuest: true,
  },
};
