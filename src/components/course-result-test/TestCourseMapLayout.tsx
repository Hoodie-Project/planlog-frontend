"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ArrowUpRight, Home, MessageCircleMore } from "lucide-react";
import { usePathname } from "next/navigation";
import { MainShell } from "@/components/layout/MainShell";
import { NaverMap } from "@/components/naver-map/NaverMap";

type Coordinate = {
  lat: number;
  lng: number;
};

type MarkerItem = Coordinate & {
  id: number;
  html?: string;
};

type TestCourseMapLayoutProps = {
  panel: ReactNode;
  mobileSummary?: ReactNode;
  center: Coordinate;
  markers: MarkerItem[];
  path?: Coordinate[];
  mapOverlay?: ReactNode;
  onMarkerClick?: (markerId: number) => void;
};

const stageNavItems = [
  { href: "/course/result/test", label: "추천 코스", icon: ArrowUpRight },
  { href: "/course/result/test/stays", label: "추천 숙소", icon: Home },
  { href: "#", label: "코스 후기", icon: MessageCircleMore },
];

export function TestCourseMapLayout({ panel, mobileSummary, center, markers, path, mapOverlay, onMarkerClick }: TestCourseMapLayoutProps) {
  const pathname = usePathname();

  return (
    <MainShell>
      <section className="relative h-[calc(100vh-80px)] overflow-hidden bg-white">
        <div className="relative mx-auto flex h-full max-w-[1920px]">
          <aside className="hidden h-full w-16 shrink-0 border-r border-[#e5e5ec] bg-white lg:block">
            <div className="flex flex-col py-6">
              {stageNavItems.map((item, index) => {
                const active = item.href !== "#" && pathname === item.href;
                const Icon = item.icon;

                const content = (
                  <div
                    className={`flex h-[72px] flex-col items-center justify-center gap-1 ${
                      index === 0 ? "border-y" : "border-b"
                    } border-[#e5e5ec] ${active ? "text-[#111111]" : "text-[#999999]"}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.1} />
                    <span className="text-[11px] font-bold tracking-[-0.3px]">{item.label}</span>
                  </div>
                );

                return item.href === "#" ? (
                  <div key={item.label}>{content}</div>
                ) : (
                  <Link key={item.label} href={item.href}>
                    {content}
                  </Link>
                );
              })}
            </div>
          </aside>

          <aside className="relative z-10 hidden h-full w-[350px] shrink-0 overflow-hidden border-r border-[#e8e8ee] bg-white xl:block">
            {panel}
          </aside>

          <div className="relative h-full flex-1 overflow-hidden">
            <NaverMap center={center} className="absolute inset-0" markers={markers} onMarkerClick={onMarkerClick} path={path} />

            {mapOverlay}

            {mobileSummary ? (
              <div className="absolute inset-x-0 bottom-0 block border-t border-[#ece7de] bg-white/95 p-4 backdrop-blur xl:hidden">
                <div className="mx-auto max-w-[640px] rounded-[20px] border border-[#efe8dc] bg-white px-5 py-5 shadow-[0_10px_30px_rgba(17,17,17,0.06)]">
                  {mobileSummary}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </MainShell>
  );
}
