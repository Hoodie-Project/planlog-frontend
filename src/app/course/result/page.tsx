"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, BadgeCheck, Bookmark, ChevronDown, ChevronLeft, Home, MessageCircleMore, Plus, RefreshCw, X } from "lucide-react";
import { CourseMapLayout } from "@/components/course-result/CourseMapLayout";
import { MainShell } from "@/components/layout/MainShell";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/api/client";
import { completeSavedCourse, createSavedCourse, getSavedCourse, startSavedCourse } from "@/api/saved-courses";
import { createStamp, getStampEligibility, listStamps, type StampEligibilityDto } from "@/api/stamps";
import { createRecord, getSpotCongestion } from "@/api/platform";
import { StampReviewModal } from "@/components/review/StampReviewModal";
import type { CongestionLevel, SavedCourseDto } from "@/types/course";
import { useAuthStore } from "@/store/auth-store";
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
  contentId: string;
  zone: NonNullable<import("@/types/course").CourseItemDto["zone"]>;
  lat?: number;
  lng?: number;
};

const toNumber = (value?: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const fallbackMapCenter = { lat: 37.7519, lng: 128.8761 };
type SaveStatus = "idle" | "saving" | "saved" | "error";

function courseMarkerHtml(id: number, selected: boolean, hasSelection: boolean) {
  const size = selected ? 48 : 36;
  const color = hasSelection && !selected ? "#ff96ab" : "#ff1f4c";

  return `<span style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:9999px;background:${color};color:#fff;font-weight:700;font-size:${selected ? 22 : 20}px;line-height:1;box-shadow:0 8px 20px rgba(255,31,76,.28)">${id}</span>`;
}

function congestionLabel(level?: CongestionLevel) {
  return level === "HIGH" ? "높음" : level === "MEDIUM" ? "보통" : "낮음";
}

function congestionTone(level?: CongestionLevel) {
  return level === "HIGH" ? "text-[#ff1f4c]" : level === "MEDIUM" ? "text-[#ff8a00]" : "text-[#48a600]";
}

export default function CourseResultPage() {
  const generatedCourse = useCourseStore((state) => state.generatedCourse);
  const accessToken = useAuthStore((state) => state.accessToken);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  const setGeneratedCourse = useCourseStore((state) => state.setGeneratedCourse);
  const activeSavedCourseId = useCourseStore((state) => state.activeSavedCourseId);
  const setActiveSavedCourseId = useCourseStore((state) => state.setActiveSavedCourseId);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedCourse, setSavedCourse] = useState<SavedCourseDto | null>(null);
  const [refreshOpen, setRefreshOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [stampEligibility, setStampEligibility] = useState<StampEligibilityDto | null>(null);
  const [location, setLocation] = useState<{ mapX: string; mapY: string } | null>(null);
  const [stampPending, setStampPending] = useState(false);
  const [stampedContentIds, setStampedContentIds] = useState<Set<string>>(new Set());
  const [stampReview, setStampReview] = useState<{ stampId: string; place: CourseMapPlace } | null>(null);
  const [stampReviewSaving, setStampReviewSaving] = useState(false);
  const [spotCongestion, setSpotCongestion] = useState<Map<string, CongestionLevel>>(new Map());

  useEffect(() => {
    const items = generatedCourse?.days.flatMap((day) => day.items) ?? [];
    if (items.length === 0) {
      setSpotCongestion(new Map());
      return;
    }

    let cancelled = false;
    const date = generatedCourse?.congestion?.date;

    Promise.all(
      items.map((item) =>
        getSpotCongestion({ zone: item.zone ?? generatedCourse?.zone ?? "SEA", title: item.title, date })
          .then((forecast) => [item.contentId, forecast.matched ? forecast.days[0]?.level : undefined] as const)
          .catch(() => [item.contentId, undefined] as const)
      )
    ).then((entries) => {
      if (cancelled) return;
      const map = new Map<string, CongestionLevel>();
      for (const [contentId, level] of entries) {
        if (level) map.set(contentId, level);
      }
      setSpotCongestion(map);
    });

    return () => {
      cancelled = true;
    };
  }, [generatedCourse]);

  const places = useMemo<CourseMapPlace[]>(() => {
    const items = generatedCourse?.days.flatMap((day) => day.items) ?? [];

    return items.map((item, index) => {
      const level = spotCongestion.get(item.contentId) ?? generatedCourse?.congestion?.level;
      return {
        id: index + 1,
        contentId: item.contentId,
        zone: item.zone ?? generatedCourse?.zone ?? "SEA",
        name: item.title,
        time: item.arriveTime,
        tags: [`#${generatedCourse?.zoneLabel ?? "추천"}`, `#${item.type === "MEAL" ? "식사" : item.type === "STAY" ? "숙소" : "추천 장소"}`],
        address: item.address ?? "주소 정보가 준비 중입니다.",
        status: "추천 장소",
        hours: `예상 체류 ${item.stayMinutes}분`,
        congestion: congestionLabel(level),
        congestionTone: congestionTone(level),
        image: item.image ?? "",
        travelMinutesFromPrev: item.travelMinutesFromPrev,
        lat: toNumber(item.mapY),
        lng: toNumber(item.mapX),
      };
    });
  }, [generatedCourse, spotCongestion]);

  const mappablePlaces = places.filter((place): place is CourseMapPlace & { lat: number; lng: number } => place.lat !== undefined && place.lng !== undefined);
  const hasSelectedPlace = selectedPlaceId !== null;
  const mapData = mappablePlaces.length
    ? {
        center: { lat: mappablePlaces[0].lat, lng: mappablePlaces[0].lng },
        markers: mappablePlaces.map(({ id, lat, lng }) => ({
          id,
          lat,
          lng,
          html: courseMarkerHtml(id, selectedPlaceId === id, hasSelectedPlace),
          anchor: selectedPlaceId === id ? 24 : 18,
        })),
        path: mappablePlaces.map(({ lat, lng }) => ({ lat, lng })),
      }
    : { center: fallbackMapCenter, markers: [], path: [] };
  const selectedPlace = places.find((place) => place.id === selectedPlaceId) ?? null;
  const selectedPlacePosition = selectedPlace?.lat !== undefined && selectedPlace.lng !== undefined
    ? { lat: selectedPlace.lat, lng: selectedPlace.lng }
    : null;
  const courseTitle = generatedCourse ? `${generatedCourse.zoneLabel} 추천 코스` : "추천 코스";

  useEffect(() => {
    if (!accessToken || !activeSavedCourseId) return;
    getSavedCourse(accessToken, activeSavedCourseId)
      .then((course) => {
        setSavedCourse(course);
        setGeneratedCourse(course.payload);
      })
      .catch(() => setActiveSavedCourseId(null));
  }, [accessToken, activeSavedCourseId, setActiveSavedCourseId, setGeneratedCourse]);

  useEffect(() => {
    if (!accessToken || !selectedPlace) return;
    getStampEligibility(accessToken, selectedPlace.contentId, location ?? undefined).then(setStampEligibility).catch(() => setStampEligibility(null));
  }, [accessToken, selectedPlace, location]);

  useEffect(() => {
    if (!accessToken) {
      setStampedContentIds(new Set());
      return;
    }

    listStamps(accessToken).then((stamps) => setStampedContentIds(new Set(stamps.map((stamp) => stamp.contentId)))).catch(() => setStampedContentIds(new Set()));
  }, [accessToken]);

  const ensureSavedCourse = async () => {
    if (!generatedCourse || !accessToken) throw new Error("로그인이 필요합니다.");
    if (savedCourse) return savedCourse;
    const created = await createSavedCourse(accessToken, generatedCourse);
    setSavedCourse(created);
    setActiveSavedCourseId(created.id);
    return created;
  };

  const handleSaveCourse = async () => {
    if (!generatedCourse) return;
    if (!accessToken) {
      openLoginModal("protected-route");
      return;
    }

    setSaveStatus("saving");
    setSaveError(null);
    try {
      await ensureSavedCourse();
      setSaveStatus("saved");
    } catch (error) {
      setSaveStatus("error");
      setSaveError(error instanceof ApiError ? error.message : "코스 저장에 실패했습니다.");
    }
  };

  const handleStartCourse = async () => {
    if (!accessToken) return openLoginModal("protected-route");
    try { setSaveStatus("saving"); const course = await ensureSavedCourse(); setSavedCourse(await startSavedCourse(accessToken, course.id)); setSaveStatus("saved"); } catch (error) { setSaveStatus("error"); setSaveError(error instanceof Error ? error.message : "코스를 시작하지 못했어요."); }
  };

  const handleCompleteCourse = async ({ emotion, review }: { emotion: string; review: string }) => {
    if (!accessToken) return openLoginModal("protected-route");
    try {
      const course = await ensureSavedCourse();
      await createRecord(accessToken, {
        title: `${course.title} 여행 기록`,
        travelDate: course.travelDate ?? new Date().toISOString().slice(0, 10),
        location: course.payload.zoneLabel,
        zone: course.zone,
        note: review,
        mood: emotion,
        image: null,
        tags: [course.title, course.payload.zoneLabel],
        savedCourseId: course.id,
      });
      setSavedCourse(await completeSavedCourse(accessToken, course.id));
      setReviewOpen(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "코스를 종료하지 못했어요.");
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => setLocation({ mapX: String(position.coords.longitude), mapY: String(position.coords.latitude) }), () => setLocation(null), { enableHighAccuracy: true, timeout: 10000 });
  };

  const handleReceiveStamp = async () => {
    if (!accessToken || !selectedPlace || !stampEligibility || !["ELIGIBLE", "REVIEWER"].includes(stampEligibility.state)) return;
    try {
      setStampPending(true);
      const stamp = await createStamp(accessToken, { zone: selectedPlace.zone, contentId: selectedPlace.contentId, title: selectedPlace.name, image: selectedPlace.image || undefined, curMapX: location?.mapX, curMapY: location?.mapY });
      setStampedContentIds((ids) => new Set(ids).add(selectedPlace.contentId));
      setStampEligibility(await getStampEligibility(accessToken, selectedPlace.contentId, location ?? undefined));
      setStampReview({ stampId: stamp.id, place: selectedPlace });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "스탬프를 받지 못했어요.");
    } finally {
      setStampPending(false);
    }
  };

  const handleSaveStampReview = async ({ emotion, review }: { emotion: string; review: string }) => {
    if (!accessToken || !stampReview || stampReviewSaving) return;

    try {
      setStampReviewSaving(true);
      await createRecord(accessToken, {
        title: `${stampReview.place.name} 방문 기록`,
        travelDate: new Date().toISOString().slice(0, 10),
        location: stampReview.place.address,
        zone: stampReview.place.zone,
        note: review,
        mood: emotion,
        image: stampReview.place.image || null,
        tags: [stampReview.place.name, generatedCourse?.zoneLabel ?? "여행"],
        savedCourseId: savedCourse?.id,
        stampIds: [stampReview.stampId],
      });
      setStampReview(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "장소 리뷰를 저장하지 못했어요.");
    } finally {
      setStampReviewSaving(false);
    }
  };

  if (!generatedCourse || places.length === 0) {
    return <CourseResultEmptyState hasEmptyGeneratedCourse={Boolean(generatedCourse)} />;
  }

  return (
    <>
    <CourseMapLayout
      center={mapData.center}
      focus={selectedPlacePosition}
      markers={mapData.markers}
      path={mapData.path}
      onMarkerClick={setSelectedPlaceId}
      mapOverlay={selectedPlace ? <PlaceOverlay eligibility={stampEligibility} onReceiveStamp={handleReceiveStamp} onRequestLocation={requestLocation} place={selectedPlace} stampPending={stampPending} onClose={() => setSelectedPlaceId(null)} /> : null}
      mobileSummary={
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-bold tracking-[-0.7px] text-[#111111]">{courseTitle}</h2>
            <p className="mt-6 text-[18px] text-[#111]">혼잡도: <span className="font-semibold text-[#227bff]">{generatedCourse.congestion?.level === "HIGH" ? "높음" : generatedCourse.congestion?.level === "MEDIUM" ? "보통" : "낮음"}</span></p>
            <p className="mt-3 text-[18px] text-[#111]">코스 소요시간: {Math.floor(generatedCourse.totalTravelMinutes / 60)}h {generatedCourse.totalTravelMinutes % 60}m</p>
            <p className="mt-6 border-t border-[#e5e5ec] pt-5 text-[22px] font-bold text-[#111]">{places[0]?.time} &nbsp;{places[0]?.name}</p>
          </div>
          <div className="flex gap-3"><button aria-label={savedCourse ? "코스 저장 완료" : "코스 저장"} disabled={saveStatus === "saving" || Boolean(savedCourse)} onClick={handleSaveCourse} type="button"><Bookmark className={`h-8 w-8 text-[#ff1f4c] ${savedCourse ? "fill-[#ff1f4c]" : ""}`} /></button><button aria-label="다시 추천받기" onClick={() => setRefreshOpen(true)} type="button"><RefreshCw className="h-8 w-8" /></button></div>
        </div>
      }
      panel={
        <div className="flex h-full flex-col gap-[13px] px-5 pb-8 pt-6">
          <div>
            <h1 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111111]">{courseTitle}</h1>
            <div className="mt-[13px] flex flex-wrap items-center gap-1">
              <button className="inline-flex h-8 items-center justify-center rounded-full bg-[#ff1f4c] px-4 text-[14px] font-bold tracking-[-0.35px] text-white transition hover:bg-[#eb1b47] disabled:cursor-not-allowed disabled:bg-[#d4d4d4]" disabled={saveStatus === "saving" || savedCourse?.status === "COMPLETED"} onClick={savedCourse?.status === "IN_PROGRESS" ? () => setReviewOpen(true) : handleStartCourse} type="button">
                {savedCourse?.status === "IN_PROGRESS" ? "코스 종료하기" : savedCourse?.status === "COMPLETED" ? "코스 완료" : "코스 시작하기"}
              </button>
              <button aria-label={savedCourse ? "코스 저장 완료" : "코스 저장"} className="inline-flex h-8 items-center justify-center rounded-full border border-[#ff1f4c] px-3 text-[#ff1f4c]" disabled={saveStatus === "saving" || Boolean(savedCourse)} onClick={handleSaveCourse} type="button"><Bookmark className={`h-4 w-4 ${savedCourse ? "fill-[#ff1f4c]" : ""}`} /></button>
              <button className="inline-flex h-8 items-center justify-center rounded-full bg-[#ffeaee] px-4 text-[14px] font-bold tracking-[-0.35px] text-[#111111] transition hover:bg-[#ffe0e7]" onClick={() => setRefreshOpen(true)} type="button">
                <RefreshCw className="mr-1 h-4 w-4" strokeWidth={2.2} />다시 추천받기
              </button>
            </div>
          </div>
          <div className="flex-1 pt-[11px]">
            <div className="space-y-5 border-b border-[#e5e5ec] pb-4 text-[16px] font-semibold leading-[1.4] tracking-[-0.4px] text-[#111111]">
              {places.map((item) => {
                const stamped = stampedContentIds.has(item.contentId);

                return (
                  <button key={item.id} className="flex w-full items-start gap-3 text-left" onClick={() => setSelectedPlaceId(item.id)} type="button">
                    <BadgeCheck className={`mt-0.5 h-8 w-8 shrink-0 ${stamped ? "fill-[#ff1f4c] text-white" : "fill-[#a9a9a9] text-white"}`} strokeWidth={2.6} />
                    <span className="min-w-0"><span className="block text-[18px] font-bold leading-[1.35] tracking-[-0.45px] text-[#111111]"><span className="mr-2 inline-block w-[50px] text-[16px]">{item.time}</span>{item.name}</span>{item.travelMinutesFromPrev !== undefined ? <span className="mt-1 block text-[15px] font-medium tracking-[-0.35px] text-[#505050]">이동 {item.travelMinutesFromPrev}분</span> : null}</span>
                  </button>
                );
              })}
              <Link className="flex items-start gap-1 text-left text-[#111111]" href="/course/result/stays"><span className="text-[20px] leading-none text-[#ff1f4c]">+</span><span>숙소 추가하기</span></Link>
            </div>
            <Link className="mt-4 inline-flex items-center gap-0.5 text-[14px] font-semibold leading-[1.4] tracking-[-0.35px] text-[#505050] transition hover:text-slate-900" href="/course/saved">상세보기<ArrowRight className="h-4 w-4" strokeWidth={2.1} /></Link>
            {saveStatus === "saved" ? <Link className="mt-2 block text-[13px] text-[#f30031] underline" href="/course/saved">저장한 코스에서 확인하기</Link> : null}
            {saveStatus === "error" && saveError ? <p className="mt-2 text-[13px] text-[#f30031]">{saveError}</p> : null}
          </div>
        </div>
      }
    />
      {refreshOpen ? <ConfirmModal confirmLabel="다시 추천받기" description="새로운 조건으로 코스를 다시 추천받을 수 있어요." onClose={() => setRefreshOpen(false)} onConfirm={() => { setGeneratedCourse(null); setRefreshOpen(false); window.location.assign("/course/create?step=1"); }} title="다른 코스를 추천받을까요?" /> : null}
      {reviewOpen ? <StampReviewModal mode="write" onClose={() => setReviewOpen(false)} onSave={handleCompleteCourse} /> : null}
      {stampReview ? <StampReviewModal mode="write" onClose={() => setStampReview(null)} onSave={handleSaveStampReview} /> : null}
    </>
  );
}

