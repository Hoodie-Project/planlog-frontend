import { MainShell } from "@/components/layout/main-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { savedCourses } from "@/lib/mock-data";

export default function SavedCoursePage() {
  const [upcoming, ...rest] = savedCourses;

  return (
    <MainShell>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="mb-6 text-3xl font-semibold">저장한 코스</h1>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>다가오는 여행</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm font-medium text-cyan-700">{upcoming.dday}</p>
            <p className="text-xl font-semibold">{upcoming.title}</p>
            <p className="text-slate-600">{upcoming.meta}</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {rest.map((course) => (
            <Card key={course.title}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="font-semibold">{course.title}</p>
                  <p className="text-sm text-slate-500">{course.meta}</p>
                </div>
                <p className="text-sm text-slate-500">상세 보기</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainShell>
  );
}

