"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { generateCourse } from "@/api/courses/generate";
import { MainShell } from "@/components/layout/MainShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { parseCourseCreateStep, toCreateCourseRequest } from "@/lib/course-create";
import { originOptions, transportOptions, tripStyleOptions } from "@/lib/mock-data";
import { coursePreferenceSchema, courseStep1Schema, courseStep2Schema, courseStep3Schema, courseStep4Schema } from "@/lib/schemas";
import { useCourseStore } from "@/store/course-store";

const totalSteps = 4;
type TransportOption = (typeof transportOptions)[number];
const transportOptionSet = new Set<TransportOption>(transportOptions);
const step1ThemeIcons = {
  sea: "https://www.figma.com/api/mcp/asset/46e6793f-36a3-4191-8308-1cf7f5aa5cab",
  snow: "https://www.figma.com/api/mcp/asset/dab87ad2-951d-47a9-b9cc-739453980d5b",
  valley: "https://www.figma.com/api/mcp/asset/eae26ad2-dd6f-4fc3-a50e-11d4fdad9afb",
  retro: "https://www.figma.com/api/mcp/asset/f9c6d1eb-0a0f-4d77-bf3e-ba90c4e961b9",
  photo: "https://www.figma.com/api/mcp/asset/c77d03a5-777b-4542-97f8-6b2d956b315f",
} as const;

const stepLabels = ["여행 테마", "동행자 유형", "여행 시작 날짜", "여행 시작 장소"];

