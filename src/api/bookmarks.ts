import { ApiError } from "@/api/client";

export type BookmarkType = "FESTIVAL" | "SPOT" | "COURSE";

export type BookmarkDto = {
  id: string;
  userId: string;
  targetType: BookmarkType;
  targetId: string;
  title: string;
  image: string | null;
  dDayDate: string | null;
  createdAt: string;
};

export type UpcomingBookmarkDto = BookmarkDto & { daysUntil: number };

async function parse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError(`Request failed: ${response.status}`, response.status, payload);
  }

  return payload as T;
}

export async function createBookmark(
  accessToken: string,
  dto: { targetType: BookmarkType; targetId: string; title: string; image?: string; dDayDate?: string }
) {
  const response = await fetch("/api/bookmarks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(dto),
    cache: "no-store",
  });

  return parse<BookmarkDto>(response);
}

export async function listBookmarks(accessToken: string, type?: BookmarkType) {
  const query = type ? `?type=${type}` : "";
  const response = await fetch(`/api/bookmarks${query}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  return parse<BookmarkDto[]>(response);
}

export async function listUpcomingBookmarks(accessToken: string, withinDays = 7) {
  const response = await fetch(`/api/bookmarks/upcoming?withinDays=${withinDays}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  return parse<UpcomingBookmarkDto[]>(response);
}

export async function deleteBookmark(accessToken: string, id: string) {
  const response = await fetch(`/api/bookmarks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  return parse<{ deleted: boolean; id: string }>(response);
}
