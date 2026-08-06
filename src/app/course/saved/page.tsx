"use client";

import Link from "next/link";
import { MainShell } from "@/components/layout/MainShell";
import { BreadcrumbTrail, RouteMapMock, SectionPanel, StatPill, TimelineList } from "@/components/mock-pages/MockPageShared";
import { Button } from "@/components/ui/Button";
import { currentCourse, recommendedCourseTags, savedCourses } from "@/lib/mock-data";

const courseDetailStops = [
  {
    name: "강릉역",
    time: "10:30",
    category: "여행 시작",
    congestion: null,
    move: null,
    active: true,
  },
  {
    name: "오죽헌",
    time: "11:00",
    category: "레트로 · 문화존",
    congestion: "혼잡도 보통",
    move: "도보 15분",
    active: false,
  },
  {
    name: "중앙시장",
    time: "12:30",
    category: "맛집 · 시장",
    congestion: "혼잡도 여유",
    move: "버스 10분",
    active: false,
  },
  {
    name: "안목해변 커피거리",
    time: "14:00",
    category: "바다 감성",
    congestion: "혼잡도 낮음",
    move: "도보 20분",
    active: false,
  },
  {
    name: "주문진 등대",
    time: "16:00",
    category: "포토존",
    congestion: "혼잡도 여유",
    move: "버스 25분",
    active: false,
  },
  {
    name: "숙소 체크인",
    time: "18:00",
    category: "코스 종료",
    congestion: null,
    move: null,
    active: false,
    done: true,
  },
];

const courseDetailPlaces = ["오죽헌", "중앙시장", "안목해변 커피거리", "주문진 등대"];

export default function SavedCoursePage() {
  const upcomingCourse = savedCourses[0];
  const timelineItems = courseDetailStops.map((stop, index) => ({
    ...stop,
    href: !stop.done ? `/records/${index + 1}` : undefined,
  }));

  return (
    <MainShell>
      <div className="bg-white">
        <section className="border-b border-[#ece2d6] bg-[#fffcf7]">
          <div className="mx-auto max-w-[1240px] px-4 py-10 lg:px-0">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Link
                    className="inline-flex items-center gap-2 text-[17px] font-semibold tracking-[-0.4px] text-slate-600 transition hover:text-slate-900"
                    href="/course/result"
                    >
                      <span aria-hidden="true">‹</span>
                      <span>코스 결과로</span>
                    </Link>
                    <BreadcrumbTrail items={[{ label: "추천 코스", href: "/course/result" }, { label: "코스 상세" }]} />
                  </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 items-center rounded-full bg-[#f30031] px-4 text-[18px] font-bold tracking-[-0.45px] text-white">
                    {upcomingCourse.dday}
                  </span>
                  <span className="text-[18px] font-semibold tracking-[-0.45px] text-slate-500">2026.06.21 토요일</span>
                </div>

                <div className="space-y-2">
                  <h1 className="text-[48px] font-extrabold tracking-[-1.1px] text-slate-900">바다 감성 강릉 하루 코스</h1>
                  <p className="text-[22px] tracking-[-0.55px] text-slate-600">강릉역 출발 · 10:30 시작 · 혼자 · 조용히 쉬기</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <StatPill icon="◔" label="총 이동 1시간 10분" />
                  <StatPill icon="◉" label="혼잡도 낮음" tone="positive" />
                  <StatPill icon="⌖" label="도보 2.8km" />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  className="h-12 rounded-[14px] border border-[#e8dfd3] bg-white px-6 text-[18px] font-semibold text-slate-900 hover:bg-[#faf6ef]"
                  variant="outline"
                >
                  수정
                </Button>
                <Button
                  className="h-12 rounded-[14px] border border-[#e8dfd3] bg-white px-6 text-[18px] font-semibold text-slate-900 hover:bg-[#faf6ef]"
                  variant="outline"
                >
                  다시 추천
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-4 py-8 lg:px-0">
          <div className="grid gap-8 xl:grid-cols-[1.04fr_0.96fr]">
            <RouteMapMock
              actionLabel="길찾기 시작"
              summaryLines={
                <>
                  강릉역 → 오죽헌 → 중앙시장
                  <br />→ 안목해변 → 주문진 등대
                </>
              }
            />

            <TimelineList items={timelineItems} title="일정표" titleClassName="text-[42px] font-extrabold tracking-[-0.95px]" />
          </div>

          <SectionPanel className="mt-6 rounded-[26px] shadow-[0_10px_30px_rgba(17,17,17,0.04)]" contentClassName="p-6">
              <h2 className="text-[40px] font-extrabold tracking-[-0.9px] text-slate-900">코스 상세</h2>

              <div className="mt-6 flex flex-wrap gap-4">
                {courseDetailPlaces.map((place) => (
                  <Link
                    key={place}
                    className="inline-flex h-16 items-center rounded-[18px] border border-[#e8dfd3] bg-white px-7 text-[20px] font-bold tracking-[-0.45px] text-slate-800 transition hover:bg-[#fffcf7]"
                    href="/records"
                  >
                    {place}
                  </Link>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {recommendedCourseTags.map((tag) => (
                  <span key={tag} className="inline-flex rounded-full bg-[#f6f1e8] px-4 py-2 text-[14px] font-semibold tracking-[-0.3px] text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 rounded-[20px] border border-[#efe6d8] bg-[#fffcf7] px-5 py-5">
                <p className="text-[18px] leading-[1.7] tracking-[-0.35px] text-slate-700">{currentCourse.summary}</p>
              </div>
          </SectionPanel>
        </section>
      </div>
    </MainShell>
  );
}
