"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { guestLogin } from "@/api/auth/guest-login";
import { kakaoLogin } from "@/api/auth/kakao-login";
import { getKakaoAccessToken } from "@/lib/kakao-sdk";
import { useAuthStore } from "@/store/auth-store";

const kakaoIcon = "https://www.figma.com/api/mcp/asset/9792c010-3954-4969-8649-970bc85b1624";
const closeIcon = "https://www.figma.com/api/mcp/asset/55f7a4d3-3bf3-4e43-8178-6222999c1195";

export function LoginModal() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loginModalOpen = useAuthStore((state) => state.loginModalOpen);
  const loginModalReason = useAuthStore((state) => state.loginModalReason);
  const closeLoginModal = useAuthStore((state) => state.closeLoginModal);
  const signIn = useAuthStore((state) => state.signIn);

  if (!loginModalOpen) {
    return null;
  }

  const handleClose = () => {
    setErrorMessage(null);
    closeLoginModal();

    if (loginModalReason === "protected-route") {
      router.replace("/");
    }
  };

  const handleGuestLogin = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const response = await guestLogin();
      signIn(response);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "게스트 로그인에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKakaoLogin = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const accessToken = await getKakaoAccessToken();
      const response = await kakaoLogin({ accessToken });
      signIn(response);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "카카오 로그인에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.2)] px-4 backdrop-blur-[5px]"
      onClick={handleClose}
    >
      <div
        className="flex w-full max-w-[400px] flex-col gap-[10px] rounded-2xl bg-white px-10 pb-[60px] pt-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <button
              className="text-[18px] font-bold leading-[1.4] tracking-[-0.45px] text-[#111]"
              disabled={isSubmitting}
              onClick={handleGuestLogin}
              type="button"
            >
              로그인
            </button>
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
          className="flex h-12 w-full items-center gap-3 rounded-xl bg-[#fee500] px-6 text-left disabled:opacity-60"
          disabled={isSubmitting}
          onClick={handleKakaoLogin}
          type="button"
        >
          <img alt="" aria-hidden="true" className="h-5 w-5" src={kakaoIcon} />
          <span className="text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111]">{isSubmitting ? "처리 중..." : "카카오톡 로그인"}</span>
        </button>

        <p className="text-center text-[13px] leading-[1.4] tracking-[-0.3px] text-slate-500">상단의 &quot;로그인&quot; 텍스트를 누르면 게스트로 입장합니다.</p>

        {errorMessage ? <p className="text-center text-[13px] leading-[1.4] tracking-[-0.3px] text-[#f30031]">{errorMessage}</p> : null}
      </div>
    </div>
  );
}