function CourseResultEmptyState({ hasEmptyGeneratedCourse = false }: { hasEmptyGeneratedCourse?: boolean }) {
  return (
    <MainShell mobileFooterHidden mobileHeaderHidden>
      <section className="relative min-h-[100svh] overflow-hidden bg-white md:min-h-[calc(100vh-80px)]">
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
            <div className="absolute left-1/2 top-7 z-30 flex -translate-x-1/2 rounded-full bg-white p-1 shadow-[0_8px_30px_rgba(17,17,17,0.1)] md:hidden"><span className="rounded-full border-2 border-[#ff1f4c] px-4 py-2 text-[16px] font-semibold">추천 코스</span><Link className="px-4 py-2 text-[16px] font-semibold text-[#999]" href="/course/result/stays">추천 숙소</Link><span className="px-4 py-2 text-[16px] font-semibold text-[#999]">코스 후기</span></div>
            <div className="w-full max-w-[400px] rounded-[28px] border border-[#d4d4d4] bg-white px-7 py-12 shadow-[0_2px_6px_rgba(17,17,17,0.08)] sm:px-10 sm:py-8">
              <div className="text-center"><h1 className="text-[18px] font-bold leading-[1.4] tracking-[-0.45px] text-[#111111]">{hasEmptyGeneratedCourse ? "조건에 맞는 코스를 찾지 못했어요" : "아직 코스가 없어요"}</h1><p className="mt-6 text-[16px] leading-[1.4] tracking-[-0.4px] text-[#111111]">{hasEmptyGeneratedCourse ? <>선택한 출발지 주변에 추천 장소가 없어요.<br />출발지나 이동 방식을 바꿔 다시 추천받아 보세요.</> : <>여행시간, 감성을 선택하면<br />나에게 맞는 하루 코스를 만들어드려요!</>}</p></div>
              <div className="mt-10 flex flex-col items-center"><Button asChild className="h-12 w-full rounded-[16px] bg-[#ff1f4c] px-5 text-[16px] font-bold tracking-[-0.4px] text-white shadow-[0_2px_6px_rgba(17,17,17,0.08)] hover:bg-[#eb1b47]"><Link href={hasEmptyGeneratedCourse ? "/course/create?step=4" : "/course/create?step=1"}><Plus className="mr-1 h-5 w-5" strokeWidth={2.4} />{hasEmptyGeneratedCourse ? "출발지 다시 선택하기" : "코스 만들기"}</Link></Button><p className="mt-4 text-center text-[14px] leading-[1.4] tracking-[-0.35px] text-[#767676]">코스 생성 후, 지도 위에 추천코스가 표기됩니다.</p></div>
            </div>
          </div>
        </div>
      </section>
    </MainShell>
  );
}

