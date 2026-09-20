"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { listAccommodations, type AccommodationDto } from "@/api/platform";
import { CourseMapLayout } from "@/components/course-result/CourseMapLayout";
import { useCourseStore } from "@/store/course-store";
import houseNormalIcon from "@/asset/svgs/house-normal.svg";

const defaultCenter = { lat: 37.7642, lng: 128.8989 };

function stayTypeLabel(stayType: AccommodationDto["stayType"]) {
  if (stayType === "HEALING") return "힐링";
  if (stayType === "SOCIAL") return "함께하는 여행";
  return "가성비";
}

function secureImageUrl(image?: string | null) {
  return image?.replace(/^http:/, "https:") ?? null;
}

function AccommodationImage({ stay }: { stay: AccommodationDto }) {
  const [imageAvailable, setImageAvailable] = useState(Boolean(stay.image));
  const image = secureImageUrl(stay.image);

  useEffect(() => {
    setImageAvailable(Boolean(stay.image));
  }, [stay.image]);

  if (!image || !imageAvailable) {
    return <div className="flex h-[100px] w-[133px] shrink-0 items-center justify-center rounded-[8px] bg-[#f7f7fa] px-3 text-center text-[12px] font-medium text-[#777]">숙소 이미지 없음</div>;
  }

  return <img alt={stay.title} className="h-[100px] w-[133px] shrink-0 rounded-[8px] object-cover" onError={() => setImageAvailable(false)} src={image} />;
}

function stayMarkerHtml(selected: boolean) {
  const size = selected ? 48 : 36;
  const color = selected ? "#ff1f4c" : "#ff96ab";

  return `<div style="width:${size}px;height:${size}px;background:${color};-webkit-mask:url('${houseNormalIcon.src}') center/contain no-repeat;mask:url('${houseNormalIcon.src}') center/contain no-repeat;"></div>`;
}

function StayDetailPanel({ stay, onClose }: { stay: AccommodationDto; onClose: () => void }) {
  const image = secureImageUrl(stay.image);

  return <div className="absolute left-4 top-4 z-20 hidden xl:block">
    <section className="h-[calc(100vh-128px)] min-h-[650px] w-[350px] overflow-y-auto rounded-2xl border border-[#e5e5ec] bg-white shadow-[0px_2px_6px_rgba(17,17,17,0.08)]">
      <div className="flex items-center justify-between px-6 py-5"><ChevronLeft className="h-6 w-6" strokeWidth={1.8} /><button aria-label="숙소 상세 닫기" onClick={onClose} type="button"><X className="h-6 w-6" strokeWidth={1.8} /></button></div>
      <div className="px-6 pb-8">
        <h2 className="text-[24px] font-bold tracking-[-0.6px] text-[#111111]">{stay.title}</h2>
        <div className="mt-4 flex gap-2"><button className="h-9 rounded-full border border-[#ff1f4c] px-4 text-[14px] font-semibold text-[#111111]" type="button">숙소 선택하기</button><a className="inline-flex h-9 items-center rounded-full border border-[#ff1f4c] px-4 text-[14px] font-semibold text-[#111111]" href={image ?? undefined} rel="noreferrer" target="_blank">이미지 보기</a></div>
        <div className="mt-6 space-y-2 text-[14px] leading-[1.5] tracking-[-0.35px] text-[#505050]"><p>{stay.address ?? "주소 정보가 준비 중입니다."}</p>{stay.tel ? <p><strong className="text-[#111111]">연락처</strong> {stay.tel}</p> : null}<p><strong className="text-[#111111]">숙소 유형</strong> {stayTypeLabel(stay.stayType)}</p></div>
        {image ? <img alt={stay.title} className="mt-6 h-[238px] w-full rounded-[2px] object-cover" src={image} /> : <div className="mt-6 flex h-[238px] items-center justify-center rounded-[2px] bg-[#f7f7fa] text-[14px] text-[#777]">숙소 이미지 없음</div>}
      </div>
    </section>
  </div>;
}

