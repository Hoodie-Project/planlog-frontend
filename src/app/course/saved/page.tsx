"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import coffeeIcon from "@/asset/svgs/coffee.svg";
import forestIcon from "@/asset/svgs/forest.svg";
import mountainFlagIcon from "@/asset/svgs/mountain-flag.svg";
import { MainShell } from "@/components/layout/MainShell";
import { Card, CardContent } from "@/components/ui/Card";
import { type SavedCourseStatus, useCourseStore } from "@/store/course-store";

const statusLabels: Record<SavedCourseStatus, string> = {
  WAITING: "대기중",
  IN_PROGRESS: "진행중",
  COMPLETED: "완료",
};

const statusTone: Record<SavedCourseStatus, string> = {
  WAITING: "bg-[#f6f6f6] text-[#454545]",
  IN_PROGRESS: "bg-[#d5f0e3] text-[#016110]",
  COMPLETED: "bg-[#ff1f4c] text-white",
};

const zoneIcon = {
  SEA: coffeeIcon.src,
  SNOW: mountainFlagIcon.src,
  VALLEY: forestIcon.src,
  RETRO: coffeeIcon.src,
  PHOTO: mountainFlagIcon.src,
} as const;

const statusOrder: SavedCourseStatus[] = ["WAITING", "IN_PROGRESS", "COMPLETED"];

export default function SavedCoursePage() {
  const savedCourses = useCourseStore((state) => state.savedCourses);
  const [selectedStatus, setSelectedStatus] = useState<SavedCourseStatus>("WAITING");

  const upcomingCourse = savedCourses.find((course) => course.status === "IN_PROGRESS") ?? savedCourses.find((course) => course.status === "WAITING");
  const filteredCourses = useMemo(() => savedCourses.filter((course) => course.status === selectedStatus), [savedCourses, selectedStatus]);

  return (
    <MainShell>
      <main className="mx-auto flex max-w-[1240px] justify-center px-4 py-[30px] lg:px-0">
        <div className="w-full max-w-[432px]">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[14px] leading-[1.4] tracking-[-0.35px]">
            <Link className="text-[#767676]" href="/records">나의 기록</Link>
            <ChevronRight className="h-4 w-4 text-[#767676]" strokeWidth={1.8} />
            <span className="font-semibold text-[#111111]">저장한 코스</span>
          </nav>
          <h1 className="mt-5 text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111111]">저장한 코스</h1>

          {upcomingCourse ? (
            <section className="mt-6">
              <p className="text-[16px] leading-[1.4] tracking-[-0.4px] text-[#111111]">다가오는 여행</p>
              <Link className="mt-4 block" href="/course/result">
                <Card className="rounded-2xl border-[#ff1f4c] shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)] transition-transform hover:-translate-y-[1px]">
                  <CardContent className="flex items-center gap-3 p-5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-[6px]">
                        <span className="inline-flex h-6 items-center rounded-full bg-[#ff1f4c] px-2 text-[12px] font-semibold leading-[1.4] tracking-[-0.3px] text-white">D-6</span>
                        <span className="text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111111]">{upcomingCourse.date}</span>
                      </div>
                      <p className="mt-2 pl-[2px] text-[18px] font-semibold leading-[1.4] tracking-[-0.45px] text-[#111111]">{upcomingCourse.title}</p>
                      <p className="mt-1 pl-[2px] text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111111]">장소 {upcomingCourse.spotCount}곳 · 코스 준비 완료</p>
                    </div>
                    <ChevronRight className="h-6 w-6 shrink-0 text-[#999999]" strokeWidth={1.8} />
                  </CardContent>
                </Card>
              </Link>
            </section>
          ) : null}

          <section className="mt-10">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[16px] leading-[1.4] tracking-[-0.4px] text-[#111111]">저장한 코스 목록</p>
              <div className="flex gap-1 text-[12px] leading-[1.4] tracking-[-0.3px]">
                {statusOrder.map((status) => (
                  <button
                    key={status}
                    className={`h-6 rounded-full px-2 ${selectedStatus === status ? "border border-[#ff1f4c] bg-[#ffeaee] font-semibold text-[#ff1f4c]" : "border border-[#e5e5ec] bg-white text-[#767676]"}`}
                    onClick={() => setSelectedStatus(status)}
                    type="button"
                  >
                    {statusLabels[status]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-[10px]">
              {filteredCourses.length ? filteredCourses.map((course) => (
                <Card key={course.id} className="rounded-2xl border-[#f1f1f5] shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)]">
                  <CardContent className="flex items-center justify-between gap-3 px-[19px] py-[19px]">
                    <Link className="flex min-w-0 flex-1 items-center gap-[14px]" href="/course/result">
                      <img alt="" aria-hidden="true" className="h-8 w-8 shrink-0 object-contain" src={zoneIcon[course.zone]} />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[14px] font-semibold leading-[1.4] text-[#111111]">{course.title}</p>
                          <span className="text-[12px] leading-[1.4] tracking-[-0.3px] text-[#111111]">{course.date}</span>
                          <span className="h-[10px] w-px rounded-[9px] bg-[#999999]" />
                          <span className="text-[12px] leading-[1.4] tracking-[-0.3px] text-[#111111]">장소 {course.spotCount}곳</span>
                        </div>
                        {course.review ? <p className="mt-1 truncate text-[12px] leading-[1.4] tracking-[-0.3px] text-[#767676]">리뷰: {course.review}</p> : null}
                      </div>
                    </Link>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className={`inline-flex h-6 items-center rounded-full px-2 text-[12px] font-semibold leading-[1.4] tracking-[-0.3px] ${statusTone[course.status]}`}>{statusLabels[course.status]}</span>
                      <ChevronRight className="h-5 w-5 text-[#999999]" strokeWidth={1.8} />
                    </div>
                  </CardContent>
                </Card>
              )) : <p className="rounded-2xl border border-dashed border-[#e5e5ec] py-10 text-center text-[14px] tracking-[-0.35px] text-[#767676]">{statusLabels[selectedStatus]} 코스가 없어요.</p>}
            </div>
          </section>
        </div>
      </main>

    </MainShell>
  );
}
