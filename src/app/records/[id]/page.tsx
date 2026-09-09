"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MainShell } from "@/components/layout/MainShell";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ApiError } from "@/api/client";
import { getSavedCourse } from "@/api/saved-courses";
import { createStamp, listStamps, type StampDto } from "@/api/stamps";
import { useAuthStore } from "@/store/auth-store";
import type { SavedCourseDto } from "@/types/course";

const ZONE_LABEL: Record<string, string> = {
  SEA: "동해 바다존",
  SNOW: "설원·산악존",
  VALLEY: "계곡·자연존",
  RETRO: "레트로·문화존",
  PHOTO: "절경·포토존",
};

export default function RecordDetailPage() {
  const params = useParams<{ id: string }>();
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);

  const [course, setCourse] = useState<SavedCourseDto | null>(null);
  const [stamps, setStamps] = useState<StampDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [stampingId, setStampingId] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated || !accessToken || !params.id) return;

    Promise.all([getSavedCourse(accessToken, params.id), listStamps(accessToken)])
      .then(([courseRes, stampsRes]) => {
        setCourse(courseRes);
        setStamps(stampsRes);
      })
      .catch((err) => {
        setError(err instanceof ApiError && err.status === 404 ? "기록을 찾을 수 없어요." : "기록을 불러오지 못했습니다.");
      });
  }, [accessToken, hydrated, params.id]);

  const handleStamp = async (spot: { contentId: string; title: string; zone?: string | null; image?: string }) => {
    if (!accessToken || !course) return;
    const zone = spot.zone ?? course.zone;
    setStampingId(spot.contentId);
    try {
      const stamp = await createStamp(accessToken, {
        zone: zone as SavedCourseDto["zone"],
        contentId: spot.contentId,
        title: spot.title,
        image: spot.image,
      });
      setStamps((prev) => (prev.some((s) => s.contentId === stamp.contentId) ? prev : [stamp, ...prev]));
    } catch {
      setError("스탬프 획득에 실패했습니다.");
    } finally {
      setStampingId(null);
    }
  };

  if (hydrated && !accessToken) {
    return (
      <MainShell>
        <div className="mx-auto max-w-6xl px-6 py-12 text-center text-slate-600">로그인 후 이용할 수 있어요.</div>
      </MainShell>
    );
  }

  if (error) {
    return (
      <MainShell>
        <div className="mx-auto max-w-6xl px-6 py-12 text-center text-slate-600">{error}</div>
      </MainShell>
    );
  }

  if (!course) {
    return (
      <MainShell>
        <div className="mx-auto max-w-6xl px-6 py-12 text-center text-slate-500">불러오는 중...</div>
      </MainShell>
    );
  }

  const spots = course.payload.days.flatMap((day) => day.items.filter((item) => item.type === "SPOT"));
  const stampedIds = new Set(stamps.map((s) => s.contentId));
  const createdDate = new Date(course.createdAt);
  const dateLabel = `${createdDate.getFullYear()}.${String(createdDate.getMonth() + 1).padStart(2, "0")}.${String(createdDate.getDate()).padStart(2, "0")}`;

  return (
    <MainShell>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-semibold">기록 카드 상세</h1>
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="bg-slate-950 text-slate-50">
            <CardHeader>
              <CardTitle>공유용 이미지 카드</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>PLANLOG</p>
              <p>{dateLabel}</p>
              <p className="text-xl font-semibold">{course.title}</p>
              <p>
                {ZONE_LABEL[course.zone] ?? course.zone} · 장소 {spots.length}곳
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>여행 요약</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {[
                  `방문 장소 ${spots.length}곳`,
                  `획득 스탬프 ${spots.filter((s) => stampedIds.has(s.contentId)).length}개`,
                  `${course.nights === 0 ? "당일치기" : `${course.nights}박${course.nights + 1}일`}`,
                  `총 이동거리 ${(course.payload.totalDistance / 1000).toFixed(1)}km`,
                ].map((item) => (
                  <div key={item} className="rounded-lg border p-4">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>방문 장소 · 스탬프</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {spots.map((spot) => {
                  const stamped = stampedIds.has(spot.contentId);
                  return (
                    <div key={spot.contentId} className="flex items-center justify-between gap-3 rounded-lg border p-4">
                      <span>
                        {spot.title} · {spot.arriveTime}
                      </span>
                      <Button
                        className="h-9 shrink-0 rounded-lg px-4 text-sm"
                        disabled={stamped || stampingId === spot.contentId}
                        onClick={() => handleStamp(spot)}
                        variant={stamped ? "secondary" : "default"}
                      >
                        {stamped ? "스탬프 획득함" : stampingId === spot.contentId ? "저장 중..." : "스탬프 찍기"}
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainShell>
  );
}
