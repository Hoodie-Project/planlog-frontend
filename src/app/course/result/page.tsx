"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, BadgeCheck, Bookmark, ChevronDown, ChevronLeft, Home, MessageCircleMore, Plus, RefreshCw, X } from "lucide-react";
import { CourseMapLayout } from "@/components/course-result/CourseMapLayout";
import { MainShell } from "@/components/layout/MainShell";
import { Button } from "@/components/ui/Button";
import { testRecommendedCourse, testRecommendedCourseMap, testRecommendedPlaces } from "@/lib/mock-data";
import { useCourseStore } from "@/store/course-store";

type CourseMapPlace = {
  id: number;
  name: string;
  time: string;
  tags: readonly string[];
  address: string;
  status: string;
  hours: string;
  congestion: string;
  congestionTone: string;
  image: string;
  travelMinutesFromPrev?: number;
  lat?: number;
  lng?: number;
};

const toNumber = (value?: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export default function CourseResultPage() {
  const generatedCourse = useCourseStore((state) => state.generatedCourse);
  const saveGeneratedCourse = useCourseStore((state) => state.saveGeneratedCourse);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(1);

  const places = useMemo<CourseMapPlace[]>(() => {
    const items = generatedCourse?.days.flatMap((day) => day.items) ?? [];

    if (items.length === 0) {
      return testRecommendedPlaces.map((place, index) => ({
        ...place,
        id: index + 1,
        lat: testRecommendedCourseMap.markers[index]?.lat,
        lng: testRecommendedCourseMap.markers[index]?.lng,
      }));
    }

    return items.map((item, index) => ({
      id: index + 1,
      name: item.title,
      time: item.arriveTime,
      tags: [`#${generatedCourse?.zoneLabel ?? "추천"}`, `#${item.type === "MEAL" ? "식사" : item.type === "STAY" ? "숙소" : "추천 장소"}`],
      address: item.address ?? "주소 정보가 준비 중입니다.",
      status: "추천 장소",
      hours: `예상 체류 ${item.stayMinutes}분`,
      congestion: generatedCourse?.congestion?.level === "HIGH" ? "높음" : generatedCourse?.congestion?.level === "MEDIUM" ? "보통" : "낮음",
      congestionTone: generatedCourse?.congestion?.level === "HIGH" ? "text-[#ff1f4c]" : generatedCourse?.congestion?.level === "MEDIUM" ? "text-[#ff8a00]" : "text-[#48a600]",
      image: item.image ?? testRecommendedPlaces[0].image,
      travelMinutesFromPrev: item.travelMinutesFromPrev,
      lat: toNumber(item.mapY),
      lng: toNumber(item.mapX),
    }));
  }, [generatedCourse]);

  const mappablePlaces = places.filter((place): place is CourseMapPlace & { lat: number; lng: number } => place.lat !== undefined && place.lng !== undefined);
  const mapData = mappablePlaces.length
    ? {
        center: { lat: mappablePlaces[0].lat, lng: mappablePlaces[0].lng },
        markers: mappablePlaces.map(({ id, lat, lng }) => ({ id, lat, lng })),
        path: mappablePlaces.map(({ lat, lng }) => ({ lat, lng })),
      }
    : testRecommendedCourseMap;
  const selectedPlace = places.find((place) => place.id === selectedPlaceId) ?? null;
  const courseTitle = generatedCourse ? `${generatedCourse.zoneLabel} 추천 코스` : testRecommendedCourse.title;

  if (!generatedCourse) {
    return <CourseResultEmptyState />;
  }

  return (
    <CourseMapLayout
      center={mapData.center}
      markers={mapData.markers}
      path={mapData.path}
      onMarkerClick={setSelectedPlaceId}
      mapOverlay={selectedPlace ? <PlaceOverlay place={selectedPlace} onClose={() => setSelectedPlaceId(null)} /> : null}
      mobileSummary={
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-bold tracking-[-0.5px] text-[#111111]">{courseTitle}</h2>
            <p className="mt-2 text-[14px] leading-[1.4] tracking-[-0.35px] text-[#505050]">{places.map((item) => `${item.time} ${item.name}`).join(" · ")}</p>
          </div>
          <Link className="shrink-0 text-[14px] font-semibold tracking-[-0.35px] text-[#505050]" href="/course/saved">상세보기</Link>
        </div>
      }
      panel={
        <div className="flex h-full flex-col gap-[13px] px-5 pb-8 pt-6">
          <div>
            <h1 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111111]">{courseTitle}</h1>
            <div className="mt-[13px] flex flex-wrap items-center gap-1">
              <button className="inline-flex h-8 items-center justify-center rounded-full bg-[#ff1f4c] px-4 text-[14px] font-bold tracking-[-0.35px] text-white transition hover:bg-[#eb1b47] disabled:cursor-not-allowed disabled:bg-[#d4d4d4]" disabled={!generatedCourse} onClick={saveGeneratedCourse} type="button">
                <Bookmark className="mr-1 h-4 w-4" strokeWidth={2.2} />저장하기
              </button>
              <Link className="inline-flex h-8 items-center justify-center rounded-full bg-[#ffeaee] px-4 text-[14px] font-bold tracking-[-0.35px] text-[#111111] transition hover:bg-[#ffe0e7]" href="/course/create?step=1">
                <RefreshCw className="mr-1 h-4 w-4" strokeWidth={2.2} />다시 추천받기
              </Link>
            </div>
          </div>
          <div className="flex-1 pt-[11px]">
            <div className="space-y-5 border-b border-[#e5e5ec] pb-4 text-[16px] font-semibold leading-[1.4] tracking-[-0.4px] text-[#111111]">
              {places.map((item, index) => {
                const endpoint = index === 0 || index === places.length - 1;

                return (
                  <button key={item.id} className="flex w-full items-start gap-3 text-left" onClick={() => setSelectedPlaceId(item.id)} type="button">
                    <BadgeCheck className={`mt-0.5 h-8 w-8 shrink-0 ${endpoint ? "fill-[#ff1f4c] text-white" : "fill-[#a9a9a9] text-white"}`} strokeWidth={2.6} />
                    <span className="min-w-0"><span className="block text-[18px] font-bold leading-[1.35] tracking-[-0.45px] text-[#111111]"><span className="mr-2 inline-block w-[50px] text-[16px]">{item.time}</span>{item.name}</span>{item.travelMinutesFromPrev !== undefined ? <span className="mt-1 block text-[15px] font-medium tracking-[-0.35px] text-[#505050]">이동 {item.travelMinutesFromPrev}분</span> : null}</span>
                  </button>
                );
              })}
              <Link className="flex items-start gap-1 text-left text-[#111111]" href="/course/create?step=1"><span className="text-[20px] leading-none text-[#ff1f4c]">+</span><span>일정 추가하기</span></Link>
              <Link className="flex items-start gap-1 text-left text-[#111111]" href="/course/result/stays"><span className="text-[20px] leading-none text-[#ff1f4c]">+</span><span>숙소 추가하기</span></Link>
            </div>
            <Link className="mt-4 inline-flex items-center gap-0.5 text-[14px] font-semibold leading-[1.4] tracking-[-0.35px] text-[#505050] transition hover:text-slate-900" href="/course/saved">상세보기<ArrowRight className="h-4 w-4" strokeWidth={2.1} /></Link>
          </div>
        </div>
      }
    />
  );
}

function CourseResultEmptyState() {
  return (
    <MainShell>
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-white">
        <div aria-hidden="true" className="absolute inset-0 scale-[1.02] bg-cover bg-center bg-no-repeat blur-[6px]" style={{ backgroundImage: "url('/images/course/result-empty-map.svg')" }} />
        <div className="absolute inset-0 bg-[rgba(255,255,255,0.42)]" />
        <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-[1920px]">
          <aside className="hidden w-16 shrink-0 border-r border-[#e5e5ec] bg-white/95 lg:block">
            <div className="flex flex-col py-6">
              <div className="flex h-[72px] flex-col items-center justify-center gap-1 border-y border-[#e5e5ec] text-[#111111]"><ArrowUpRight className="h-5 w-5" strokeWidth={2.2} /><span className="text-[11px] font-bold tracking-[-0.3px]">추천 코스</span></div>
              <div className="flex h-[72px] flex-col items-center justify-center gap-1 border-b border-[#e5e5ec] text-[#999999]"><Home className="h-5 w-5" strokeWidth={2.1} /><span className="text-[11px] font-bold tracking-[-0.3px]">추천 숙소</span></div>
              <div className="flex h-[72px] flex-col items-center justify-center gap-1 border-b border-[#e5e5ec] text-[#999999]"><MessageCircleMore className="h-5 w-5" strokeWidth={2.1} /><span className="text-[11px] font-bold tracking-[-0.3px]">코스 후기</span></div>
            </div>
          </aside>
          <div className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
            <div className="w-full max-w-[400px] rounded-[16px] border border-[#d4d4d4] bg-white px-10 py-8 shadow-[0_2px_6px_rgba(17,17,17,0.08)]">
              <div className="text-center"><h1 className="text-[18px] font-bold leading-[1.4] tracking-[-0.45px] text-[#111111]">아직 코스가 없어요</h1><p className="mt-6 text-[16px] leading-[1.4] tracking-[-0.4px] text-[#111111]">여행시간, 감성을 선택하면<br />나에게 맞는 하루 코스를 만들어드려요!</p></div>
              <div className="mt-10 flex flex-col items-center"><Button asChild className="h-12 w-full rounded-[16px] bg-[#ff1f4c] px-5 text-[16px] font-bold tracking-[-0.4px] text-white shadow-[0_2px_6px_rgba(17,17,17,0.08)] hover:bg-[#eb1b47]"><Link href="/course/create?step=1"><Plus className="mr-1 h-5 w-5" strokeWidth={2.4} />코스 만들기</Link></Button><p className="mt-4 text-center text-[14px] leading-[1.4] tracking-[-0.35px] text-[#767676]">코스 생성 후, 지도 위에 추천코스가 표기됩니다.</p></div>
            </div>
          </div>
        </div>
      </section>
    </MainShell>
  );
}

function PlaceOverlay({ place, onClose }: { place: CourseMapPlace; onClose: () => void }) {
  return (
    <>
      <div className="absolute left-4 top-4 z-20 hidden xl:block">
        <div className="overflow-hidden rounded-[16px] border border-[#e5e5ec] bg-white shadow-[0px_2px_6px_rgba(17,17,17,0.08)]">
          <div className="flex h-[calc(100vh-112px)] min-h-[720px] w-[350px] flex-col">
            <div className="flex items-center justify-between px-4 py-4"><button className="text-[#111111]" onClick={onClose} type="button"><ChevronLeft className="h-6 w-6" strokeWidth={1.9} /></button><button className="text-[#111111]" onClick={onClose} type="button"><X className="h-6 w-6" strokeWidth={1.9} /></button></div>
            <div className="border-b border-[#e5e5ec] px-4 pb-4">
              <div className="h-[224px] overflow-hidden rounded-[2px]"><img alt={place.name} className="h-full w-full object-cover" src={place.image} /></div>
              <div className="mt-3"><h3 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111111]">{place.name}</h3><div className="mt-1 flex flex-wrap items-center gap-2 text-[16px] tracking-[-0.4px] text-[#111111]">{place.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
              <div className="mt-3 space-y-1 text-[16px] leading-[1.4] tracking-[-0.4px] text-[#111111]"><p>{place.address}</p><div className="flex flex-wrap items-center gap-1"><span className="font-bold">{place.status}</span><span>{place.hours}</span><ChevronDown className="h-3 w-3" strokeWidth={2} /></div><div className="flex items-center gap-1"><span className="font-bold">혼잡도</span><span className={`font-bold ${place.congestionTone}`}>{place.congestion}</span></div></div>
            </div>
            <div className="flex-1 bg-white" />
          </div>
        </div>
        <button className="absolute left-[350px] top-[420px] flex h-[60px] w-10 items-center justify-center rounded-br-[16px] rounded-tr-[16px] border border-[#e5e5ec] border-l-0 bg-white shadow-[0px_2px_6px_rgba(17,17,17,0.08)]" onClick={onClose} type="button"><ChevronLeft className="h-6 w-6 text-[#111111]" strokeWidth={1.9} /></button>
      </div>
      <div className="absolute inset-x-4 top-4 z-20 xl:hidden"><div className="overflow-hidden rounded-[16px] border border-[#e5e5ec] bg-white shadow-[0px_2px_6px_rgba(17,17,17,0.08)]"><div className="flex items-center justify-between px-4 py-3"><button className="text-[#111111]" onClick={onClose} type="button"><ChevronLeft className="h-5 w-5" strokeWidth={1.9} /></button><button className="text-[#111111]" onClick={onClose} type="button"><X className="h-5 w-5" strokeWidth={1.9} /></button></div><div className="border-t border-[#f2f2f4] px-4 pb-4 pt-1"><p className="text-[20px] font-bold tracking-[-0.5px] text-[#111111]">{place.name}</p><p className="mt-1 text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111111]">{place.address}</p></div></div></div>
    </>
  );
}
