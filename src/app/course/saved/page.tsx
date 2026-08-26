"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import coffeeIcon from "@/asset/svgs/coffee.svg";
import forestIcon from "@/asset/svgs/forest.svg";
import mountainFlagIcon from "@/asset/svgs/mountain-flag.svg";
import { MainShell } from "@/components/layout/MainShell";
import { Card, CardContent } from "@/components/ui/Card";

const upcomingCourse = {
  dday: "D-6",
  dateTime: "2026.08.10 월요일 10:30",
  title: "바다 감성 강릉 하루 코스",
  details: ["동해바다", "가족", "강릉역 출발"],
};

const savedCourseItems = [
  {
    title: "레트로 원주 코스",
    date: "2026.09.04",
    spotCount: "장소 6곳",
    status: "대기중",
    statusTone: "bg-[#F6F6F6] text-[#454545]",
    icon: coffeeIcon.src,
  },
  {
    title: "자연 춘천 코스",
    date: "2026.10.20",
    spotCount: "장소 4곳",
    status: "진행중",
    statusTone: "bg-[#D5F0E3] text-[#016110]",
    icon: forestIcon.src,
  },
  {
    title: "설원 평창 코스",
    date: "2026.11.29",
    spotCount: "장소 5곳",
    status: "완료",
    statusTone: "bg-[#FF1F4C] text-white",
    icon: mountainFlagIcon.src,
  },
] as const;

export default function SavedCoursePage() {
  return (
    <MainShell>
      <div className="mx-auto flex max-w-[1240px] justify-center px-4 py-[60px] lg:px-0">
        <div className="w-full max-w-[432px]">
          <h1 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111111]">저장한 코스</h1>

          <section className="mt-[34px]">
            <p className="text-[16px] leading-[1.4] tracking-[-0.4px] text-[#111111]">다가오는 여행</p>

            <Link className="mt-4 block" href="/course/result">
              <Card className="rounded-2xl border-[#FF1F4C] shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)] transition-transform hover:-translate-y-[1px]">
                <CardContent className="flex items-center gap-3 p-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-[6px]">
                      <span className="inline-flex h-6 items-center rounded-full bg-[#FF1F4C] px-2 text-[12px] font-semibold leading-[1.4] tracking-[-0.3px] text-white">
                        {upcomingCourse.dday}
                      </span>
                      <span className="text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111111]">{upcomingCourse.dateTime}</span>
                    </div>

                    <p className="mt-2 pl-[2px] text-[18px] font-semibold leading-[1.4] tracking-[-0.45px] text-[#111111]">
                      {upcomingCourse.title}
                    </p>

                    <div className="mt-1 flex items-center gap-[6px] pl-[2px] text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111111]">
                      <span>{upcomingCourse.details[0]}</span>
                      <span className="h-[10px] w-px rounded-[9px] bg-[#999999]" />
                      <span>{upcomingCourse.details[1]}</span>
                      <span className="h-[10px] w-px rounded-[9px] bg-[#999999]" />
                      <span>{upcomingCourse.details[2]}</span>
                    </div>
                  </div>

                  <ChevronRight className="h-6 w-6 shrink-0 text-[#999999]" strokeWidth={1.8} />
                </CardContent>
              </Card>
            </Link>
          </section>

          <section className="mt-[52px]">
            <p className="text-[16px] leading-[1.4] tracking-[-0.4px] text-[#111111]">저장한 코스 목록</p>

            <div className="mt-4 space-y-[10px]">
              {savedCourseItems.map((item, index) => (
                <Link key={`${item.title}-${item.date}`} className="block" href={index === 0 ? "/course/result" : "/course/result"}>
                  <Card className="rounded-2xl border-[#F1F1F5] shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)] transition-transform hover:-translate-y-[1px]">
                    <CardContent className="flex items-center justify-between gap-3 px-[19px] py-[19px]">
                      <div className="flex min-w-0 items-center gap-[14px]">
                        <img alt="" aria-hidden="true" className="h-8 w-8 shrink-0 object-contain" src={item.icon} />

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[14px] font-semibold leading-[1.4] text-[#111111]">{item.title}</p>
                            <span className="text-[12px] leading-[1.4] tracking-[-0.3px] text-[#111111]">{item.date}</span>
                            <span className="h-[10px] w-px rounded-[9px] bg-[#999999]" />
                            <span className="text-[12px] leading-[1.4] tracking-[-0.3px] text-[#111111]">{item.spotCount}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span className={`inline-flex h-6 items-center rounded-full px-2 text-[12px] font-semibold leading-[1.4] tracking-[-0.3px] ${item.statusTone}`}>
                          {item.status}
                        </span>
                        <ChevronRight className="h-5 w-5 text-[#999999]" strokeWidth={1.8} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </MainShell>
  );
}
