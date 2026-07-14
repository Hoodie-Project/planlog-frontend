"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MainShell } from "@/components/layout/main-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { moodOptions, originOptions, transportOptions, tripStyleOptions } from "@/lib/mock-data";
import { coursePreferenceSchema, type CoursePreferenceInput } from "@/lib/schemas";
import { useCourseStore } from "@/store/course-store";

export default function CourseCreatePage() {
  const router = useRouter();
  const setPreferences = useCourseStore((state) => state.setPreferences);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CoursePreferenceInput>({
    resolver: zodResolver(coursePreferenceSchema),
    defaultValues: {
      mood: "동해 바다",
      tripStyle: "혼자 떠나요",
      arrivalDate: "2026-07-20",
      arrivalTime: "10:30",
      transportMode: "역에서 시작",
      originLabel: "강릉역",
    },
  });

  const transportMode = watch("transportMode");

  const onSubmit = (values: CoursePreferenceInput) => {
    setPreferences(values);
    router.push("/course/result");
  };

  return (
    <MainShell>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-700">1/4 - 4/4</p>
            <h1 className="mt-2 text-3xl font-semibold">무드 셀렉터</h1>
          </div>
          <Button variant="secondary">심사자 데모 모드</Button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Step 1. 오늘은 어떤 감성이 끌리나요?</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {moodOptions.map((option) => (
                <Label key={option.name} className="rounded-lg border bg-white p-4">
                  <input className="mr-3" type="radio" value={option.name} {...register("mood")} />
                  <span className="font-medium">{option.name}</span>
                  <p className="mt-1 text-sm text-slate-500">{option.description}</p>
                </Label>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 2. 하나를 선택하면 여행 스타일에 맞춰 추천해드려요.</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {tripStyleOptions.map((option) => (
                <Label key={option.name} className="rounded-lg border bg-white p-4">
                  <input className="mr-3" type="radio" value={option.name} {...register("tripStyle")} />
                  <span className="font-medium">{option.name}</span>
                  <p className="mt-1 text-sm text-slate-500">{option.description}</p>
                </Label>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 3. 언제 여행을 시작하나요?</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="arrivalDate">도착 날짜</Label>
                <Input id="arrivalDate" type="date" {...register("arrivalDate")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrivalTime">도착 시간</Label>
                <Input id="arrivalTime" type="time" step="1800" {...register("arrivalTime")} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 4. 어디서 여행을 시작할까요?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                {transportOptions.map((option) => (
                  <Label key={option} className="rounded-lg border bg-white p-4">
                    <input className="mr-3" type="radio" value={option} {...register("transportMode")} />
                    {option}
                  </Label>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="originLabel">시작 지점</Label>
                <Input
                  id="originLabel"
                  list="origins"
                  placeholder="강릉역, 속초시외버스터미널, 강릉 등"
                  {...register("originLabel")}
                />
                <datalist id="origins">
                  {originOptions[transportMode].map((origin) => (
                    <option key={origin} value={origin} />
                  ))}
                </datalist>
              </div>
              {errors.originLabel ? <p className="text-sm text-red-600">{errors.originLabel.message}</p> : null}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg">
              코스 만들기
            </Button>
          </div>
        </form>
      </div>
    </MainShell>
  );
}