function StampControl({ eligibility, onReceiveStamp, onRequestLocation, pending }: { eligibility: StampEligibilityDto | null; onReceiveStamp: () => void; onRequestLocation: () => void; pending: boolean }) {
  const state = eligibility?.state;
  const enabled = state === "ELIGIBLE" || state === "REVIEWER";
  const label = state === "ALREADY_STAMPED" ? "스탬프 받기 (완료)" : state === "NO_LOCATION" ? "위치 권한 허용하기" : pending ? "스탬프 수령 중..." : "스탬프 받기";
  const reason = eligibility?.reason ?? (state === "NO_LOCATION" ? "위치 권한을 허용하면 스탬프 수령 가능 여부를 확인할 수 있어요." : state === "TOO_FAR" ? "현재 위치가 장소에서 2km 이상 떨어져 있어요." : state === "REVIEWER" ? "심사자 계정은 위치 권한 없이 스탬프를 받을 수 있어요." : "");
  const disabled = (!enabled && state !== "NO_LOCATION") || pending;
  return <div className="mt-4 rounded-xl border border-[#e5e5ec] p-3"><p className="text-[14px] font-bold text-[#111]">포토 스탬프</p>{reason ? <p className="mt-1 text-[12px] text-[#666]">{reason}</p> : null}<button className={`mt-3 h-9 w-full rounded-lg text-[13px] font-bold text-white ${enabled || state === "NO_LOCATION" ? state === "REVIEWER" ? "bg-[#b649f2]" : "bg-[#ff1f4c]" : "bg-[#a9a9a9]"}`} disabled={disabled} onClick={state === "NO_LOCATION" ? onRequestLocation : onReceiveStamp} type="button">{label}</button></div>;
}

