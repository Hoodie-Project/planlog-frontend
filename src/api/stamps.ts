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

export async function createStamp(
  accessToken: string,
  dto: { zone: CourseZone; contentId: string; title: string; image?: string }
) {
  return apiFetch<StampDto>("/api/stamps", {
    method: "POST",
    accessToken,
    body: JSON.stringify(dto),
  });
}

export async function listStamps(accessToken: string) {
  return apiFetch<StampDto[]>("/api/stamps", {
    accessToken,
  });
}

export async function getStampProgress(accessToken: string) {
  return apiFetch<StampProgressDto>("/api/stamps/progress", {
    accessToken,
  });
}
