"use client";

import { useRouter } from "next/navigation";
import { mockGoogleAuthResponse, mockKakaoAuthResponse } from "@/lib/mock-auth";
import { useAuthStore } from "@/store/auth-store";

const googleIcon = "https://www.figma.com/api/mcp/asset/7b9a86e0-5bc5-4081-bdc4-d9ef9abc5d86";
const kakaoIcon = "https://www.figma.com/api/mcp/asset/9792c010-3954-4969-8649-970bc85b1624";
const closeIcon = "https://www.figma.com/api/mcp/asset/55f7a4d3-3bf3-4e43-8178-6222999c1195";

export function LoginModal() {
  const router = useRouter();
  const loginModalOpen = useAuthStore((state) => state.loginModalOpen);
  const loginModalReason = useAuthStore((state) => state.loginModalReason);
  const closeLoginModal = useAuthStore((state) => state.closeLoginModal);
  const signIn = useAuthStore((state) => state.signIn);

  if (!loginModalOpen) {
    return null;
  }

  const handleClose = () => {
    closeLoginModal();

    if (loginModalReason === "protected-route") {
      router.replace("/");
    }
  };

  const handleMockLogin = (provider: "google" | "kakao") => {
    // TODO : 로그인 기능 개발 시 해당 코드 삭제
    signIn(provider === "google" ? mockGoogleAuthResponse : mockKakaoAuthResponse);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.2)] px-4 backdrop-blur-[5px]">
      <div className="flex w-full max-w-[400px] flex-col gap-[10px] rounded-2xl bg-white px-10 pb-[60px] pt-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <p className="text-[18px] font-bold leading-[1.4] tracking-[-0.45px] text-[#111]">로그인</p>
            <button className="flex h-6 w-6 items-center justify-center" onClick={handleClose} type="button">
              <img alt="닫기" className="h-6 w-6" src={closeIcon} />
            </button>
          </div>
          <p className="text-[16px] leading-[1.4] tracking-[-0.4px] text-[#111]">
            플랜로그과 함께 여행코스를 짜고
            <br />
            기록을 저장해 보세요.
          </p>
        </div>

        <button
          className="flex h-12 w-full items-center gap-3 rounded-xl border border-[#e5e5ec] bg-white px-6 text-left"
          onClick={() => handleMockLogin("google")}
          type="button"
        >
          <img alt="" aria-hidden="true" className="h-5 w-5" src={googleIcon} />
          <span className="text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111]">구글 로그인</span>
        </button>

        <button
          className="flex h-12 w-full items-center gap-3 rounded-xl bg-[#fee500] px-6 text-left"
          onClick={() => handleMockLogin("kakao")}
          type="button"
        >
          <img alt="" aria-hidden="true" className="h-5 w-5" src={kakaoIcon} />
          <span className="text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111]">카카오톡 로그인</span>
        </button>
      </div>
    </div>
  );
}