function PlaceOverlay({ place, onClose, eligibility, onReceiveStamp, onRequestLocation, stampPending }: { place: CourseMapPlace; onClose: () => void; eligibility: StampEligibilityDto | null; onReceiveStamp: () => void; onRequestLocation: () => void; stampPending: boolean }) {
  return (
    <>
      <div className="absolute left-4 top-4 z-20 hidden xl:block">
        <div className="overflow-hidden rounded-[16px] border border-[#e5e5ec] bg-white shadow-[0px_2px_6px_rgba(17,17,17,0.08)]">
          <div className="flex h-[calc(100vh-112px)] min-h-[720px] w-[350px] flex-col">
            <div className="flex items-center justify-between px-4 py-4"><button className="text-[#111111]" onClick={onClose} type="button"><ChevronLeft className="h-6 w-6" strokeWidth={1.9} /></button><button className="text-[#111111]" onClick={onClose} type="button"><X className="h-6 w-6" strokeWidth={1.9} /></button></div>
            <div className="border-b border-[#e5e5ec] px-4 pb-4">
              <div className="flex h-[224px] items-center justify-center overflow-hidden rounded-[2px] bg-[#f5f5f5] text-[14px] text-[#767676]">{place.image ? <img alt={place.name} className="h-full w-full object-cover" src={place.image} /> : "이미지 준비 중"}</div>
              <div className="mt-3"><h3 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111111]">{place.name}</h3><div className="mt-1 flex flex-wrap items-center gap-2 text-[16px] tracking-[-0.4px] text-[#111111]">{place.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
              <div className="mt-3 space-y-1 text-[16px] leading-[1.4] tracking-[-0.4px] text-[#111111]"><p>{place.address}</p><div className="flex flex-wrap items-center gap-1"><span className="font-bold">{place.status}</span><span>{place.hours}</span><ChevronDown className="h-3 w-3" strokeWidth={2} /></div><div className="flex items-center gap-1"><span className="font-bold">혼잡도</span><span className={`font-bold ${place.congestionTone}`}>{place.congestion}</span></div></div>
              <StampControl eligibility={eligibility} onReceiveStamp={onReceiveStamp} onRequestLocation={onRequestLocation} pending={stampPending} />
            </div>
            <div className="flex-1 bg-white" />
          </div>
        </div>
        <button className="absolute left-[350px] top-[420px] flex h-[60px] w-10 items-center justify-center rounded-br-[16px] rounded-tr-[16px] border border-[#e5e5ec] border-l-0 bg-white shadow-[0px_2px_6px_rgba(17,17,17,0.08)]" onClick={onClose} type="button"><ChevronLeft className="h-6 w-6 text-[#111111]" strokeWidth={1.9} /></button>
      </div>
      <div className="absolute inset-x-4 top-4 z-20 xl:hidden"><div className="overflow-hidden rounded-[16px] border border-[#e5e5ec] bg-white shadow-[0px_2px_6px_rgba(17,17,17,0.08)]"><div className="flex items-center justify-between px-4 py-3"><button className="text-[#111111]" onClick={onClose} type="button"><ChevronLeft className="h-5 w-5" strokeWidth={1.9} /></button><button className="text-[#111111]" onClick={onClose} type="button"><X className="h-5 w-5" strokeWidth={1.9} /></button></div><div className="border-t border-[#f2f2f4] px-4 pb-4 pt-1"><p className="text-[20px] font-bold tracking-[-0.5px] text-[#111111]">{place.name}</p><p className="mt-1 text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111111]">{place.address}</p><StampControl eligibility={eligibility} onReceiveStamp={onReceiveStamp} onRequestLocation={onRequestLocation} pending={stampPending} /></div></div></div>
    </>
  );
}

function ConfirmModal({ title, description, confirmLabel, onConfirm, onClose }: { title: string; description: string; confirmLabel: string; onConfirm: () => void; onClose: () => void }) {
  return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 px-4 backdrop-blur-sm" onClick={onClose}><section aria-modal="true" className="w-full max-w-[360px] rounded-2xl bg-white p-7 text-center shadow-xl" onClick={(event) => event.stopPropagation()} role="dialog"><h2 className="text-[18px] font-bold text-[#111]">{title}</h2><p className="mt-3 text-[14px] leading-5 text-[#555]">{description}</p><div className="mt-6 flex gap-2"><button className="h-10 flex-1 rounded-lg border border-[#e5e5ec] text-[14px]" onClick={onClose} type="button">아니요</button><button className="h-10 flex-1 rounded-lg bg-[#ff1f4c] text-[14px] font-bold text-white" onClick={onConfirm} type="button">{confirmLabel}</button></div></section></div>;
}
