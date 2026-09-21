"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import kakaoIcon from "@/asset/svgs/카카오톡.svg";
import { kakaoLogin } from "@/api/auth/kakao-login";
import { getKakaoAccessToken } from "@/lib/kakao-sdk";
import { useAuthStore } from "@/store/auth-store";

export default function MobileLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signIn = useAuthStore((state) => state.signIn);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const nextPath = searchParams.get("next");
  const destination = nextPath?.startsWith("/") ? nextPath : "/";

  const handleKakaoLogin = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const accessToken = await getKakaoAccessToken();
      const response = await kakaoLogin({ accessToken });
      signIn(response);
      router.replace(destination);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "카카오 로그인에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <main className="min-h-screen bg-white px-5 py-6 md:hidden">
    <div className="mx-auto max-w-[430px]">
      <div className="flex items-center justify-between">
        <button aria-label="이전 화면으로" className="flex h-10 w-10 items-center justify-center" onClick={() => router.back()} type="button"><ChevronLeft className="h-6 w-6" /></button>
        <Link className="text-[22px] font-extrabold tracking-tight text-[#f30031]" href="/">PLANLOG</Link>
        <span className="h-10 w-10" />
      </div>
      <section className="pt-20">
        <h1 className="text-[28px] font-bold tracking-[-0.7px] text-[#111111]">로그인</h1>
        <p className="mt-3 text-[16px] leading-[1.5] tracking-[-0.4px] text-[#505050]">플랜로그와 함께 여행코스를 짜고<br />기록을 저장해 보세요.</p>
        <div className="mt-10 space-y-3">
          <button className="flex h-12 w-full items-center gap-3 rounded-xl bg-[#fee500] px-6 text-left disabled:opacity-60" disabled={isSubmitting} onClick={handleKakaoLogin} type="button"><img alt="" aria-hidden="true" className="h-5 w-5" src={kakaoIcon.src} /><span className="text-[14px] font-medium text-[#111111]">{isSubmitting ? "처리 중..." : "카카오톡 로그인"}</span></button>
          <button className="h-12 w-full rounded-xl border border-[#f30031] text-[14px] font-semibold text-[#f30031]" disabled={isSubmitting} onClick={() => router.push(`/login/guest?next=${encodeURIComponent(destination)}`)} type="button">게스트 로그인</button>
        </div>
        {errorMessage ? <p className="mt-4 text-center text-[13px] text-[#f30031]">{errorMessage}</p> : null}
      </section>
    </div>
  </main>;
}
