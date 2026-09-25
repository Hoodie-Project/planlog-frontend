"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAccommodation, listAccommodations, type AccommodationDetailDto, type AccommodationDto } from "@/api/platform";
import { createSavedCourse, replaceSavedCourseItem } from "@/api/saved-courses";
import { CourseMapLayout } from "@/components/course-result/CourseMapLayout";
import { useAuthStore } from "@/store/auth-store";
import { useCourseStore } from "@/store/course-store";

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

function stayMarkerHtml(selected: boolean, hasSelection: boolean) {
  const size = selected ? 48 : 36;
  const color = selected || !hasSelection ? "#ff1f4c" : "#ff96ab";

  return `<div style="width:${size}px;height:${size}px;border-radius:999px;background:${color};display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(255,31,76,.28)"><svg aria-hidden="true" width="${Math.round(size * 0.58)}" height="${Math.round(size * 0.58)}" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.4697 9.84076C17.7626 9.54787 18.2374 9.54787 18.5303 9.84076L27.2197 18.5301C27.5126 18.823 27.9874 18.823 28.2803 18.5301C28.5732 18.2372 28.5732 17.7623 28.2803 17.4694L19.591 8.7801C18.7123 7.90142 17.2877 7.90142 16.409 8.7801L7.71967 17.4694C7.42678 17.7623 7.42678 18.2372 7.71967 18.5301C8.01256 18.823 8.48744 18.823 8.78033 18.5301L17.4697 9.84076Z" fill="white"/><path d="M18 11.4318L26.159 19.5908C26.1887 19.6205 26.2191 19.6492 26.25 19.6769V25.8748C26.25 26.9103 25.4105 27.7498 24.375 27.7498H21C20.5858 27.7498 20.25 27.414 20.25 26.9998V22.4998C20.25 22.0856 19.9142 21.7498 19.5 21.7498H16.5C16.0858 21.7498 15.75 22.0856 15.75 22.4998V26.9998C15.75 27.414 15.4142 27.7498 15 27.7498H11.625C10.5895 27.7498 9.75 26.9103 9.75 25.8748V19.6769C9.78093 19.6492 9.81127 19.6205 9.84099 19.5908L18 11.4318Z" fill="white"/></svg></div>`;
}

function availabilityLabel(value?: boolean | null) {
  if (value === true) return "가능";
  if (value === false) return "불가";
  return null;
}

