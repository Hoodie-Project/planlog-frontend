import type { CoursePreferenceInput } from "@/lib/schemas";
import type { CourseDto, CourseStyle, CourseTransport, CourseZone, CreateCourseRequest } from "@/types/course";

const moodToZoneMap: Record<CoursePreferenceInput["mood"], CourseZone> = {
  "동해 바다": "SEA",
  "설원·산악": "SNOW",
  "계곡·자연": "VALLEY",
  "레트로·문화": "RETRO",
  "절경·포토": "PHOTO",
};

const tripStyleToStyleMap: Record<CoursePreferenceInput["tripStyle"], CourseStyle> = {
  "혼자 떠나요": "SOLO",
  "반려동물과 함께": "PET",
  "가족과 함께": "SOLO",
  "조용히 쉬고 싶어요": "SOLO",
};

const transportModeToTransportMap: Record<CoursePreferenceInput["transportMode"], CourseTransport> = {
  "역에서 시작": "KTX",
  "터미널에서 시작": "WALK",
  "자동차로 이동": "CAR",
};

const originCoordinateMap: Record<string, { mapX: string; mapY: string }> = {
  강릉역: { mapX: "128.8989", mapY: "37.7642" },
  정동진역: { mapX: "129.0334", mapY: "37.6899" },
  묵호역: { mapX: "129.1166", mapY: "37.5495" },
  동해역: { mapX: "129.1143", mapY: "37.4976" },
  원주역: { mapX: "127.9506", mapY: "37.3401" },
  강릉시외버스터미널: { mapX: "128.9015", mapY: "37.7519" },
  속초시외버스터미널: { mapX: "128.5918", mapY: "38.2046" },
};

export function parseCourseCreateStep(value: string | null) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 4) {
    return 1;
  }

  return parsed;
}

export function toCreateCourseRequest(preferences: CoursePreferenceInput): CreateCourseRequest {
  const coordinates = originCoordinateMap[preferences.originLabel];

  return {
    zone: moodToZoneMap[preferences.mood],
    transport: transportModeToTransportMap[preferences.transportMode],
    style: tripStyleToStyleMap[preferences.tripStyle],
    nights: 0,
    spotCount: 3,
    travelDate: preferences.arrivalDate,
    startMapX: coordinates?.mapX,
    startMapY: coordinates?.mapY,
    debug: false,
  };
}

export function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainMinutes}m`;
  }

  return `${hours}h ${remainMinutes}m`;
}

export function formatMetersToKm(meters: number) {
  return `${(meters / 1000).toFixed(1)}km`;
}

export function toCourseResultView(course: CourseDto) {
  const firstDay = course.days[0];

  return {
    title: `${course.zoneLabel} 코스가 완성됐어요`,
    summary: course.summary,
    timeline: firstDay?.items.map((item) => ({
      time: item.arriveTime,
      name: item.title,
      meta: `이동 ${item.travelMinutesFromPrev}분 · 체류 ${item.stayMinutes}분`,
    })) ?? [],
    stats: {
      "총 거리": formatMetersToKm(course.totalDistance),
      "이동 시간": formatMinutes(course.totalTravelMinutes),
      일정: `${course.days.length}일`,
      숙박: `${course.nights}박`,
    },
    reasons: [
      `1. 선택한 감성존 ${course.zoneLabel} 기준으로 코스를 생성했습니다.`,
      `2. 이동 수단 ${course.transport} 기준으로 동선을 조정했습니다.`,
      `3. 총 ${course.days.length}일 일정과 ${course.totalTravelMinutes}분 이동 시간을 계산했습니다.`,
      course.congestion ? `4. ${course.congestion.message}` : "4. 실시간 TourAPI 데이터로 동선을 구성했습니다.",
    ],
  };
}

