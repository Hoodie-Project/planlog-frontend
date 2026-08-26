"use client";

import { useMemo, useRef, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/ko";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import coffeeIcon from "@/asset/svgs/coffee.svg";
import familyHomeIcon from "@/asset/svgs/family-home.svg";
import forestIcon from "@/asset/svgs/forest.svg";
import busIcon from "@/asset/svgs/bus.svg";
import carFillIcon from "@/asset/svgs/mingcute_car-fill.svg";
import subwayVariantIcon from "@/asset/svgs/mdi_subway-variant.svg";
import mountainFlagIcon from "@/asset/svgs/mountain-flag.svg";
import personIcon from "@/asset/svgs/person.svg";
import petsIcon from "@/asset/svgs/pets.svg";
import photoCameraIcon from "@/asset/svgs/photo-camera.svg";
import sentimentCalmIcon from "@/asset/svgs/sentiment-calm.svg";
import wavesIcon from "@/asset/svgs/waves.svg";
import { generateCourse } from "@/api/courses/generate";
import { MainShell } from "@/components/layout/MainShell";
import { parseCourseCreateStep, toCreateCourseRequest } from "@/lib/course-create";
import { originOptions, transportOptions } from "@/lib/mock-data";
import { coursePreferenceSchema, courseStep1Schema, courseStep2Schema, courseStep3Schema, courseStep4Schema } from "@/lib/schemas";
import { useCourseStore } from "@/store/course-store";

const totalSteps = 4;
type TransportOption = (typeof transportOptions)[number];
const transportOptionSet = new Set<TransportOption>(transportOptions);
const completedStepCheckIcon = "https://www.figma.com/api/mcp/asset/81572b10-cc1a-4e45-b0aa-bb8e887dc567";
const step1ThemeIcons = {
  sea: {
    base: wavesIcon.src,
  },
  snow: {
    base: mountainFlagIcon.src,
  },
  valley: {
    base: forestIcon.src,
  },
  retro: {
    base: coffeeIcon.src,
  },
  photo: {
    base: photoCameraIcon.src,
  },
} as const;
const step2CompanionIcons = {
  solo: {
    base: personIcon.src,
  },
  family: {
    base: familyHomeIcon.src,
  },
  pet: {
    base: petsIcon.src,
  },
  calm: {
    base: sentimentCalmIcon.src,
  },
} as const;

const stepLabels = ["여행 테마", "동행자 유형", "여행 시작 날짜", "여행 시작 장소"];
const step2Options = [
  {
    key: "혼자 떠나요",
    label: "혼자 떠나요",
    description: "나만의 속도로 천천히",
    icon: step2CompanionIcons.solo,
  },
  {
    key: "가족과 함께",
    label: "가족과 함께",
    description: "이동 부담이 적은 코스로",
    icon: step2CompanionIcons.family,
  },
  {
    key: "반려동물과 함께",
    label: "반려동물과 함께",
    description: "함께 갈 수 있는 장소 중심으로",
    icon: step2CompanionIcons.pet,
  },
  {
    key: "조용히 쉬고 싶어요",
    label: "조용히 쉬고 싶어요",
    description: "덜 붐비고 여유로운 장소로",
    icon: step2CompanionIcons.calm,
  },
] as const;
const step4TransportIcons = {
  rail: subwayVariantIcon.src,
  bus: busIcon.src,
  car: carFillIcon.src,
} as const;
const step4TransportOptions = [
  {
    key: "역에서 시작",
    label: "역에서 시작해요",
    description: "KTX·기차역 기준으로 코스 생성",
    icon: step4TransportIcons.rail,
  },
  {
    key: "터미널에서 시작",
    label: "터미널에서 시작해요",
    description: "버스터미널 기준으로 코스 생성",
    icon: step4TransportIcons.bus,
  },
  {
    key: "자동차로 이동",
    label: "자동차로 이동해요",
    description: "선택한 도시 중심으로 코스 생성",
    icon: step4TransportIcons.car,
  },
] as const;

dayjs.locale("ko");

export function CourseCreateFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = parseCourseCreateStep(searchParams.get("step"));

  const preferences = useCourseStore((state) => state.preferences);
  const updatePreferences = useCourseStore((state) => state.updatePreferences);
  const setGeneratedCourse = useCourseStore((state) => state.setGeneratedCourse);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [step4DropdownOpen, setStep4DropdownOpen] = useState(false);
  const dateFieldRef = useRef<HTMLButtonElement | null>(null);
  const timeFieldRef = useRef<HTMLButtonElement | null>(null);

  const selectedTransport = transportOptionSet.has(preferences.transportMode as TransportOption)
    ? (preferences.transportMode as TransportOption)
    : null;
  const originList = useMemo(
    () => (selectedTransport ? originOptions[selectedTransport] : []),
    [selectedTransport]
  );
  const isCarMode = preferences.transportMode === "자동차로 이동";
  const step4SelectLabel = preferences.transportMode === "역에서 시작" ? "역 선택" : preferences.transportMode === "터미널에서 시작" ? "터미널 선택" : "도시 선택";

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
  const arrivalDateValue = preferences.arrivalDate ? dayjs(preferences.arrivalDate) : null;
  const arrivalTimeValue = preferences.arrivalTime ? dayjs(`2026-01-01T${preferences.arrivalTime}`) : null;

  const handleArrivalDateChange = (value: Dayjs | null) => {
    updatePreferences({
      arrivalDate: value?.isValid() ? value.format("YYYY-MM-DD") : "",
    });
  };

  const handleArrivalTimeChange = (value: Dayjs | null) => {
    updatePreferences({
      arrivalTime: value?.isValid() ? value.format("HH:mm") : "",
    });
  };

  const handleTransportModeChange = (option: TransportOption) => {
    setStep4DropdownOpen(false);
    updatePreferences({
      transportMode: option,
      originLabel: "",
    });
  };

  const handleOriginSelect = (value: string) => {
    setStep4DropdownOpen(false);
    updatePreferences({ originLabel: value });
  };

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
                const completed = current < step;

                return (
                  <div key={label} className="flex items-center gap-[5px]">
                    <div className="flex items-center gap-1">
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[14px] leading-none ${
                          active ? "bg-[#f30031] text-white" : "bg-[#e5e5ec] text-[#999]"
                        }`}
                      >
                        {completed ? (
                          <img alt="" aria-hidden="true" className="h-[14px] w-[14px]" src={completedStepCheckIcon} />
                        ) : (
                          current
                        )}
                      </span>
                      <span className={active ? "text-[#111]" : "text-[#999]"}>{label}</span>
                    </div>
                    {current !== totalSteps ? <span className="h-px w-3 bg-[#e5e5ec]" /> : null}
                  </div>
                );
              })}
            </div>

            {step === 1 ? (
              <div className="flex flex-col gap-10">
                <div className="w-[352px]">
                  <h1 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111]">
                    오늘은 어떤 감성이 끌리나요?
                  </h1>
                  <p className="mt-1 text-[18px] leading-[1.4] tracking-[-0.45px] text-[#111]">
                    원하는 감성을 선택하면 장소를 추천해드려요. (택 1)
                  </p>
                </div>

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
                        <span aria-hidden="true" className="absolute left-[5px] top-[5px] h-6 w-6 overflow-hidden">
                          <img alt="" className="h-6 w-6 object-contain" src={option.icon.base} />
                        </span>
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
              </div>
            ) : null}
          </div>

          {step === 2 ? (
            <div className="flex flex-col gap-16">
              <div className="flex flex-col gap-10">
                <div className="w-[352px]">
                  <h1 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111]">
                    이번 여행은 어떤 모습인가요?
                  </h1>
                  <p className="mt-1 text-[18px] leading-[1.4] tracking-[-0.45px] text-[#111]">
                    일행 유무에 따라 여행 코스를 추천해드려요. (택 1)
                  </p>
                </div>

                <div className="flex flex-col gap-[10px]">
                  {step2Options.map((option) => {
                    const active = preferences.tripStyle === option.key;

                    return (
                      <button
                        key={option.key}
                        className={`relative h-[60px] w-full rounded-2xl border text-left shadow-[0px_2px_6px_0px_rgba(17,17,17,0.08)] transition-colors ${
                          active ? "border-[#ff1f4c] bg-[#ffeaee]" : "border-[#f1f1f5] bg-white"
                        }`}
                        onClick={() => updatePreferences({ tripStyle: option.key })}
                        type="button"
                      >
                        <span aria-hidden="true" className="absolute left-[13px] top-[13px] h-8 w-8 overflow-hidden">
                          <img
                            alt=""
                            className={`h-8 w-8 object-contain ${
                              active
                                ? "brightness-0 saturate-100% [filter:invert(14%)_sepia(100%)_saturate(5616%)_hue-rotate(339deg)_brightness(96%)_contrast(118%)]"
                                : ""
                            }`}
                            src={option.icon.base}
                          />
                        </span>
                        <span className="absolute left-[61px] top-[19px] flex items-center gap-2">
                          <span
                            className={`text-[14px] font-semibold leading-[1.4] ${
                              active ? "text-[#ff1f4c]" : "text-[#111]"
                            }`}
                          >
                            {option.label}
                          </span>
                          <span
                            className={`text-[12px] leading-[1.4] tracking-[-0.3px] ${
                              active ? "text-[#ff1f4c]" : "text-[#111]"
                            }`}
                          >
                            {option.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <LocalizationProvider adapterLocale="ko" dateAdapter={AdapterDayjs}>
              <div className="flex flex-col gap-16">
                <div className="flex flex-col gap-10">
                  <div className="w-[431px]">
                    <h1 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111]">
                      언제 여행을 시작하나요?
                    </h1>
                    <p className="mt-1 text-[18px] leading-[1.4] tracking-[-0.45px] text-[#111]">
                      선택한 시간을 기준으로 첫 장소와 이동 순서를 조정해요. (택 1)
                    </p>
                  </div>

                  <div className="relative h-[190px] w-full">
                    <div className="absolute left-0 right-0 top-0">
                      <p className="text-[14px] font-bold leading-[1.4] tracking-[-0.35px] text-[#111]">여행지 도착 날짜</p>
                      <button
                        ref={dateFieldRef}
                        className={`mt-3 h-[60px] w-full rounded-2xl border px-[19px] text-left shadow-[0px_2px_6px_0px_rgba(17,17,17,0.08)] transition-colors ${
                          preferences.arrivalDate ? "border-[#ff1f4c]" : "border-[#f1f1f5]"
                        }`}
                        onClick={() => setDatePickerOpen(true)}
                        type="button"
                      >
                        <span className={preferences.arrivalDate ? "text-[14px] text-[#ff1f4c]" : "text-[14px] text-[#999]"}>
                          {arrivalDateValue?.isValid() ? arrivalDateValue.format("YYYY.MM.DD dddd") : "날짜를 선택해 주세요."}
                        </span>
                      </button>
                    </div>

                    <div className="absolute left-0 right-0 top-[108px]">
                      <p className="text-[14px] font-bold leading-[1.4] tracking-[-0.35px] text-[#111]">여행지 도착 시간</p>
                      <button
                        ref={timeFieldRef}
                        className={`mt-3 h-[60px] w-full rounded-2xl border px-[19px] text-left shadow-[0px_2px_6px_0px_rgba(17,17,17,0.08)] transition-colors ${
                          preferences.arrivalTime ? "border-[#ff1f4c]" : "border-[#f1f1f5]"
                        }`}
                        onClick={() => setTimePickerOpen(true)}
                        type="button"
                      >
                        <span className={preferences.arrivalTime ? "text-[14px] text-[#ff1f4c]" : "text-[14px] text-[#999]"}>
                          {arrivalTimeValue?.isValid() ? arrivalTimeValue.locale("ko").format("A hh:mm") : "시간을 선택해 주세요."}
                        </span>
                      </button>
                    </div>

                    <DatePicker
                      format="YYYY.MM.DD dddd"
                      onChange={handleArrivalDateChange}
                      onClose={() => setDatePickerOpen(false)}
                      open={datePickerOpen}
                      slotProps={{
                        desktopPaper: {
                          sx: {
                            mt: 1,
                          },
                        },
                        popper: {
                          anchorEl: dateFieldRef.current,
                          disablePortal: true,
                          placement: "bottom-start",
                        },
                        textField: {
                          sx: { display: "none" },
                        },
                      }}
                      value={arrivalDateValue}
                    />
                    <TimePicker
                      ampm
                      format="A hh:mm"
                      onChange={handleArrivalTimeChange}
                      onClose={() => setTimePickerOpen(false)}
                      open={timePickerOpen}
                      slotProps={{
                        desktopPaper: {
                          sx: {
                            mt: 1,
                          },
                        },
                        popper: {
                          anchorEl: timeFieldRef.current,
                          disablePortal: true,
                          placement: "bottom-start",
                        },
                        textField: {
                          sx: { display: "none" },
                        },
                      }}
                      value={arrivalTimeValue}
                    />
                  </div>
                </div>
              </div>
            </LocalizationProvider>
          ) : null}

          {step === 4 ? (
            <div className="flex flex-col gap-16">
              <div className="flex flex-col gap-10">
                <div className="w-[431px]">
                  <h1 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111]">
                    어디서 여행을 시작할까요?
                  </h1>
                  <p className="mt-1 text-[18px] leading-[1.4] tracking-[-0.45px] text-[#111]">
                    이동 방식에 따라 시작 지점을 선택해요. (택 1)
                  </p>
                </div>

                <div className="flex flex-col gap-[10px]">
                  {step4TransportOptions.map((option) => {
                    const active = preferences.transportMode === option.key;

                    return (
                      <button
                        key={option.key}
                        className={`flex w-full items-center gap-4 rounded-2xl border p-[14px] text-left shadow-[0px_2px_6px_0px_rgba(17,17,17,0.08)] transition-colors ${
                          active ? "border-[#f30031] bg-[#ffeaee]" : "border-[#f1f1f5] bg-white"
                        }`}
                        onClick={() => handleTransportModeChange(option.key)}
                        type="button"
                      >
                        <img
                          alt=""
                          aria-hidden="true"
                          className={`h-8 w-8 object-contain ${
                            active
                              ? "brightness-0 saturate-100% [filter:invert(19%)_sepia(100%)_saturate(4215%)_hue-rotate(336deg)_brightness(104%)_contrast(102%)]"
                              : ""
                          }`}
                          src={option.icon}
                        />
                        <span className="flex items-center gap-2">
                          <span className={`text-[14px] font-semibold leading-[1.4] ${active ? "text-[#f30031]" : "text-[#111]"}`}>
                            {option.label}
                          </span>
                          <span className={`text-[12px] leading-[1.4] tracking-[-0.3px] ${active ? "text-[#f30031]" : "text-[#111]"}`}>
                            {option.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {selectedTransport ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-[16px] font-bold leading-[1.4] tracking-[-0.4px] text-[#111]">{step4SelectLabel}</p>

                    {isCarMode ? (
                      <div className="grid grid-cols-4 overflow-hidden rounded-2xl border border-[#e5e5ec] bg-white shadow-[0px_1px_4px_-1px_rgba(17,17,17,0.08)]">
                        {originList.map((origin) => {
                          const active = preferences.originLabel === origin;

                          return (
                            <button
                              key={origin}
                              className={`flex h-[52px] items-center justify-center border-r border-t border-[#e5e5ec] px-5 text-[16px] tracking-[-0.4px] ${
                                active ? "bg-[#ffeaee] font-semibold text-[#f30031]" : "text-[#505050]"
                              } ${originList.indexOf(origin) < 4 ? "border-t-0" : ""} ${originList.indexOf(origin) % 4 === 3 ? "border-r-0" : ""}`}
                              onClick={() => handleOriginSelect(origin)}
                              type="button"
                            >
                              {origin}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="relative">
                        <button
                          className={`flex h-[60px] w-full items-center justify-between rounded-2xl border px-[19px] shadow-[0px_2px_6px_0px_rgba(17,17,17,0.08)] transition-colors ${
                            preferences.originLabel ? "border-[#ff1f4c]" : "border-[#f1f1f5]"
                          }`}
                          onClick={() => setStep4DropdownOpen((prev) => !prev)}
                          type="button"
                        >
                          <span className={preferences.originLabel ? "text-[14px] text-[#ff1f4c]" : "text-[14px] text-[#999]"}>
                            {preferences.originLabel || "선택해 주세요."}
                          </span>
                          {step4DropdownOpen ? (
                            <ChevronUp
                              aria-hidden="true"
                              className={preferences.originLabel ? "h-6 w-6 text-[#ff1f4c]" : "h-6 w-6 text-[#999]"}
                              strokeWidth={1.75}
                            />
                          ) : (
                            <ChevronDown
                              aria-hidden="true"
                              className={preferences.originLabel ? "h-6 w-6 text-[#ff1f4c]" : "h-6 w-6 text-[#999]"}
                              strokeWidth={1.75}
                            />
                          )}
                        </button>

                        {step4DropdownOpen ? (
                          <div className="absolute left-0 top-[72px] z-20 w-full overflow-hidden rounded-2xl border border-[#ff1f4c] bg-white shadow-[0px_2px_3px_rgba(17,17,17,0.08)]">
                            {originList.map((origin, index) => (
                              <button
                                key={origin}
                                className={`flex h-[60px] w-full items-center px-[18px] text-left text-[16px] tracking-[-0.4px] text-[#111] ${
                                  index === 1 ? "bg-[#f1f1f5]" : "bg-white"
                                } ${index !== 0 ? "border-t border-[#e5e5ec]" : ""}`}
                                onClick={() => handleOriginSelect(origin)}
                                type="button"
                              >
                                {origin}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex items-center justify-between">
            <button
              className={`inline-flex h-9 items-center justify-center rounded-full px-5 text-[18px] tracking-[-0.45px] transition-colors disabled:cursor-not-allowed ${
                step === 1 ? "bg-[#f1f1f5] text-[#505050]" : "bg-[#ff1f4c] text-white"
              }`}
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
