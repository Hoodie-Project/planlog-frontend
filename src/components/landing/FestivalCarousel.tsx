"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { listFestivals, type FestivalDto } from "@/api/platform";

const zoneLabels: Record<string, string> = {
  SEA: "바다",
  SNOW: "설원·산악",
  VALLEY: "자연",
  RETRO: "전통문화",
  PHOTO: "절경·포토",
};

function formatEventDate(value?: string | null) {
  if (!value) return "일정 정보 준비 중";
  const normalized = value.replace(/[^0-9]/g, "");
  if (normalized.length !== 8) return value;
  return `${normalized.slice(4, 6)}.${normalized.slice(6, 8)}`;
}

function formatPeriod(festival: FestivalDto) {
  const start = formatEventDate(festival.eventStartDate);
  const end = formatEventDate(festival.eventEndDate);
  return start === end ? start : `${start} - ${end}`;
}

function locationLabel(address?: string) {
  const parts = address?.split(/\s+/).filter(Boolean) ?? [];
  const city = parts.find((part) => /[시군]$/.test(part));
  return city?.replace(/[시군]$/, "") ?? parts[0] ?? "강원도";
}

function FestivalImage({ festival }: { festival: FestivalDto }) {
  const [isAvailable, setIsAvailable] = useState(Boolean(festival.image));

  useEffect(() => {
    setIsAvailable(Boolean(festival.image));
  }, [festival.image]);

  if (!festival.image || !isAvailable) {
    return <div className="flex h-[150px] w-[200px] shrink-0 items-center justify-center rounded-lg bg-[#ffe8ed] text-center text-[14px] font-semibold text-[#f30031]">축제 이미지 준비 중</div>;
  }

  return <img alt={festival.title} className="h-[150px] w-[200px] shrink-0 rounded-lg object-cover" onError={() => setIsAvailable(false)} src={festival.image.replace(/^http:/, "https:")} />;
}

export function FestivalCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [festivals, setFestivals] = useState<FestivalDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadFestivals = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await listFestivals({ weekendOnly: true, numOfRows: 20 });
        if (isActive) setFestivals(response);
      } catch {
        if (isActive) setError("이번 주 축제를 불러오지 못했어요.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadFestivals();
    return () => {
      isActive = false;
    };
  }, []);

  const moveCarousel = (direction: "previous" | "next") => {
    const element = carouselRef.current;
    if (!element) return;

    const cards = Array.from(element.children) as HTMLElement[];
    const firstCard = cards[0];
    if (!firstCard) return;

    const gap = Number.parseFloat(window.getComputedStyle(element).columnGap) || 0;
    const cardStep = firstCard.offsetWidth + gap;
    const currentIndex = Math.round(element.scrollLeft / cardStep);
    const nextIndex = Math.min(
      Math.max(currentIndex + (direction === "next" ? 1 : -1), 0),
      cards.length - 1
    );

    element.scrollTo({ left: nextIndex * cardStep, behavior: "smooth" });
  };

  if (isLoading) return <p className="py-10 text-center text-[14px] text-slate-500">이번 주 축제를 불러오는 중이에요.</p>;
  if (error) return <p className="py-10 text-center text-[14px] text-[#f30031]">{error}</p>;
  if (festivals.length === 0) return <p className="py-10 text-center text-[14px] text-slate-500">이번 주에 열리는 축제가 없어요.</p>;

  return <div className="relative">
    <div className="flex justify-end gap-2 pb-3">
      <button aria-label="이전 축제 보기" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e5ec] bg-white text-[#505050] shadow-sm transition hover:border-[#f30031] hover:text-[#f30031]" onClick={() => moveCarousel("previous")} type="button"><ChevronLeft className="h-5 w-5" /></button>
      <button aria-label="다음 축제 보기" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e5ec] bg-white text-[#505050] shadow-sm transition hover:border-[#f30031] hover:text-[#f30031]" onClick={() => moveCarousel("next")} type="button"><ChevronRight className="h-5 w-5" /></button>
    </div>
    <div className="-mx-2 -my-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-5 pt-2 [scrollbar-width:none]" ref={carouselRef}>
      {festivals.map((festival) => (
        <article className="flex min-w-full shrink-0 snap-start [scroll-snap-stop:always] items-center gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_6px_rgba(17,17,17,0.08)] md:min-w-0 md:basis-[calc((100%_-_32px)_/_3)]" key={festival.contentId}>
          <FestivalImage festival={festival} />
          <div className="min-w-0">
            <span className="inline-flex h-6 items-center rounded-full bg-slate-100 px-3 text-[12px] font-semibold text-slate-600">{festival.zone ? zoneLabels[festival.zone] ?? "축제" : "축제"}</span>
            <h3 className="mt-3 truncate text-[16px] font-semibold text-slate-900">{festival.title}</h3>
            <div className="mt-1 flex items-center gap-2 text-[14px] text-slate-700"><span>{locationLabel(festival.address)}</span><span className="h-2.5 w-px rounded-full bg-slate-400" /><span>{formatPeriod(festival)}</span></div>
          </div>
        </article>
      ))}
    </div>
  </div>;
}
