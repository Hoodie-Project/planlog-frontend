import { apiFetch } from "@/api/client";

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

export async function createBookmark(
  accessToken: string,
  dto: { targetType: BookmarkType; targetId: string; title: string; image?: string; dDayDate?: string }
) {
  return apiFetch<BookmarkDto>("/api/bookmarks", {
    method: "POST",
    accessToken,
    body: JSON.stringify(dto),
  });
}

export async function listBookmarks(accessToken: string, type?: BookmarkType) {
  return apiFetch<BookmarkDto[]>("/api/bookmarks", {
    accessToken,
    query: { type },
  });
}

export async function listUpcomingBookmarks(accessToken: string, withinDays = 7) {
  return apiFetch<UpcomingBookmarkDto[]>("/api/bookmarks/upcoming", {
    accessToken,
    query: { withinDays },
  });
}

export async function deleteBookmark(accessToken: string, id: string) {
  return apiFetch<{ deleted: boolean; id: string }>(`/api/bookmarks/${encodeURIComponent(id)}`, {
    method: "DELETE",
    accessToken,
  });
}
