import { Suspense } from "react";
import { CourseCreateFlow } from "@/components/course-create/CourseCreateFlow";

export default function CourseCreatePage() {
  return (
    <Suspense fallback={null}>
      <CourseCreateFlow />
    </Suspense>
  );
}
