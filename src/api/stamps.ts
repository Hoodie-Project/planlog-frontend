import { ApiError } from "@/api/client";
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

async function parse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError(`Request failed: ${response.status}`, response.status, payload);
  }

  return payload as T;
}

export async function createStamp(
  accessToken: string,
  dto: { zone: CourseZone; contentId: string; title: string; image?: string }
) {
  const response = await fetch("/api/stamps", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(dto),
    cache: "no-store",
  });

  return parse<StampDto>(response);
}

export async function listStamps(accessToken: string) {
  const response = await fetch("/api/stamps", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  return parse<StampDto[]>(response);
}

export async function getStampProgress(accessToken: string) {
  const response = await fetch("/api/stamps/progress", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  return parse<StampProgressDto>(response);
}
