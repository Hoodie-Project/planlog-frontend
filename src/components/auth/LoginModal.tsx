"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import kakaoIcon from "@/asset/svgs/카카오톡.svg";
import { kakaoLogin } from "@/api/auth/kakao-login";
import { GuestLoginForm } from "@/components/auth/GuestLoginForm";
import { getKakaoAccessToken } from "@/lib/kakao-sdk";
import { useAuthStore } from "@/store/auth-store";

export function LoginModal() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginView, setLoginView] = useState<"choice" | "guest">("choice");
  const loginModalOpen = useAuthStore((state) => state.loginModalOpen);
  const loginModalReason = useAuthStore((state) => state.loginModalReason);
  const closeLoginModal = useAuthStore((state) => state.closeLoginModal);
  const signIn = useAuthStore((state) => state.signIn);

  useEffect(() => {
    if (!loginModalOpen || !window.matchMedia("(max-width: 767px)").matches) return;

    closeLoginModal();
    router.push(`/login?next=${encodeURIComponent(pathname)}`);
  }, [closeLoginModal, loginModalOpen, pathname, router]);

  if (!loginModalOpen) return null;

  const handleClose = () => {
    setErrorMessage(null);
    setLoginView("choice");
    closeLoginModal();

    if (loginModalReason === "protected-route") {
      router.replace("/");
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
            <div className="flex items-center gap-2">{loginView === "guest" ? <button aria-label="로그인 방식 선택으로 돌아가기" className="flex h-6 w-6 items-center justify-center" onClick={() => setLoginView("choice")} type="button"><ChevronLeft className="h-6 w-6" /></button> : null}<h2 className="text-[18px] font-bold leading-[1.4] tracking-[-0.45px] text-[#111]">{loginView === "guest" ? "게스트 로그인" : "로그인"}</h2></div>
            <button aria-label="닫기" className="flex h-6 w-6 items-center justify-center" onClick={handleClose} type="button">
              <X aria-hidden="true" className="h-6 w-6 text-[#111111]" strokeWidth={2} />
            </button>
          </div>
          {loginView === "choice" ? <p className="text-[16px] leading-[1.4] tracking-[-0.4px] text-[#111]">플랜로그과 함께 여행코스를 짜고<br />기록을 저장해 보세요.</p> : <p className="text-[15px] leading-[1.4] tracking-[-0.4px] text-[#505050]">심사자용 게스트 계정 정보를 입력해 주세요.</p>}
        </div>

        {loginView === "guest" ? <GuestLoginForm onSuccess={handleClose} /> : <><button
          className="flex h-12 w-full items-center gap-3 rounded-xl bg-[#fee500] px-6 text-left disabled:opacity-60"
          disabled={isSubmitting}
          onClick={handleKakaoLogin}
          type="button"
        >
          <img alt="" aria-hidden="true" className="h-5 w-5" src={kakaoIcon.src} />
          <span className="text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111]">{isSubmitting ? "처리 중..." : "카카오톡 로그인"}</span>
        </button>
        <button className="h-12 w-full rounded-xl border border-[#f30031] text-[14px] font-semibold text-[#f30031]" disabled={isSubmitting} onClick={() => setLoginView("guest")} type="button">게스트 로그인</button>
        <p className="text-center text-[13px] leading-[1.4] tracking-[-0.3px] text-slate-500">심사자 체험은 게스트 로그인으로 이용할 수 있어요.</p>
        {errorMessage ? <p className="text-center text-[13px] leading-[1.4] tracking-[-0.3px] text-[#f30031]">{errorMessage}</p> : null}</>}
      </div>
    </div>
  );
}
