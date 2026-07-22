import { apiFetch } from "@/api/client";
import type { CourseDto, CreateCourseRequest } from "@/types/course";

export async function generateCourse(payload: CreateCourseRequest) {
  return apiFetch<CourseDto>("/api/courses/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