function StayDetailPanel({ detail, detailError, isLoading, stay, onClose, onSelect }: { detail: AccommodationDetailDto | null; detailError: string | null; isLoading: boolean; stay: AccommodationDto; onClose: () => void; onSelect: () => void }) {
  const accommodation = detail ?? stay;
  const image = secureImageUrl(accommodation.image);
  const homepage = detail?.homepage ?? detail?.reservationUrl;
  const checkinTime = detail?.checkinTime ?? detail?.checkin;
  const checkoutTime = detail?.checkoutTime ?? detail?.checkout;
  const parking = availabilityLabel(detail?.parkingAvailable ?? detail?.parking);
  const cooking = availabilityLabel(detail?.cookingAvailable ?? detail?.cooking);

  return <div className="absolute left-4 top-4 z-20 hidden xl:block">
    <section className="h-[calc(100vh-128px)] min-h-[650px] w-[350px] overflow-y-auto rounded-2xl border border-[#e5e5ec] bg-white shadow-[0px_2px_6px_rgba(17,17,17,0.08)]">
      <div className="flex items-center justify-between px-6 py-5"><ChevronLeft className="h-6 w-6" strokeWidth={1.8} /><button aria-label="숙소 상세 닫기" onClick={onClose} type="button"><X className="h-6 w-6" strokeWidth={1.8} /></button></div>
      <div className="px-6 pb-8">
        <h2 className="text-[24px] font-bold tracking-[-0.6px] text-[#111111]">{accommodation.title}</h2>
        <div className="mt-4 flex gap-2"><button className="h-9 rounded-full border border-[#ff1f4c] px-4 text-[14px] font-semibold text-[#111111]" onClick={onSelect} type="button">숙소 변경하기</button>{homepage ? <a className="inline-flex h-9 items-center rounded-full border border-[#ff1f4c] px-4 text-[14px] font-semibold text-[#111111]" href={homepage} rel="noreferrer" target="_blank">홈페이지</a> : image ? <a className="inline-flex h-9 items-center rounded-full border border-[#ff1f4c] px-4 text-[14px] font-semibold text-[#111111]" href={image} rel="noreferrer" target="_blank">이미지 보기</a> : null}</div>
        {isLoading ? <p className="mt-5 text-[13px] text-[#777]">숙소 상세 정보를 불러오는 중이에요.</p> : null}
        {detailError ? <p className="mt-5 text-[13px] text-[#f30031]">{detailError}</p> : null}
        <div className="mt-6 space-y-2 text-[14px] leading-[1.5] tracking-[-0.35px] text-[#505050]">
          <p>{accommodation.address ?? "주소 정보가 준비 중입니다."}</p>
          {accommodation.tel ? <p><strong className="text-[#111111]">연락처</strong> {accommodation.tel}</p> : null}
          <p><strong className="text-[#111111]">숙소 유형</strong> {stayTypeLabel(accommodation.stayType)}</p>
          {checkinTime ? <p><strong className="text-[#111111]">체크인</strong> {checkinTime}</p> : null}
          {checkoutTime ? <p><strong className="text-[#111111]">체크아웃</strong> {checkoutTime}</p> : null}
          {detail?.roomCount != null ? <p><strong className="text-[#111111]">객실 수</strong> {detail.roomCount}실</p> : null}
          {parking ? <p className={parking === "불가" ? "text-[#f30031]" : undefined}><strong className="text-[#111111]">주차</strong> {parking}</p> : null}
          {cooking ? <p><strong className="text-[#111111]">취사</strong> {cooking}</p> : null}
          {detail?.facilities?.length ? <p><strong className="text-[#111111]">부대시설</strong> {detail.facilities.join(" · ")}</p> : null}
          {detail?.overview ? <p className="pt-1 text-[#777]">{detail.overview}</p> : null}
        </div>
        {image ? <img alt={accommodation.title} className="mt-6 h-[238px] w-full rounded-[2px] object-cover" src={image} /> : <div className="mt-6 flex h-[238px] items-center justify-center rounded-[2px] bg-[#f7f7fa] text-[14px] text-[#777]">숙소 이미지 없음</div>}
      </div>
    </section>
  </div>;
}

