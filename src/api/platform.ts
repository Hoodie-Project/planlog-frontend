import { apiFetch } from "@/api/client";
import type { CourseZone } from "@/types/course";

export type MeStatsDto = { savedCoursesCount: number; bookmarksCount: number; stampsCount: number; collectedZoneCount: number; totalZoneCount: number; recordsCount: number };
export type RecentActivityDto = { type: "SAVED_COURSE" | "STAMP" | "RECORD"; title: string; occurredAt: string };
export type NotificationSettingsDto = { ddayAlert: boolean; festivalAlert: boolean; courseReminder: boolean };
export type RecordDto = { id: string; title: string; travelDate: string; location: string; zone: CourseZone; note: string; mood: string | null; image: string | null; tags: string[]; createdAt: string; savedCourseId: string | null; spotCount: number | null; totalDistance: number | null; nights: number | null; stamps: Array<{ id: string; zone: CourseZone; contentId: string; title: string; image: string | null; visitedAt: string }> };
export type RecordTraitsDto = { totalRecords: number; traits: Array<{ zone: CourseZone; label: string; count: number; percent: number }>; travelType: { zone: CourseZone; percent: number; title: string; description: string } | null };
export type PlaceDto = { contentId: string; title: string; address?: string; image?: string | null; mapX?: string; mapY?: string; zone?: CourseZone; dist?: number; overview?: string };
export type FestivalDto = PlaceDto & { eventStartDate?: string | null; eventEndDate?: string | null; isThisWeekend?: boolean };
export type CourseReviewSummaryDto = {
  totalCount: number;
  topMoods: Array<{ mood: string; count: number }>;
  reviews: Array<{ contentId: string; title: string; visitedAt: string; note: string; mood: string }>;
};
export type AccommodationDto = PlaceDto & { contentTypeId: string; sigunguCode?: string; tel?: string; stayType?: "HEALING" | "VALUE" | "SOCIAL" | string | null };
export type AccommodationDetailDto = AccommodationDto & {
  overview?: string | null;
  checkinTime?: string | null;
  checkoutTime?: string | null;
  checkin?: string | null;
  checkout?: string | null;
  roomCount?: number | null;
  cookingAvailable?: boolean | null;
  cooking?: boolean | null;
  parkingAvailable?: boolean | null;
  parking?: boolean | null;
  reservationUrl?: string | null;
  homepage?: string | null;
  facilities?: string[] | null;
};

const auth = (accessToken: string) => ({ accessToken });

function toDateOnly(value: string) {
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
  return match ? match[1] : value;
}