export function CourseCreateFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = parseCourseCreateStep(searchParams.get("step"));

  const preferences = useCourseStore((state) => state.preferences);
  const updatePreferences = useCourseStore((state) => state.updatePreferences);
  const setGeneratedCourse = useCourseStore((state) => state.setGeneratedCourse);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedTransport = transportOptionSet.has(preferences.transportMode as TransportOption)
    ? (preferences.transportMode as TransportOption)
    : null;
  const originList = useMemo(
    () => (selectedTransport ? originOptions[selectedTransport] : []),
    [selectedTransport]
  );

  const goStep = (nextStep: number) => {
    router.replace(`/course/create?step=${nextStep}`);
  };

  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        return courseStep1Schema.safeParse(preferences);
      case 2:
        return courseStep2Schema.safeParse(preferences);
      case 3:
        return courseStep3Schema.safeParse(preferences);
      case 4:
        return courseStep4Schema.safeParse(preferences);
      default:
        return courseStep1Schema.safeParse(preferences);
    }
  };

  const currentStepValidation = validateCurrentStep();
  const canProceed = currentStepValidation.success && !isSubmitting;

  const handleNext = async () => {
    setError(null);

    if (!currentStepValidation.success) {
      setError(currentStepValidation.error.issues[0]?.message ?? "입력값을 확인해 주세요.");
      return;
    }

    if (step < totalSteps) {
      goStep(step + 1);
      return;
    }

    const finalValidation = coursePreferenceSchema.safeParse(preferences);
    if (!finalValidation.success) {
      setError(finalValidation.error.issues[0]?.message ?? "입력값을 확인해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const course = await generateCourse(toCreateCourseRequest(finalValidation.data));
      setGeneratedCourse(course);
      router.push("/course/result");
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "코스 생성에 실패했습니다.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainShell>
      <div className="mx-auto max-w-[1240px] px-4 py-[60px] lg:px-0">
        <div className="mx-auto flex w-full max-w-[432px] flex-col gap-16">
          <div className="flex flex-col gap-9">
            <div className="flex h-8 items-center gap-[5px] text-[14px] font-bold tracking-[-0.35px]">
              {stepLabels.map((label, index) => {
                const current = index + 1;
                const active = current === step;

                return (
                  <div key={label} className="flex items-center gap-[5px]">
                    <div className="flex items-center gap-1">
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[14px] leading-none ${
                          active ? "bg-[#f30031] text-white" : "bg-[#e5e5ec] text-[#999]"
                        }`}
                      >
                        {current}
                      </span>
                      <span className={active ? "text-[#111]" : "text-[#999]"}>{label}</span>
                    </div>
                    {current !== totalSteps ? <span className="h-px w-3 bg-[#e5e5ec]" /> : null}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-10">
              <div className="w-[352px]">
                <h1 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111]">
                  오늘은 어떤 감성이 끌리나요?
                </h1>
                <p className="mt-1 text-[18px] leading-[1.4] tracking-[-0.45px] text-[#111]">
                  원하는 감성을 선택하면 장소를 추천해드려요. (택 1)
                </p>
              </div>

              {step === 1 ? (
                <div className="flex gap-2">
                  {[
                    { key: "동해 바다", label: "동해 바다", icon: step1ThemeIcons.sea },
                    { key: "설원·산악", label: "설원·산악", icon: step1ThemeIcons.snow },
                    { key: "계곡·자연", label: "계곡·자연", icon: step1ThemeIcons.valley },
                    { key: "레트로·문화", label: "레트로·문화", icon: step1ThemeIcons.retro },
                    { key: "절경·포토", label: "절경·포토", icon: step1ThemeIcons.photo },
                  ].map((option) => {
                    const active = preferences.mood === option.key;

                    return (
                      <button
                        key={option.key}
                        className={`relative h-[60px] w-20 rounded-lg border text-left shadow-[0px_2px_6px_0px_rgba(17,17,17,0.08)] transition-colors ${
                          active ? "border-[#ff1f4c] bg-[#ffeaee]" : "border-[#f1f1f5] bg-white"
                        }`}
                        onClick={() => updatePreferences({ mood: option.key })}
                        type="button"
                      >
                        <img alt="" aria-hidden="true" className="absolute left-[5px] top-[5px] h-6 w-6 object-contain" src={option.icon} />
                        <span
                          className={`absolute left-[5px] top-[33px] whitespace-nowrap text-[14px] font-semibold leading-[1.4] ${
                            active ? "text-[#ff1f4c]" : "text-[#111]"
                          }`}
                        >
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>

          {step === 2 ? (
            <Card>
              <CardHeader>
                <CardTitle>Step 2. 하나를 선택하면 여행 스타일에 맞춰 추천해드려요.</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {tripStyleOptions.map((option) => (
                  <Label key={option.name} className="rounded-lg border bg-white p-4">
                    <input
                      checked={preferences.tripStyle === option.name}
                      className="mr-3"
                      onChange={() => updatePreferences({ tripStyle: option.name })}
                      type="radio"
                    />
                    <span className="font-medium">{option.name}</span>
                    <p className="mt-1 text-sm text-slate-500">{option.description}</p>
                  </Label>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {step === 3 ? (
            <Card>
              <CardHeader>
                <CardTitle>Step 3. 언제 여행을 시작하나요?</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="arrivalDate">도착 날짜</Label>
                  <Input
                    id="arrivalDate"
                    onChange={(event) => updatePreferences({ arrivalDate: event.target.value })}
                    type="date"
                    value={preferences.arrivalDate}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrivalTime">도착 시간</Label>
                  <Input
                    id="arrivalTime"
                    onChange={(event) => updatePreferences({ arrivalTime: event.target.value })}
                    step="1800"
                    type="time"
                    value={preferences.arrivalTime}
                  />
                </div>
              </CardContent>
            </Card>
          ) : null}

          {step === 4 ? (
            <Card>
              <CardHeader>
                <CardTitle>Step 4. 어디서 여행을 시작할까요?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  {transportOptions.map((option) => (
                    <Label key={option} className="rounded-lg border bg-white p-4">
                      <input
                        checked={preferences.transportMode === option}
                        className="mr-3"
                        onChange={() => updatePreferences({ transportMode: option, originLabel: originOptions[option][0] })}
                        type="radio"
                      />
                      {option}
                    </Label>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originLabel">시작 지점</Label>
                  <Input
                    id="originLabel"
                    list="origins"
                    onChange={(event) => updatePreferences({ originLabel: event.target.value })}
                    placeholder="강릉역, 속초시외버스터미널, 강릉 등"
                    value={preferences.originLabel}
                  />
                  <datalist id="origins">
                    {originList.map((origin) => (
                      <option key={origin} value={origin} />
                    ))}
                  </datalist>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex items-center justify-between">
            <button
              className="inline-flex h-9 items-center justify-center rounded-full bg-[#f1f1f5] px-5 text-[18px] tracking-[-0.45px] text-[#505050] disabled:opacity-50"
              disabled={step === 1 || isSubmitting}
              onClick={() => goStep(step - 1)}
              type="button"
            >
              이전
            </button>
            <button
              className={`inline-flex h-9 items-center justify-center rounded-full px-5 text-[18px] tracking-[-0.45px] transition-colors disabled:cursor-not-allowed ${
                canProceed ? "bg-[#f30031] text-white" : "bg-[#f1f1f5] text-[#505050]"
              }`}
              disabled={!canProceed}
              onClick={handleNext}
              type="button"
            >
              {step === totalSteps ? (isSubmitting ? "코스 생성 중..." : "코스 만들기") : "다음"}
            </button>
          </div>
        </div>
      </div>
    </MainShell>
  );
}
