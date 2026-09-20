import { apiFetch } from "@/api/client";
import type { CourseDto, SavedCourseDto } from "@/types/course";

export async function createSavedCourse(accessToken: string, course: CourseDto, title?: string, travelDate?: string) {
  return apiFetch<SavedCourseDto>("/api/saved-courses", {
    method: "POST",
    accessToken,
    body: JSON.stringify({ course, title, travelDate }),
  });
}

export async function listSavedCourses(accessToken: string, status?: SavedCourseDto["status"]) {
  return apiFetch<SavedCourseDto[]>("/api/saved-courses", {
    accessToken,
    query: { status },
  });
}

export async function listUpcomingSavedCourses(accessToken: string, limit = 1) {
  return apiFetch<Array<SavedCourseDto & { daysUntil: number }>>("/api/saved-courses/upcoming", { accessToken, query: { limit } });
}

export async function getSavedCourse(accessToken: string, id: string) {
  return apiFetch<SavedCourseDto>(`/api/saved-courses/${encodeURIComponent(id)}`, {
    accessToken,
  });
}

export async function deleteSavedCourse(accessToken: string, id: string) {
  return apiFetch<{ deleted: boolean; id: string }>(`/api/saved-courses/${encodeURIComponent(id)}`, {
    method: "DELETE",
    accessToken,
  });
}

export async function startSavedCourse(accessToken: string, id: string) {
  return apiFetch<SavedCourseDto>(`/api/saved-courses/${encodeURIComponent(id)}/start`, { method: "PATCH", accessToken });
}

export async function completeSavedCourse(accessToken: string, id: string) {
  return apiFetch<SavedCourseDto>(`/api/saved-courses/${encodeURIComponent(id)}/complete`, { method: "PATCH", accessToken });
}

export async function replaceSavedCourseItem(accessToken: string, id: string, item: { day: number; order?: number; type?: "SPOT" | "MEAL" | "STAY"; contentId: string; title: string; mapX: string; mapY: string; address?: string; image?: string; zone?: CourseDto["zone"] }) {
  return apiFetch<SavedCourseDto>(`/api/saved-courses/${encodeURIComponent(id)}/items`, { method: "PATCH", accessToken, body: JSON.stringify(item) });
}
