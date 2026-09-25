import { z } from "zod";

export function isArrivalDateTodayOrLater(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const selected = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (selected.getFullYear() !== Number(match[1]) || selected.getMonth() !== Number(match[2]) - 1 || selected.getDate() !== Number(match[3])) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected >= today;
}

export function getMinimumArrivalTimeForToday(now = new Date()) {
  const minimum = new Date(now);
  const secondsIntoHour = now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000;
  const roundedMinutes = Math.ceil(secondsIntoHour / (15 * 60)) * 15;

  minimum.setMinutes(roundedMinutes, 0, 0);
  return minimum;
}

export function isArrivalTimeInFutureForToday(arrivalDate: string, arrivalTime: string, now = new Date()) {
  if (!/^\d{2}:\d{2}$/.test(arrivalTime)) return false;
  const [hours, minutes] = arrivalTime.split(":").map(Number);
  if (hours > 23 || minutes > 59) return false;

  const today = now;
  const selectedDate = new Date(arrivalDate);
  if (Number.isNaN(selectedDate.getTime()) || selectedDate.toDateString() !== today.toDateString()) return true;

  const selectedTime = new Date(now);
  selectedTime.setHours(hours, minutes, 0, 0);
  return selectedTime >= getMinimumArrivalTimeForToday(now);
}

const coursePreferenceFields = {
  mood: z.string().min(1, "감성을 선택해 주세요."),
  tripStyle: z.string().min(1, "여행 타입을 선택해 주세요."),
  arrivalDate: z.string().min(1, "도착 날짜를 입력해 주세요.").refine(isArrivalDateTodayOrLater, "도착 날짜는 오늘부터 선택할 수 있어요."),
  arrivalTime: z.string().min(1, "도착 시간을 입력해 주세요."),
  nights: z.union([z.literal(0), z.literal(1)], { message: "여행 기간을 선택해 주세요." }),
  transportMode: z.enum(["역에서 시작", "터미널에서 시작", "자동차로 이동"]),
  originLabel: z.string().min(1, "시작 지점을 입력해 주세요."),
};

function validateTodayArrivalTime(value: { arrivalDate: string; arrivalTime: string }, context: z.RefinementCtx) {
  if (value.arrivalDate && value.arrivalTime && !isArrivalTimeInFutureForToday(value.arrivalDate, value.arrivalTime)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["arrivalTime"], message: "오늘은 현재 시각 이후의 도착 시간만 선택할 수 있어요." });
  }
}

export const coursePreferenceSchema = z.object(coursePreferenceFields).superRefine(validateTodayArrivalTime);

export const courseStep1Schema = z.object({ mood: coursePreferenceFields.mood });
export const courseStep2Schema = z.object({ tripStyle: coursePreferenceFields.tripStyle });
export const courseStep3Schema = z.object({ arrivalDate: coursePreferenceFields.arrivalDate, arrivalTime: coursePreferenceFields.arrivalTime, nights: coursePreferenceFields.nights }).superRefine(validateTodayArrivalTime);
export const courseStep4Schema = z.object({ transportMode: coursePreferenceFields.transportMode, originLabel: coursePreferenceFields.originLabel });

export type CoursePreferenceInput = z.infer<typeof coursePreferenceSchema>;
export type CoursePreferenceDraft = {
  mood: string;
  tripStyle: string;
  arrivalDate: string;
  arrivalTime: string;
  nights: 0 | 1;
  transportMode: string;
  originLabel: string;
};
