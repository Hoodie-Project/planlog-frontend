"use client";

import Link from "next/link";
import { MainShell } from "@/components/layout/MainShell";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { toCourseResultView } from "@/lib/course-create";
import { currentCourse } from "@/lib/mock-data";
import { useCourseStore } from "@/store/course-store";

export default function CourseResultPage() {
  const generatedCourse = useCourseStore((state) => state.generatedCourse);
  const resultView = generatedCourse ? toCourseResultView(generatedCourse) : currentCourse;

  return (
    <MainShell>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-cyan-700">코스를 만들고 있어요 → 생성 완료</p>
            <h1 className="text-3xl font-semibold">{resultView.title}</h1>
            <p className="text-slate-600">{resultView.summary}</p>
          </div>
          <div className="flex gap-3">
            <Button>저장하기</Button>
            <Button variant="secondary">다시 추천받기</Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="min-h-[420px]">
            <CardHeader>
              <CardTitle>지도 / 이동 경로</CardTitle>
            </CardHeader>
            <CardContent className="flex h-[340px] items-center justify-center rounded-md bg-slate-100 text-slate-500">
              지도 SDK 연동 예정 - 코스 이동 경로 시각화 영역
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>일정표</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resultView.timeline.map((item) => (
                <div key={`${item.time}-${item.name}`} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{item.time}</p>
                    <p className="text-sm text-slate-500">{item.meta}</p>
                  </div>
                  <p className="mt-1 text-slate-700">{item.name}</p>
                </div>
              ))}
              <Button asChild className="w-full" variant="secondary">
                <Link href="/course/saved">코스 상세 보기</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>코스 요약 정보</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {Object.entries(resultView.stats).map(([key, value]) => (
                <div key={key} className="rounded-lg bg-slate-100 p-4">
                  <p className="text-sm text-slate-500">{key}</p>
                  <p className="mt-1 font-semibold text-slate-900">{value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>이 코스를 추천한 이유</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resultView.reasons.map((reason) => (
                <div key={reason} className="rounded-lg border p-4 text-sm text-slate-700">
                  {reason}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainShell>
  );
}
