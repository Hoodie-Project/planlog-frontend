import { ApiError } from "@/api/client";
import type { CourseDto, CreateCourseRequest } from "@/types/course";

export async function generateCourse(payload: CreateCourseRequest) {
  const response = await fetch("/api/courses/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await response.text();
  const responsePayload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError(`Request failed: ${response.status}`, response.status, responsePayload);
  }

  return responsePayload as CourseDto;
}
