import { ApiError } from "@/api/client";
import type { CourseDto, SavedCourseDto } from "@/types/course";

async function parse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError(`Request failed: ${response.status}`, response.status, payload);
  }

  return payload as T;
}

export async function createSavedCourse(accessToken: string, course: CourseDto, title?: string) {
  const response = await fetch("/api/saved-courses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ course, title }),
    cache: "no-store",
  });

  return parse<SavedCourseDto>(response);
}

export async function listSavedCourses(accessToken: string) {
  const response = await fetch("/api/saved-courses", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  return parse<SavedCourseDto[]>(response);
}

export async function getSavedCourse(accessToken: string, id: string) {
  const response = await fetch(`/api/saved-courses/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  return parse<SavedCourseDto>(response);
}

export async function deleteSavedCourse(accessToken: string, id: string) {
  const response = await fetch(`/api/saved-courses/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  return parse<{ deleted: boolean; id: string }>(response);
}
