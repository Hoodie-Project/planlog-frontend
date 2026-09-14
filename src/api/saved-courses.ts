import { apiFetch } from "@/api/client";
import type { CourseDto, SavedCourseDto } from "@/types/course";

export async function createSavedCourse(accessToken: string, course: CourseDto, title?: string) {
  return apiFetch<SavedCourseDto>("/api/saved-courses", {
    method: "POST",
    accessToken,
    body: JSON.stringify({ course, title }),
  });
}

export async function listSavedCourses(accessToken: string) {
  return apiFetch<SavedCourseDto[]>("/api/saved-courses", {
    accessToken,
  });
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
