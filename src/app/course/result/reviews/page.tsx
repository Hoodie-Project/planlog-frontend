"use client";

import { useEffect, useMemo, useState } from "react";
import { getCourseReviews, type CourseReviewSummaryDto } from "@/api/platform";
import { CourseMapLayout } from "@/components/course-result/CourseMapLayout";
import { useCourseStore } from "@/store/course-store";

type MappableSpot = {
  id: number;
  contentId: string;
  title: string;
  lat: number;
  lng: number;
};

const fallbackCenter = { lat: 37.7519, lng: 128.8761 };

function markerHtml(id: number, selected: boolean) {
  const size = selected ? 48 : 36;
  return `<span style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:9999px;background:#ff1f4c;color:#fff;font-weight:700;font-size:${selected ? 22 : 20}px;line-height:1;box-shadow:0 8px 20px rgba(255,31,76,.28)">${id}</span>`;
}

function formatVisitedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${String(date.getFullYear()).slice(-2)}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function ReviewSidePanel({ summary, isLoading, error, selectedSpot, onClearSpot }: { summary: CourseReviewSummaryDto | null; isLoading: boolean; error: string | null; selectedSpot: MappableSpot | null; onClearSpot: () => void }) {
  const visibleReviews = selectedSpot && summary
    ? summary.reviews.filter((review) => review.contentId === selectedSpot.contentId)
    : summary?.reviews ?? [];

  return (
    <div className="flex h-full flex-col px-5 pb-8 pt-6">
      <div>
        <h1 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111111]">코스 후기</h1>
        <p className="mt-2 text-[14px] leading-[1.45] tracking-[-0.35px] text-[#505050]">추천 코스와 경로가 1곳 이상 겹친 후기를 모아 보여드려요.</p>
      </div>

      {isLoading ? <p className="py-10 text-center text-[14px] text-[#767676]">코스 후기를 불러오는 중이에요.</p> : null}
      {error ? <p className="py-10 text-center text-[14px] text-[#f30031]">{error}</p> : null}

      {!isLoading && !error && summary ? (
        <>
          <section className="mt-5 rounded-xl border border-[#d4d4d4] px-3 py-3">
            <h2 className="text-[14px] font-bold leading-[1.4] tracking-[-0.35px] text-[#111111]">가장 많이 남긴 분위기</h2>
            {summary.topMoods.length ? (
              <ol className="mt-2 space-y-1.5">
                {summary.topMoods.slice(0, 3).map((item, index) => (
                  <li className="flex items-center gap-1.5 text-[13px] leading-[1.4] text-[#111111]" key={item.mood}>
                    <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] font-semibold ${index === 0 ? "border-[#ff1f4c] text-[#ff1f4c]" : "border-[#d4d4d4] text-[#505050]"}`}>{index + 1}</span>
                    <span>{item.mood} ({item.count}건)</span>
                  </li>
                ))}
              </ol>
            ) : <p className="mt-2 text-[13px] text-[#767676]">아직 감정이 담긴 후기가 없어요.</p>}
          </section>

          <section className="mt-5 min-h-0 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e5e5ec] pb-3">
              <h2 className="text-[14px] font-bold tracking-[-0.35px] text-[#111111]">{selectedSpot ? `${selectedSpot.title} 후기` : "장소별 후기 보기"}</h2>
              <div className="flex items-center gap-2"><span className="text-[12px] text-[#505050]">총 {visibleReviews.length}개</span>{selectedSpot ? <button className="text-[12px] font-semibold text-[#ff1f4c]" onClick={onClearSpot} type="button">전체 보기</button> : null}</div>
            </div>
            {visibleReviews.length ? (
              <ul>
                {visibleReviews.map((review, index) => (
                  <li className="border-b border-[#f1f1f5] py-4" key={`${review.contentId}-${review.visitedAt}-${index}`}>
                    <div className="flex items-start justify-between gap-3"><h3 className="text-[14px] font-bold leading-[1.4] text-[#111111]">{review.title}</h3><time className="shrink-0 text-[12px] text-[#505050]">{formatVisitedAt(review.visitedAt)}</time></div>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-[1.5] tracking-[-0.3px] text-[#505050]">{review.note}</p>
                    <span className="mt-2 inline-flex rounded-[4px] bg-[#ff1f4c] px-1.5 py-1 text-[11px] font-semibold leading-none text-white">{review.mood}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="py-10 text-center text-[14px] text-[#767676]">{selectedSpot ? "이 장소에 등록된 후기가 없어요." : "이 코스에 등록된 후기가 없어요."}</p>}
          </section>
        </>
      ) : null}
    </div>
  );
}

export default function CourseReviewsPage() {
  const generatedCourse = useCourseStore((state) => state.generatedCourse);
  const [summary, setSummary] = useState<CourseReviewSummaryDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);

  const courseItems = useMemo(
    () => generatedCourse?.days.flatMap((day) => day.items) ?? [],
    [generatedCourse],
  );
  const spots = useMemo<MappableSpot[]>(() => {
    return courseItems.flatMap((item, index) => {
      const lat = Number(item.mapY);
      const lng = Number(item.mapX);
      return Number.isFinite(lat) && Number.isFinite(lng) ? [{ id: index + 1, contentId: item.contentId, title: item.title, lat, lng }] : [];
    });
  }, [courseItems]);
  const contentIds = useMemo(
    () => Array.from(new Set(courseItems.map((item) => item.contentId).filter(Boolean))),
    [courseItems],
  );

  useEffect(() => {
    let isActive = true;

    if (!contentIds.length) {
      setSummary({ totalCount: 0, topMoods: [], reviews: [] });
      setIsLoading(false);
      return () => {
        isActive = false;
      };
    }

    setIsLoading(true);
    setError(null);
    void getCourseReviews(contentIds)
      .then((response) => {
        if (isActive) setSummary(response);
      })
      .catch(() => {
        if (isActive) setError("코스 후기를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [contentIds]);

  const selectedSpot = spots.find((spot) => spot.contentId === selectedContentId) ?? null;
  const mapCenter = spots[0] ? { lat: spots[0].lat, lng: spots[0].lng } : fallbackCenter;
  const markers = spots.map((spot) => ({ id: spot.id, lat: spot.lat, lng: spot.lng, html: markerHtml(spot.id, spot.contentId === selectedContentId), anchor: spot.contentId === selectedContentId ? 24 : 18 }));
  const panel = <ReviewSidePanel error={error} isLoading={isLoading} onClearSpot={() => setSelectedContentId(null)} selectedSpot={selectedSpot} summary={summary} />;

  return <CourseMapLayout center={mapCenter} fitBounds={!selectedSpot && spots.length > 1} focus={selectedSpot ? { lat: selectedSpot.lat, lng: selectedSpot.lng } : null} markers={markers} mobileSummary={<div><h2 className="text-[20px] font-bold tracking-[-0.5px] text-[#111111]">코스 후기</h2><p className="mt-2 text-[14px] leading-[1.4] tracking-[-0.35px] text-[#505050]">총 {summary?.totalCount ?? 0}개의 후기를 확인해 보세요.</p></div>} onMarkerClick={(markerId) => setSelectedContentId(spots.find((spot) => spot.id === markerId)?.contentId ?? null)} panel={panel} path={spots.map(({ lat, lng }) => ({ lat, lng }))} />;
}
