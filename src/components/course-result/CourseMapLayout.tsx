"use client";

import Link from "next/link";
import { ReactNode, useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowUpRight, Home, MessageCircleMore } from "lucide-react";
import { usePathname } from "next/navigation";
import { MainShell } from "@/components/layout/MainShell";
import { NaverMap } from "@/components/naver-map/NaverMap";

type Coordinate = { lat: number; lng: number };
type MarkerItem = Coordinate & { id: number; html?: string; anchor?: number };

type CourseMapLayoutProps = {
  panel: ReactNode;
  mobileSummary?: ReactNode;
  mobilePanel?: ReactNode;
  mobileExpandedPanel?: ReactNode;
  mobilePanelExpandWhenRendered?: boolean;
  center: Coordinate;
  markers: MarkerItem[];
  path?: Coordinate[];
  mapOverlay?: ReactNode;
  onMarkerClick?: (markerId: number) => void;
  fitBounds?: boolean;
  focus?: Coordinate | null;
};

const stageNavItems = [
  { href: "/course/result", label: "추천 코스", icon: ArrowUpRight },
  { href: "/course/result/stays", label: "추천 숙소", icon: Home },
  { href: "/course/result/reviews", label: "코스 후기", icon: MessageCircleMore },
];

export function CourseMapLayout({ panel, mobileSummary, mobilePanel, mobileExpandedPanel, mobilePanelExpandWhenRendered = false, center, markers, path, mapOverlay, onMarkerClick, fitBounds, focus }: CourseMapLayoutProps) {
  const pathname = usePathname();
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [mobilePanelExpanded, setMobilePanelExpanded] = useState(false);
  const mobilePanelDragStartYRef = useRef<number | null>(null);

  const handleMobilePanelDragStart = (event: PointerEvent<HTMLDivElement>) => {
    mobilePanelDragStartYRef.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleMobilePanelDragEnd = (event: PointerEvent<HTMLDivElement>) => {
    const dragStartY = mobilePanelDragStartYRef.current;
    mobilePanelDragStartYRef.current = null;

    if (dragStartY === null) return;

    const dragDistance = event.clientY - dragStartY;
    if (dragDistance <= -48) setMobilePanelExpanded(true);
    if (dragDistance >= 48) setMobilePanelExpanded(false);
  };

  useEffect(() => {
    setMobilePanelExpanded(mobilePanelExpandWhenRendered);
  }, [mobilePanelExpandWhenRendered]);

  return (
    <MainShell mobileFooterHidden mobileHeaderHidden>
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

                return <Link key={item.label} href={item.href}>{content}</Link>;
              })}
            </div>
          </aside>
          <aside className="relative z-10 hidden h-full w-[350px] shrink-0 overflow-x-hidden overflow-y-auto border-r border-[#e8e8ee] bg-white xl:block">{panel}</aside>
          <div className="relative h-full flex-1 overflow-hidden">
            <NaverMap
              center={center}
              className="absolute inset-0"
              fitBounds={fitBounds}
              focus={focus}
              markers={markers}
              onMapClick={() => {
                if (mobileSummary && mobilePanelOpen) {
                  setMobilePanelExpanded(false);
                  setMobilePanelOpen(false);
                }
              }}
              onMarkerClick={onMarkerClick}
              path={path}
            />
            {mapOverlay}
            <nav className="absolute left-1/2 top-7 z-30 flex -translate-x-1/2 rounded-full bg-white p-1 shadow-[0_8px_30px_rgba(17,17,17,0.1)] md:hidden">
              {stageNavItems.map((item) => <Link key={item.label} href={item.href} className={`whitespace-nowrap rounded-full px-4 py-2 text-[16px] font-semibold tracking-[-0.4px] ${pathname === item.href ? "border-2 border-[#ff1f4c] text-[#111]" : "text-[#999]"}`}>{item.label}</Link>)}
            </nav>
            {mobilePanel ? (
              <div className={`absolute inset-x-0 bottom-[88px] z-30 flex flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_-8px_28px_rgba(17,17,17,0.1)] transition-[height] duration-300 ease-out md:hidden ${mobilePanelExpanded ? "h-[calc(100svh-220px)]" : "h-[min(430px,calc(100svh-220px))]"}`}>
                <div
                  aria-expanded={mobilePanelExpanded}
                  aria-label={`일정 ${mobilePanelExpanded ? "접기" : "펼치기"}`}
                  className="flex h-8 shrink-0 touch-none items-center justify-center"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " " || event.key === "ArrowUp") {
                      event.preventDefault();
                      setMobilePanelExpanded(true);
                    }
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      setMobilePanelExpanded(false);
                    }
                  }}
                  onPointerCancel={() => { mobilePanelDragStartYRef.current = null; }}
                  onPointerDown={handleMobilePanelDragStart}
                  onPointerUp={handleMobilePanelDragEnd}
                  role="button"
                  tabIndex={0}
                >
                  <span className="h-1.5 w-10 rounded-full bg-[#d9d9d9]" />
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">{mobilePanel}</div>
              </div>
            ) : (
              <>
                {mobileSummary ? <div className={`absolute inset-x-0 bottom-[88px] z-30 bg-white text-left shadow-[0_-8px_28px_rgba(17,17,17,0.08)] md:hidden ${mobilePanelOpen ? "hidden" : "block rounded-t-[28px] px-7 py-7"}`} onClick={(event) => { if ((event.target as HTMLElement).closest("button, a")) return; setMobilePanelExpanded(false); setMobilePanelOpen(true); }}>{mobileSummary}</div> : null}
                <div className={`absolute inset-x-0 bottom-[88px] z-30 flex flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_-8px_28px_rgba(17,17,17,0.1)] transition-[height,transform] duration-300 ease-out md:hidden ${mobilePanelExpanded ? "h-[calc(100svh-220px)]" : "h-[min(430px,calc(100svh-220px))]"} ${mobilePanelOpen ? "translate-y-0" : "translate-y-[calc(100%+88px)]"}`}>
                  <div
                    aria-expanded={mobilePanelExpanded}
                    aria-label={`목록 ${mobilePanelExpanded ? "접기" : "펼치기"}`}
                    className="flex h-8 shrink-0 touch-none items-center justify-center"
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " " || event.key === "ArrowUp") {
                        event.preventDefault();
                        setMobilePanelExpanded(true);
                      }
                      if (event.key === "ArrowDown") {
                        event.preventDefault();
                        setMobilePanelExpanded(false);
                      }
                    }}
                    onPointerCancel={() => { mobilePanelDragStartYRef.current = null; }}
                    onPointerDown={handleMobilePanelDragStart}
                    onPointerUp={handleMobilePanelDragEnd}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="h-1.5 w-10 rounded-full bg-[#d9d9d9]" />
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto">{mobileExpandedPanel ?? panel}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </MainShell>
  );
}