export const getMeStats = (accessToken: string) => apiFetch<MeStatsDto>("/api/auth/me/stats", auth(accessToken));
export const listRecentActivities = (accessToken: string, limit?: number) => apiFetch<RecentActivityDto[]>("/api/auth/me/recent-activities", { ...auth(accessToken), query: { limit } });
export const listRecords = (accessToken: string) => apiFetch<RecordDto[]>("/api/records", auth(accessToken));
export const getRecord = (accessToken: string, id: string) => apiFetch<RecordDto>(`/api/records/${encodeURIComponent(id)}`, auth(accessToken));
export const createRecord = (accessToken: string, dto: Omit<RecordDto, "id" | "createdAt" | "stamps" | "savedCourseId" | "spotCount" | "totalDistance" | "nights"> & { savedCourseId?: string; stampIds?: string[] }) => apiFetch<RecordDto>("/api/records", { ...auth(accessToken), method: "POST", body: JSON.stringify({ ...dto, travelDate: toDateOnly(dto.travelDate) }) });
export const deleteRecord = (accessToken: string, id: string) => apiFetch<{ deleted: boolean; id: string }>(`/api/records/${encodeURIComponent(id)}`, { ...auth(accessToken), method: "DELETE" });
export const getRecordHighlights = (accessToken: string, limit?: number) => apiFetch<Array<{ rank: number; mood: string; quote: string }>>("/api/records/highlights", { ...auth(accessToken), query: { limit } });
export const getRecordTraits = (accessToken: string) => apiFetch<RecordTraitsDto>("/api/records/traits", auth(accessToken));
export const getNotificationSettings = (accessToken: string) => apiFetch<NotificationSettingsDto>("/api/notification-settings", auth(accessToken));
export const updateNotificationSettings = (accessToken: string, dto: Partial<NotificationSettingsDto>) => apiFetch<NotificationSettingsDto>("/api/notification-settings", { ...auth(accessToken), method: "PATCH", body: JSON.stringify(dto) });
export const listStations = (type?: "TRAIN" | "BUS") => apiFetch<Array<{ type: "TRAIN" | "BUS"; name: string; mapX: string; mapY: string }>>("/api/stations", { query: { type } });
export const getStampTraits = (accessToken: string) => apiFetch<{ totalStamps: number; traits: Array<{ zone: CourseZone; label: string; count: number; percent: number }> }>("/api/stamps/traits", auth(accessToken));
export const listFestivals = (query: Record<string, string | number | boolean | undefined> = {}) => apiFetch<FestivalDto[]>("/api/festivals", { query });
export const getCourseReviews = (contentIds: string[]) => apiFetch<CourseReviewSummaryDto>("/api/course-reviews", { query: { contentIds: contentIds.join(",") } });
export const listAccommodations = (query: Record<string, string | number | boolean | undefined> = {}) => apiFetch<AccommodationDto[]>("/api/accommodations", { query });
export const getAccommodation = (contentId: string) => apiFetch<AccommodationDetailDto>(`/api/accommodations/${encodeURIComponent(contentId)}`);
export const listCampings = (query: Record<string, string | number | boolean | undefined> = {}) => apiFetch<PlaceDto[]>("/api/campings", { query });
export const getCongestion = () => apiFetch<{ weekdays: Array<{ weekdayCode: string; weekday: string; index: number; level: string; avgVisitors: number }>; leastBusy: unknown; busiest: unknown }>("/api/congestion");
export const listRelatedSpots = (query: Record<string, string | number | boolean | undefined>) => apiFetch<unknown[]>("/api/related-spots", { query });
export const listPetSpots = (query: Record<string, string | number | boolean | undefined> = {}) => apiFetch<PlaceDto[]>("/api/pet-spots", { query });
export const getPetSpotInfo = (contentId: string) => apiFetch<unknown>(`/api/pet-spots/${encodeURIComponent(contentId)}/info`);
export const listSpots = (query: Record<string, string | number | boolean | undefined> = {}) => apiFetch<PlaceDto[]>("/api/spots", { query });
export const getSpot = (contentId: string) => apiFetch<PlaceDto>(`/api/spots/${encodeURIComponent(contentId)}`);
export const getSpotImages = (contentId: string) => apiFetch<string[]>(`/api/spots/${encodeURIComponent(contentId)}/images`);
export const listMatches = (accessToken: string) => apiFetch<unknown[]>("/api/matches", auth(accessToken));
export const optInMatch = (accessToken: string, dto: { zone: CourseZone; travelDate: string }) => apiFetch<unknown>("/api/matches/opt-in", { ...auth(accessToken), method: "POST", body: JSON.stringify(dto) });
export const listMatchOptIns = (accessToken: string) => apiFetch<unknown[]>("/api/matches/opt-ins", auth(accessToken));
export const withdrawMatchOptIn = (accessToken: string, id: string) => apiFetch<unknown>(`/api/matches/opt-ins/${encodeURIComponent(id)}`, { ...auth(accessToken), method: "DELETE" });
export const listCourseFeedback = (accessToken: string) => apiFetch<unknown[]>("/api/course-feedback", auth(accessToken));
export const createCourseFeedback = (accessToken: string, dto: { zone: CourseZone; options: string[] }) => apiFetch<unknown>("/api/course-feedback", { ...auth(accessToken), method: "POST", body: JSON.stringify(dto) });
