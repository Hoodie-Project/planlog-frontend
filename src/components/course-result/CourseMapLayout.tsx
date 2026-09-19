"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { ArrowUpRight, Home, MessageCircleMore, Plus, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { MainShell } from "@/components/layout/MainShell";
import { NaverMap } from "@/components/naver-map/NaverMap";

type Coordinate = { lat: number; lng: number };
type MarkerItem = Coordinate & { id: number; html?: string };

type CourseMapLayoutProps = {
  panel: ReactNode;
  mobileSummary?: ReactNode;
  center: Coordinate;
  markers: MarkerItem[];
  path?: Coordinate[];
  mapOverlay?: ReactNode;
  onMarkerClick?: (markerId: number) => void;
};

const stageNavItems = [
  { href: "/course/result", label: "추천 코스", icon: ArrowUpRight },
  { href: "/course/result/stays", label: "추천 숙소", icon: Home },
  { href: "#", label: "코스 후기", icon: MessageCircleMore },
];

export function CourseMapLayout({ panel, mobileSummary, center, markers, path, mapOverlay, onMarkerClick }: CourseMapLayoutProps) {
  const pathname = usePathname();
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  return (
    <MainShell mobileHeaderHidden>
      <section className="relative h-[100svh] overflow-hidden bg-white md:h-[calc(100vh-80px)]">
        <div className="relative mx-auto flex h-full max-w-[1920px]">
          <aside className="hidden h-full w-16 shrink-0 border-r border-[#e5e5ec] bg-white lg:block">
            <div className="flex flex-col py-6">
              {stageNavItems.map((item, index) => {
                const active = item.href !== "#" && pathname === item.href;
                const Icon = item.icon;
                const content = (
                  <div className={`flex h-[72px] flex-col items-center justify-center gap-1 ${index === 0 ? "border-y" : "border-b"} border-[#e5e5ec] ${active ? "text-[#111111]" : "text-[#999999]"}`}>
                    <Icon className="h-5 w-5" strokeWidth={2.1} />
                    <span className="text-[11px] font-bold tracking-[-0.3px]">{item.label}</span>
                  </div>
                );

                return item.href === "#" ? <div key={item.label}>{content}</div> : <Link key={item.label} href={item.href}>{content}</Link>;
              })}
            </div>
          </aside>
          <aside className="relative z-10 hidden h-full w-[350px] shrink-0 overflow-hidden border-r border-[#e8e8ee] bg-white xl:block">{panel}</aside>
          <div className="relative h-full flex-1 overflow-hidden">
            <NaverMap center={center} className="absolute inset-0" markers={markers} onMarkerClick={onMarkerClick} path={path} />
            {mapOverlay}
            <nav className="absolute left-1/2 top-7 z-30 flex -translate-x-1/2 rounded-full bg-white p-1 shadow-[0_8px_30px_rgba(17,17,17,0.1)] md:hidden">
              {stageNavItems.map((item) => <Link key={item.label} href={item.href === "#" ? "/course/result" : item.href} className={`whitespace-nowrap rounded-full px-4 py-2 text-[16px] font-semibold tracking-[-0.4px] ${pathname === item.href ? "border-2 border-[#ff1f4c] text-[#111]" : "text-[#999]"}`}>{item.label}</Link>)}
            </nav>
            {mobileSummary ? <button className={`absolute inset-x-0 bottom-[76px] z-30 bg-white text-left shadow-[0_-8px_28px_rgba(17,17,17,0.08)] md:hidden ${mobilePanelOpen ? "hidden" : "block rounded-t-[28px] px-7 py-7"}`} onClick={() => setMobilePanelOpen(true)} type="button">{mobileSummary}</button> : null}
            <div className={`absolute inset-x-0 bottom-[76px] z-30 overflow-y-auto rounded-t-[28px] bg-white shadow-[0_-8px_28px_rgba(17,17,17,0.1)] transition-transform duration-300 md:hidden ${mobilePanelOpen ? "h-[calc(100svh-126px)] translate-y-0" : "translate-y-full"}`}>
              <button aria-label="일정 접기" className="mx-auto mt-3 block h-1.5 w-10 rounded-full bg-[#d9d9d9]" onClick={() => setMobilePanelOpen(false)} type="button" />
              <div className="h-[calc(100%-24px)] overflow-y-auto">{panel}</div>
            </div>
            <nav className="absolute inset-x-0 bottom-0 z-40 grid h-[76px] grid-cols-3 border-t border-[#ececec] bg-white md:hidden">
              <Link className="flex flex-col items-center justify-center gap-1 text-[#999]" href="/course/create?step=1"><Plus className="h-7 w-7" /><span className="text-[13px] font-semibold">코스 만들기</span></Link>
              <Link className="flex flex-col items-center justify-center gap-1 text-[#111]" href="/course/result"><ArrowUpRight className="h-7 w-7 text-[#f30031]" /><span className="text-[13px] font-semibold">추천 코스</span></Link>
              <Link className="flex flex-col items-center justify-center gap-1 text-[#999]" href="/records"><UserRound className="h-7 w-7" /><span className="text-[13px] font-semibold">나의 기록</span></Link>
            </nav>
          </div>
        </div>
      </section>
    </MainShell>
  );
}
