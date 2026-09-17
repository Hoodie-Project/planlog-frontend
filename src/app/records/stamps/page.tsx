"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import completedStampIcon from "@/asset/svgs/completed-stamp.svg";
import { MainShell } from "@/components/layout/MainShell";

const categories = ["바다", "산악", "자연", "문화", "포토"] as const;
const stamps = [
  "경포해변",
  "안목해변",
  "강문해변",
  "사근진해변",
  "사천진해변",
  "송정해변",
  "영진해변",
  "주문진해수욕장",
  "정동진해변",
] as const;

export default function CompletedStampsPage() {
  return (
    <MainShell>
      <main className="mx-auto w-full max-w-[432px] px-4 py-[30px] lg:px-0">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[14px] leading-[1.4] tracking-[-0.35px]">
          <Link className="text-[#767676]" href="/records">나의 기록</Link>
          <ChevronRight className="h-4 w-4 text-[#767676]" strokeWidth={1.8} />
          <span className="font-semibold text-[#111111]">완료한 스탬프</span>
        </nav>

        <div className="mt-5">
          <h1 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111111]">완료한 스탬프</h1>
          <p className="mt-1 text-[14px] leading-[1.4] tracking-[-0.35px] text-[#505050]">여행에서 모은 나만의 스탬프를 종류 별로 모아 볼 수 있어요.</p>
        </div>

        <section className="mt-9">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button key={category} className={`h-6 rounded-full px-2 text-[12px] leading-[1.4] tracking-[-0.3px] ${index === 0 ? "border border-[#ff1f4c] bg-[#ffeaee] font-semibold text-[#ff1f4c]" : "bg-[#f6f6f6] text-[#111111]"}`} type="button">
                  {category}
                </button>
              ))}
            </div>
            <button className="inline-flex h-6 shrink-0 items-center gap-1 rounded-md border border-[#f1f1f5] bg-white px-2 text-[12px] tracking-[-0.3px] text-[#111111] shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)]" type="button">
              최신 순
              <ChevronDown className="h-[14px] w-[14px]" strokeWidth={1.8} />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-[10px]">
            {stamps.map((stamp) => (
              <article key={stamp} className="overflow-hidden rounded-lg bg-white shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)]">
                <div className="flex h-[84px] items-center justify-center bg-[#e8ecff]">
                  <img alt="완료 스탬프" className="h-[72px] w-[72px]" src={completedStampIcon.src} />
                </div>
                <div className="px-[11px] py-[10px] text-center">
                  <p className="text-[14px] font-semibold leading-[1.4] tracking-[-0.35px] text-[#111111]">{stamp}</p>
                  <p className="mt-[2px] text-[12px] leading-[1.4] tracking-[-0.3px] text-[#111111]">2026.09.04</p>
                  <span className="mt-[2px] inline-flex h-6 items-center rounded-full bg-[#f6f6f6] px-2 text-[12px] font-semibold leading-[1.4] tracking-[-0.3px] text-[#5874ff]">완료</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </MainShell>
  );
}
