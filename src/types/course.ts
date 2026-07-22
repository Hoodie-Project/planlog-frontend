export type CourseZone = "SEA" | "SNOW" | "VALLEY" | "RETRO" | "PHOTO";
export type CourseTransport = "WALK" | "KTX" | "CAR";
export type CourseStyle = "SOLO" | "PET";
export type CourseItemType = "SPOT" | "MEAL" | "STAY";
export type CongestionLevel = "LOW" | "MEDIUM" | "HIGH";

export type CreateCourseRequest = {
  zone: CourseZone;
  transport?: CourseTransport;
  style?: CourseStyle;
  spotCount?: number;
  nights?: number;
  seed?: number;
  travelDate?: string;
  debug?: boolean;
  startMapX?: string;
  startMapY?: string;
};

export type CourseItemDto = {
  order: number;
  type: CourseItemType;
  contentId: string;
  title: string;
  zone?: CourseZone | null;
  address?: string;
  image?: string;
  mapX?: string;
  mapY?: string;
  arriveTime: string;
  stayMinutes: number;
  travelMinutesFromPrev: number;
  distanceFromPrev: number;
};

export type CourseDayDto = {
  day: number;
  summary: string;
  distance: number;
  travelMinutes: number;
  items: CourseItemDto[];
};

export type CourseCongestionDto = {
  date: string;
  weekday: string;
  index: number;
  level: CongestionLevel;
  recommendedWeekday: string | null;
  message: string;
};

export type RelatedLegDto = {
  fromSpot: string;
  matchedRelated: string | null;
  available: string[];
};

export type CourseRelatedDebugDto = {
  used: boolean;
  relatedMapSize: number;
  matchedLegs: number;
  totalLegs: number;
  hitRate: number;
  legs: RelatedLegDto[];
};

export type CourseDto = {
  zone: CourseZone;
  zoneLabel: string;
  transport: CourseTransport;
  style: CourseStyle;
  nights: number;
  summary: string;
  totalDistance: number;
  totalTravelMinutes: number;
  days: CourseDayDto[];
  congestion?: CourseCongestionDto;
  relatedDebug?: CourseRelatedDebugDto;
};

