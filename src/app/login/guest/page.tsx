"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { GuestLoginForm } from "@/components/auth/GuestLoginForm";

function MobileGuestLoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const destination = nextPath?.startsWith("/") ? nextPath : "/";

  return <main className="min-h-screen bg-white px-5 py-6 md:hidden">
    <div className="mx-auto max-w-[430px]">
      <div className="flex items-center justify-between">
        <button aria-label="로그인 방식 선택으로 돌아가기" className="flex h-10 w-10 items-center justify-center" onClick={() => router.back()} type="button"><ChevronLeft className="h-6 w-6" /></button>
        <Link className="text-[22px] font-extrabold tracking-tight text-[#f30031]" href="/">PLANLOG</Link>
        <span className="h-10 w-10" />
      </div>
      <section className="pt-20">
        <h1 className="text-[28px] font-bold tracking-[-0.7px] text-[#111111]">게스트 로그인</h1>
        <p className="mt-3 text-[16px] leading-[1.5] tracking-[-0.4px] text-[#505050]">심사자용 게스트 계정 정보를 입력해 주세요.</p>
        <div className="mt-10"><GuestLoginForm onSuccess={() => router.replace(destination)} /></div>
      </section>
    </div>
  </main>;
}

export default function MobileGuestLoginPage() {
  return <Suspense fallback={<main className="min-h-screen bg-white" />}><MobileGuestLoginPageContent /></Suspense>;
}
