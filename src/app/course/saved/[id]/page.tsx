"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, MapPin } from "lucide-react";
import coffeeIcon from "@/asset/svgs/coffee.svg";
import completedStampIcon from "@/asset/svgs/completed-stamp.svg";
import mountainStampIcon from "@/asset/svgs/completed-stamp-mountain.svg";
import natureStampIcon from "@/asset/svgs/completed-stamp-nature.svg";
import photoCameraIcon from "@/asset/svgs/photo-camera.svg";
import { getSavedCourse } from "@/api/saved-courses";
import { listStamps, type StampDto } from "@/api/stamps";
import { MainShell } from "@/components/layout/MainShell";
import { StampReviewModal } from "@/components/review/StampReviewModal";
import { useAuthStore } from "@/store/auth-store";
import type { CourseZone, SavedCourseDto } from "@/types/course";

const stampStyle: Record<CourseZone, { background: string; color: string; icon: string }> = {
  SEA: { background: "#e8ecff", color: "#5874ff", icon: completedStampIcon.src },
  SNOW: { background: "#efdff7", color: "#c548ff", icon: mountainStampIcon.src },
  VALLEY: { background: "#d5f0e3", color: "#58cf48", icon: natureStampIcon.src },
  RETRO: { background: "#fff0df", color: "#ffa448", icon: coffeeIcon.src },
  PHOTO: { background: "#ffdfdf", color: "#ff5858", icon: photoCameraIcon.src },
};

function formatDate(value: string) {
  const date = new Date(value);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function spotCountOf(course: SavedCourseDto) {
  return course.payload.days.reduce((count, day) => count + day.items.filter((item) => item.type === "SPOT").length, 0);
}

export default function SavedCourseDetailPage() {
  const params = useParams<{ id: string }>();
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);
  const [course, setCourse] = useState<SavedCourseDto | null>(null);
  const [stamps, setStamps] = useState<StampDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedStampId, setSelectedStampId] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated || !accessToken || !params.id) return;

    Promise.all([getSavedCourse(accessToken, params.id), listStamps(accessToken)])
      .then(([savedCourse, collectedStamps]) => {
        setCourse(savedCourse);
        setStamps(collectedStamps);
      })
      .catch(() => setError("저장한 코스 상세를 불러오지 못했습니다."));
  }, [accessToken, hydrated, params.id]);

  const completedStamps = useMemo(() => {
    if (!course) return [];
    const coursePlaceIds = new Set(course.payload.days.flatMap((day) => day.items.map((item) => item.contentId)));
    return stamps.filter((stamp) => coursePlaceIds.has(stamp.contentId));
  }, [course, stamps]);
  const selectedStamp = completedStamps.find((stamp) => stamp.id === selectedStampId) ?? null;

  return (
    <MainShell>
      <main className="mx-auto w-full max-w-[432px] px-4 py-[30px] lg:px-0">
        <nav aria-label="현재 위치" className="flex items-center gap-1 text-[14px] tracking-[-0.35px]">
          <Link className="text-[#767676]" href="/records">나의 기록</Link><ChevronRight className="h-4 w-4 text-[#767676]" />
          <Link className="text-[#767676]" href="/course/saved">저장한 코스</Link><ChevronRight className="h-4 w-4 text-[#767676]" />
          <span className="font-semibold text-[#111111]">저장한 코스 상세</span>
        </nav>

        {error ? <p className="mt-8 text-[14px] text-[#f30031]">{error}</p> : null}
        {!error && !course ? <p className="mt-8 text-[14px] text-[#767676]">불러오는 중...</p> : null}

        {course ? <>
          <section className="mt-6">
            <h1 className="text-[24px] font-bold tracking-[-0.6px] text-[#111111]">여행 요약</h1>
            <p className="mt-1 text-[14px] tracking-[-0.35px] text-[#505050]">여행에서 남긴 코스와 스탬프를 모아 볼 수 있어요.</p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <SummaryCard label="방문 장소" value={`${spotCountOf(course)}곳`} />
              <SummaryCard label="획득 스탬프" value={`${course.stampProgress.earned}개`} />
              <SummaryCard label="총 이동거리" value={`${(course.payload.totalDistance / 1000).toFixed(1)}km`} />
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-[18px] font-bold tracking-[-0.45px] text-[#111111]">저장한 코스</h2>
            <article className="mt-3 rounded-2xl border border-[#f1f1f5] p-5 shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)]">
              <div className="flex items-center gap-2 text-[12px] text-[#505050]"><span className="rounded-full bg-[#f6f6f6] px-2 py-1">{course.status === "COMPLETED" ? "완료" : course.status === "IN_PROGRESS" ? "진행중" : "대기중"}</span><span>{formatDate(course.travelDate ?? course.createdAt)}</span></div>
              <h3 className="mt-3 text-[18px] font-bold tracking-[-0.45px] text-[#111111]">{course.title}</h3>
              <p className="mt-1 text-[14px] text-[#505050]">{course.payload.summary}</p>
              <ul className="mt-4 space-y-2 text-[14px] text-[#111111]">
                {course.payload.days.flatMap((day) => day.items).filter((item) => item.type === "SPOT").map((item) => (
                  <li key={`${item.contentId}-${item.order}`} className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#ff1f4c]" fill="currentColor" />{item.title}</li>
                ))}
              </ul>
            </article>
          </section>

          <section className="mt-10">
            <h2 className="text-[18px] font-bold tracking-[-0.45px] text-[#111111]">완료한 스탬프</h2>
            {completedStamps.length ? <div className="mt-3 grid grid-cols-3 gap-[6px]">
              {completedStamps.map((stamp) => {
                const style = stampStyle[stamp.zone];
                return <button key={stamp.id} className="overflow-hidden rounded-lg bg-white text-left shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)]" onClick={() => setSelectedStampId(stamp.id)} type="button">
                  <div className="flex h-[84px] items-center justify-center" style={{ backgroundColor: style.background }}><img alt="" aria-hidden="true" className="h-[72px] w-[72px] object-contain" src={style.icon} /></div>
                  <div className="px-3 py-2"><p className="truncate text-[14px] font-semibold text-[#111111]">{stamp.title}</p><p className="mt-1 text-[12px] text-[#505050]">{formatDate(stamp.visitedAt)}</p></div>
                </button>;
              })}
            </div> : <p className="mt-3 rounded-2xl border border-[#f1f1f5] px-5 py-8 text-center text-[14px] text-[#767676]">이 코스에서 완료한 스탬프가 없어요.</p>}
          </section>
        </> : null}
      </main>
      {selectedStamp ? <StampReviewModal emotion={selectedStamp.mood ?? ""} mode="read" onClose={() => setSelectedStampId(null)} review="등록된 리뷰가 없어요." /> : null}
    </MainShell>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-[#f1f1f5] px-4 py-5 shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)]"><p className="text-[12px] text-[#505050]">{label}</p><p className="mt-3 text-[18px] font-bold text-[#ff1f4c]">{value}</p></div>;
}
