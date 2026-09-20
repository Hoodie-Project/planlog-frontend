import { apiFetch } from "@/api/client";
import type { CourseZone } from "@/types/course";

export type StampDto = {
  id: string;
  userId: string;
  zone: CourseZone;
  contentId: string;
  title: string;
  image: string | null;
  visitedAt: string;
  mood: string | null;
};

export type StampZoneProgress = {
  zone: CourseZone;
  label: string;
  stampCount: number;
  collected: boolean;
};

export type StampProgressDto = {
  totalZones: number;
  collectedCount: number;
  completed: boolean;
  totalStamps: number;
  zones: StampZoneProgress[];
  reward: { badge: string; title: string } | null;
};

export type StampEligibilityDto = { state: "ALREADY_STAMPED" | "REVIEWER" | "NO_LOCATION" | "TOO_FAR" | "ELIGIBLE"; reason: string | null; distance?: number };

export async function createStamp(
  accessToken: string,
  dto: { zone: CourseZone; contentId: string; title: string; image?: string; curMapX?: string; curMapY?: string }
) {
  return apiFetch<StampDto>("/api/stamps", {
    method: "POST",
    accessToken,
    body: JSON.stringify(dto),
  });
}

export async function getStampEligibility(accessToken: string, contentId: string, location?: { mapX: string; mapY: string }) {
  return apiFetch<StampEligibilityDto>("/api/stamps/eligibility", { accessToken, query: { contentId, curMapX: location?.mapX, curMapY: location?.mapY } });
}

export async function listStamps(accessToken: string, options: { zone?: CourseZone; order?: "asc" | "desc" } = {}) {
  return apiFetch<StampDto[]>("/api/stamps", {
    accessToken,
    query: options,
  });
}

export async function getStampProgress(accessToken: string) {
  return apiFetch<StampProgressDto>("/api/stamps/progress", {
    accessToken,
  });
}
