import Link from "next/link";
import { ReactNode } from "react";

export function MainShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-[1240px] items-center justify-between px-6">
          <Link className="text-2xl font-extrabold tracking-tight text-[#f30031]" href="/">
            PLANLOG
          </Link>
          <nav className="hidden items-center gap-10 text-[17px] md:flex">
            <Link className="font-bold text-slate-900" href="/">
              ABOUT
            </Link>
            <Link className="text-slate-600" href="/course/create">
              코스 만들기
            </Link>
            <Link className="text-slate-600" href="/course/result">
              추천 코스
            </Link>
            <Link className="text-slate-600" href="/records">
              나의 기록
            </Link>
          </nav>
          <nav className="hidden md:flex">
            <Link
              className="inline-flex h-9 items-center justify-center rounded-full border border-[#f30031] px-5 text-[16px] text-slate-900"
              href="/my"
            >
              로그인
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