export default function CourseStayPage() {
  const generatedCourse = useCourseStore((state) => state.generatedCourse);
  const setGeneratedCourse = useCourseStore((state) => state.setGeneratedCourse);
  const activeSavedCourseId = useCourseStore((state) => state.activeSavedCourseId);
  const setActiveSavedCourseId = useCourseStore((state) => state.setActiveSavedCourseId);
  const accessToken = useAuthStore((state) => state.accessToken);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  const router = useRouter();
  const [stays, setStays] = useState<AccommodationDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStayId, setSelectedStayId] = useState<string | null>(null);
  const [selectedStayDetail, setSelectedStayDetail] = useState<AccommodationDetailDto | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [selectionStep, setSelectionStep] = useState<"confirm" | null>(null);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [isChangingStay, setIsChangingStay] = useState(false);

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
  const currentStayItem = useMemo(
    () => generatedCourse?.days.flatMap((day) => day.items.map((item) => ({ day: day.day, item }))).find(({ item }) => item.type === "STAY") ?? null,
    [generatedCourse]
  );

  useEffect(() => {
    let isActive = true;

    if (!selectedStay) {
      setSelectedStayDetail(null);
      setDetailError(null);
      setIsDetailLoading(false);
      return () => {
        isActive = false;
      };
    }

    const loadAccommodationDetail = async () => {
      setSelectedStayDetail(null);
      setDetailError(null);
      setIsDetailLoading(true);

      try {
        const detail = await getAccommodation(selectedStay.contentId);
        if (isActive) setSelectedStayDetail(detail);
      } catch {
        if (isActive) setDetailError("숙소 상세 정보를 불러오지 못했어요.");
      } finally {
        if (isActive) setIsDetailLoading(false);
      }
    };

    void loadAccommodationDetail();
    return () => {
      isActive = false;
    };
  }, [selectedStay]);
  const markers = useMemo(
    () => mappableStays.map((stay, index) => {
      const selected = stay.contentId === selectedStayId;

      return {
        id: index + 1,
        lat: Number(stay.mapY),
        lng: Number(stay.mapX),
        html: stayMarkerHtml(selected, Boolean(selectedStayId)),
        anchor: selected ? 24 : 18,
      };
    }),
    [mappableStays, selectedStayId]
  );

  const selectStayByMarkerId = (markerId: number) => {
    const stay = mappableStays[markerId - 1];
    if (stay) setSelectedStayId(stay.contentId);
  };

  const openStayConfirmation = () => {
    if (!accessToken) {
      openLoginModal("protected-route");
      return;
    }
    if (!selectedStay) return;
    setSelectionError(null);
    setSelectionStep("confirm");
  };

  const changeStayInCourse = async () => {
    if (!accessToken || !selectedStay || !generatedCourse || isChangingStay) return;
    if (!selectedStay.mapX || !selectedStay.mapY) {
      setSelectionError("이 숙소의 지도 좌표 정보가 없어 변경할 수 없어요.");
      return;
    }
    if (!currentStayItem) {
      setSelectionError("변경할 숙소가 아직 코스에 없어요. 1박 2일 코스를 먼저 생성해 주세요.");
      return;
    }

    try {
      setIsChangingStay(true);
      const courseId = activeSavedCourseId ?? (await createSavedCourse(accessToken, generatedCourse)).id;
      const updatedCourse = await replaceSavedCourseItem(accessToken, courseId, {
        day: currentStayItem.day,
        order: currentStayItem.item.order,
        type: "STAY",
        contentId: selectedStay.contentId,
        title: selectedStay.title,
        mapX: selectedStay.mapX,
        mapY: selectedStay.mapY,
        address: selectedStay.address ?? undefined,
        image: selectedStay.image ?? undefined,
        zone: generatedCourse.zone,
      });
      setGeneratedCourse(updatedCourse.payload);
      setActiveSavedCourseId(updatedCourse.id);
      router.push("/course/result");
    } catch (requestError) {
      setSelectionError(requestError instanceof Error ? requestError.message : "숙소를 변경하지 못했어요.");
    } finally {
      setIsChangingStay(false);
    }
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

  return <>
    <CourseMapLayout center={center} focus={selectedStay ? { lat: Number(selectedStay.mapY), lng: Number(selectedStay.mapX) } : center} mapOverlay={selectedStay ? <StayDetailPanel detail={selectedStayDetail} detailError={detailError} isLoading={isDetailLoading} onClose={() => setSelectedStayId(null)} onSelect={openStayConfirmation} stay={selectedStay} /> : null} markers={markers} mobileSummary={<div><h2 className="text-[20px] font-bold tracking-[-0.5px] text-[#111111]">추천 숙소</h2><p className="mt-2 text-[14px] leading-[1.4] tracking-[-0.35px] text-[#505050]">{isLoading ? "추천 숙소를 불러오는 중이에요." : "코스와 가까운 숙소를 확인해 보세요!"}</p></div>} onMarkerClick={selectStayByMarkerId} panel={content} />
    {selectionStep === "confirm" ? <StaySelectionConfirm error={selectionError} isSubmitting={isChangingStay} onCancel={() => setSelectionStep(null)} onConfirm={changeStayInCourse} /> : null}
  </>;
}

function StaySelectionConfirm({ error, isSubmitting, onCancel, onConfirm }: { error: string | null; isSubmitting: boolean; onCancel: () => void; onConfirm: () => void }) {
  return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 px-4 backdrop-blur-[5px]" onClick={onCancel}><section aria-modal="true" className="w-full max-w-[390px] rounded-2xl bg-white px-10 py-9 text-center shadow-xl" onClick={(event) => event.stopPropagation()} role="dialog"><h2 className="text-[18px] font-bold tracking-[-0.45px] text-[#111111]">숙소를 변경하시나요?</h2><p className="mt-3 text-[14px] tracking-[-0.35px] text-[#505050]">현재 코스 내 숙소가 선택한 숙소로 변경됩니다.</p>{error ? <p className="mt-3 text-[13px] text-[#f30031]">{error}</p> : null}<div className="mt-6 flex gap-3"><button className="h-12 flex-1 rounded-2xl border border-[#d4d4d4] text-[15px] font-semibold" disabled={isSubmitting} onClick={onCancel} type="button">아니요</button><button className="h-12 flex-1 rounded-2xl bg-[#ff1f4c] text-[15px] font-semibold text-white disabled:bg-[#a9a9a9]" disabled={isSubmitting} onClick={onConfirm} type="button">{isSubmitting ? "변경 중..." : "네, 변경할게요"}</button></div></section></div>;
}
