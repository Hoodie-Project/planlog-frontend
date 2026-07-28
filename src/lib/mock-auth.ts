import type { AuthResponseDto } from "@/types/auth";

// TODO : 로그인 기능 개발 시 해당 코드 삭제
export let isLogin: true | false = true;

export const mockGoogleAuthResponse: AuthResponseDto = {
  accessToken: "mock-google-access-token",
  user: {
    id: "mock-google-user-1",
    provider: "GOOGLE",
    nickname: "하영",
    email: "hayeong@example.com",
    profileImage: "https://www.figma.com/api/mcp/asset/49879dc4-3a30-4cc3-9dbc-681917d2335b",
    isGuest: false,
  },
};

export const mockKakaoAuthResponse: AuthResponseDto = {
  accessToken: "mock-kakao-access-token",
  user: {
    id: "mock-kakao-user-1",
    provider: "KAKAO",
    nickname: "하영",
    email: "hayeong@example.com",
    profileImage: "https://www.figma.com/api/mcp/asset/49879dc4-3a30-4cc3-9dbc-681917d2335b",
    isGuest: false,
  },
};
