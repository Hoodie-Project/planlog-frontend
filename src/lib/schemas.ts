import { z } from "zod";

export function isArrivalDateAtLeastTomorrow(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const selected = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (selected.getFullYear() !== Number(match[1]) || selected.getMonth() !== Number(match[2]) - 1 || selected.getDate() !== Number(match[3])) return false;

  const minimum = new Date();
  minimum.setHours(0, 0, 0, 0);
  minimum.setDate(minimum.getDate() + 1);
  return selected >= minimum;
}

export const coursePreferenceSchema = z.object({
  mood: z.string().min(1, "감성을 선택해 주세요."),
  tripStyle: z.string().min(1, "여행 타입을 선택해 주세요."),
  arrivalDate: z.string().min(1, "도착 날짜를 입력해 주세요.").refine(isArrivalDateAtLeastTomorrow, "도착 날짜는 내일부터 선택할 수 있어요."),
  arrivalTime: z.string().min(1, "도착 시간을 입력해 주세요."),
  transportMode: z.enum(["역에서 시작", "터미널에서 시작", "자동차로 이동"]),
  originLabel: z.string().min(1, "시작 지점을 입력해 주세요."),
});

export const courseStep1Schema = coursePreferenceSchema.pick({
  mood: true,
});

export const courseStep2Schema = coursePreferenceSchema.pick({
  tripStyle: true,
});

export const courseStep3Schema = coursePreferenceSchema.pick({
  arrivalDate: true,
  arrivalTime: true,
});

export const courseStep4Schema = coursePreferenceSchema.pick({
  transportMode: true,
  originLabel: true,
});

export type CoursePreferenceInput = z.infer<typeof coursePreferenceSchema>;
export type CoursePreferenceDraft = {
  mood: string;
  tripStyle: string;
  arrivalDate: string;
  arrivalTime: string;
  transportMode: string;
  originLabel: string;
};