export default function CourseStayPage() {
  const generatedCourse = useCourseStore((state) => state.generatedCourse);
  const [stays, setStays] = useState<AccommodationDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStayId, setSelectedStayId] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadAccommodations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await listAccommodations(generatedCourse?.zone ? { zone: generatedCourse.zone } : {});
        if (isActive) setStays(response);
      } catch {
        if (isActive) {
          setStays([]);
          setError("추천 숙소를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadAccommodations();
    return () => {
      isActive = false;
    };
  }, [generatedCourse?.zone]);

  const mappableStays = useMemo(
    () => stays.filter((stay) => Number.isFinite(Number(stay.mapX)) && Number.isFinite(Number(stay.mapY))),
    [stays]
  );
  const center = mappableStays[0] ? { lat: Number(mappableStays[0].mapY), lng: Number(mappableStays[0].mapX) } : defaultCenter;
  const selectedStay = stays.find((stay) => stay.contentId === selectedStayId) ?? null;
  const markers = mappableStays.slice(0, 30).map((stay, index) => {
    const selected = stay.contentId === selectedStayId;

    return {
    id: index + 1,
    lat: Number(stay.mapY),
    lng: Number(stay.mapX),
    html: stayMarkerHtml(selected),
    anchor: selected ? 24 : 18,
  };
  });

  const selectStayByMarkerId = (markerId: number) => {
    const stay = mappableStays.slice(0, 30)[markerId - 1];
    if (stay) setSelectedStayId(stay.contentId);
  };

  const content = (
    <div className="flex h-full flex-col gap-6 overflow-y-auto px-5 pb-10 pt-6">
      <div>
        <h1 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111111]">추천 숙소</h1>
        <p className="mt-1 text-[16px] leading-[1.4] tracking-[-0.4px] text-[#111111]">{generatedCourse ? `${generatedCourse.zoneLabel} 코스와 어울리는 숙소를 확인해 보세요!` : "코스와 가까운 숙소를 확인해 보세요!"}</p>
      </div>
      {isLoading ? <p className="py-10 text-center text-[14px] text-[#777]">추천 숙소를 불러오는 중이에요.</p> : null}
      {!isLoading && error ? <p className="py-10 text-center text-[14px] text-[#f30031]">{error}</p> : null}
      {!isLoading && !error && stays.length === 0 ? <p className="py-10 text-center text-[14px] text-[#777]">조건에 맞는 추천 숙소가 없어요.</p> : null}
      {!isLoading && !error && stays.length > 0 ? <div className="space-y-2">{stays.map((stay) => <button key={stay.contentId} className={`flex w-[300px] items-start gap-3 rounded-2xl border bg-white p-5 text-left shadow-[0px_2px_6px_rgba(17,17,17,0.08)] transition hover:-translate-y-[1px] ${selectedStayId === stay.contentId ? "border-[#ff1f4c]" : "border-[#f1f1f5]"}`} onClick={() => setSelectedStayId(stay.contentId)} type="button"><AccommodationImage stay={stay} /><div className="min-w-0 flex-1"><p className="truncate text-[14px] font-semibold leading-[1.4] text-[#111111]">{stay.title}</p><div className="mt-1 flex flex-wrap items-center gap-1 text-[12px] font-semibold leading-[1.4] tracking-[-0.3px] text-[#505050]"><span>{stayTypeLabel(stay.stayType)}</span>{stay.address ? <span className="line-clamp-2">· {stay.address}</span> : null}</div><div className="mt-5 inline-flex items-center text-[12px] font-semibold leading-[1.4] tracking-[-0.3px] text-[#505050]">숙소 정보 확인하기<ChevronRight className="h-3 w-3" strokeWidth={2} /></div></div></button>)}</div> : null}
    </div>
  );

  return <CourseMapLayout center={center} mapOverlay={selectedStay ? <StayDetailPanel onClose={() => setSelectedStayId(null)} stay={selectedStay} /> : null} markers={markers} mobileSummary={<div><h2 className="text-[20px] font-bold tracking-[-0.5px] text-[#111111]">추천 숙소</h2><p className="mt-2 text-[14px] leading-[1.4] tracking-[-0.35px] text-[#505050]">{isLoading ? "추천 숙소를 불러오는 중이에요." : "코스와 가까운 숙소를 확인해 보세요!"}</p></div>} onMarkerClick={selectStayByMarkerId} panel={content} />;
}
