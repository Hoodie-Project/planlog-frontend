"use client";

import Link from "next/link";
import { MainShell } from "@/components/layout/MainShell";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { toCourseResultView } from "@/lib/course-create";
import {
  currentCourse,
  recommendedCourseInsights,
  recommendedCourseStops,
  recommendedCourseTags,
  relatedCourseCards,
} from "@/lib/mock-data";
import { useCourseStore } from "@/store/course-store";

export default function CourseResultPage() {
  const generatedCourse = useCourseStore((state) => state.generatedCourse);
  const resultView = generatedCourse ? toCourseResultView(generatedCourse) : currentCourse;

  return (
    <MainShell>
      <div className="mx-auto max-w-[1240px] px-4 py-12 lg:px-0">
        <section className="rounded-[24px] border border-[#ffc5d1] bg-white px-8 py-8 shadow-[0_10px_30px_rgba(17,17,17,0.06)]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-5">
              <p className="text-[15px] font-semibold tracking-[-0.35px] text-[#f30031]">추천 코스</p>
              <div className="space-y-3">
                <h1 className="text-[36px] font-extrabold leading-[1.35] tracking-[-0.9px] text-slate-900">{resultView.title}</h1>
                <p className="text-[18px] leading-[1.5] tracking-[-0.45px] text-slate-600">{resultView.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {recommendedCourseTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex h-9 items-center rounded-full border border-[#ffd6df] bg-[#fff6f8] px-4 text-[14px] font-semibold tracking-[-0.35px] text-[#f30031]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="h-11 rounded-full bg-[#f30031] px-6 text-[16px] font-semibold hover:bg-[#df032f]">코스 저장</Button>
              <Button
                className="h-11 rounded-full border border-[#ffd6df] bg-white px-6 text-[16px] font-semibold text-slate-900 hover:bg-[#fff6f8]"
                variant="outline"
              >
                다시 추천받기
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="rounded-[20px] border-[#ffe0e7] shadow-[0_8px_24px_rgba(17,17,17,0.05)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-slate-900">추천 동선 미리보기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-[20px] border border-[#ffd6df] bg-[linear-gradient(180deg,#fff8fa_0%,#fff_100%)] p-6">
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {recommendedCourseStops.map((stop, index) => (
                    <div key={stop.name} className="rounded-[16px] border border-[#ffe8ee] bg-white px-5 py-4 shadow-[0_2px_6px_rgba(17,17,17,0.04)]">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex h-7 items-center rounded-full bg-[#fff0f4] px-3 text-[12px] font-bold tracking-[-0.3px] text-[#f30031]">
                          {stop.category}
                        </span>
                        <span className="text-[14px] font-semibold tracking-[-0.35px] text-slate-500">{stop.time}</span>
                      </div>
                      <p className="mt-4 text-[18px] font-semibold tracking-[-0.45px] text-slate-900">{stop.name}</p>
                      <p className="mt-2 text-[14px] leading-[1.45] tracking-[-0.35px] text-slate-600">{stop.note}</p>
                      {index < recommendedCourseStops.length - 1 ? (
                        <div className="mt-4 h-[2px] w-full rounded-full bg-[#ffe0e7]" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[20px] border-[#ffe0e7] shadow-[0_8px_24px_rgba(17,17,17,0.05)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-slate-900">일정표</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resultView.timeline.map((item, index) => (
                <div key={`${item.time}-${item.name}`} className="rounded-[16px] border border-[#ffe0e7] bg-white px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[18px] font-bold tracking-[-0.45px] text-slate-900">{item.time}</p>
                    <span className="text-[13px] font-medium tracking-[-0.3px] text-slate-500">STEP {index + 1}</span>
                  </div>
                  <p className="mt-2 text-[17px] font-semibold tracking-[-0.4px] text-slate-900">{item.name}</p>
                  <p className="mt-1 text-[14px] leading-[1.45] tracking-[-0.35px] text-slate-600">{item.meta}</p>
                </div>
              ))}
              <Button
                asChild
                className="mt-2 h-11 w-full rounded-full border border-[#ffd6df] bg-[#fff6f8] text-[15px] font-semibold text-slate-900 hover:bg-[#ffedf2]"
                variant="outline"
              >
                <Link href="/course/saved">저장한 코스로 이동</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <Card className="rounded-[20px] border-[#ffe0e7] shadow-[0_8px_24px_rgba(17,17,17,0.05)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-slate-900">코스 요약 정보</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {Object.entries(resultView.stats).map(([key, value]) => (
                <div key={key} className="rounded-[16px] border border-[#ffe8ee] bg-[#fffafb] px-5 py-4">
                  <p className="text-[14px] tracking-[-0.35px] text-slate-500">{key}</p>
                  <p className="mt-2 text-[22px] font-bold tracking-[-0.55px] text-slate-900">{value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[20px] border-[#ffe0e7] shadow-[0_8px_24px_rgba(17,17,17,0.05)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-slate-900">추천 이유</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendedCourseInsights.map((insight) => (
                <div key={insight.title} className="rounded-[16px] border border-[#ffe8ee] bg-white px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[17px] font-semibold tracking-[-0.4px] text-slate-900">{insight.title}</p>
                    <span className="text-[14px] font-bold tracking-[-0.35px] text-[#f30031]">{insight.value}</span>
                  </div>
                  <p className="mt-2 text-[14px] leading-[1.5] tracking-[-0.35px] text-slate-600">{insight.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mt-6">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-[24px] font-bold tracking-[-0.6px] text-slate-900">비슷한 추천 코스</h2>
              <p className="mt-1 text-[15px] tracking-[-0.35px] text-slate-600">현재 톤앤매너를 유지한 UI 목업 섹션입니다.</p>
            </div>
            <Button className="h-10 rounded-full border border-[#ffd6df] bg-white px-5 text-[14px] font-semibold text-slate-900 hover:bg-[#fff6f8]" variant="outline">
              더 보기
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {relatedCourseCards.map((course) => (
              <Card key={course.title} className="rounded-[20px] border-[#ffe0e7] shadow-[0_8px_24px_rgba(17,17,17,0.05)]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-[20px] font-semibold leading-[1.4] tracking-[-0.5px] text-slate-900">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-[15px] leading-[1.5] tracking-[-0.35px] text-slate-600">{course.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {course.chips.map((chip) => (
                      <span key={chip} className="inline-flex h-8 items-center rounded-full bg-slate-100 px-3 text-[13px] font-semibold tracking-[-0.3px] text-slate-700">
                        {chip}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </MainShell>
  );
}
