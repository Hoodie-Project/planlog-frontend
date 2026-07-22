export type AuthProvider = "KAKAO" | "GOOGLE" | "GUEST";

export type AuthUserDto = {
  id: string;
  provider: AuthProvider;
  nickname: string;
  email: string | null;
  profileImage: string | null;
  isGuest: boolean;
};

export type AuthResponseDto = {
  accessToken: string;
  user: AuthUserDto;
};
