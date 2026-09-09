"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { MainShell } from "@/components/layout/MainShell";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { deleteSavedCourse, listSavedCourses } from "@/api/saved-courses";
import { useAuthStore } from "@/store/auth-store";
import type { SavedCourseDto } from "@/types/course";

const ZONE_LABEL: Record<string, string> = {
  SEA: "동해 바다존",
  SNOW: "설원·산악존",
  VALLEY: "계곡·자연존",
  RETRO: "레트로·문화존",
  PHOTO: "절경·포토존",
};

function spotCountOf(course: SavedCourseDto) {
  return course.payload.days.reduce((sum, day) => sum + day.items.filter((item) => item.type === "SPOT").length, 0);
}

function formatDate(iso: string) {
  const date = new Date(iso);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export default function SavedCoursePage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);

  const [courses, setCourses] = useState<SavedCourseDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (!accessToken) {
      setCourses(null);
      return;
    }

    listSavedCourses(accessToken)
      .then(setCourses)
      .catch(() => {
        setError("저장한 코스를 불러오지 못했습니다.");
        setCourses([]);
      });
  }, [accessToken, hydrated]);

  const handleRemove = async (id: string) => {
    if (!accessToken) return;
    setRemovingId(id);
    try {
      await deleteSavedCourse(accessToken, id);
      setCourses((prev) => prev?.filter((c) => c.id !== id) ?? null);
    } catch {
      setError("코스 삭제에 실패했습니다.");
    } finally {
      setRemovingId(null);
    }
  };

  if (hydrated && !accessToken) {
    return (
      <MainShell>
        <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-4 px-4 py-[80px] text-center">
          <h1 className="text-[24px] font-bold text-[#111111]">저장한 코스</h1>
          <p className="text-[15px] text-[#767676]">로그인하면 저장한 코스를 확인할 수 있어요.</p>
          <Button
            className="h-11 rounded-[14px] bg-[#f30031] px-6 text-[16px] font-semibold hover:bg-[#df032f]"
            onClick={() => openLoginModal("protected-route")}
          >
            로그인하기
          </Button>
        </div>
      </MainShell>
    );
  }

  const latest = courses?.[0] ?? null;
  const rest = courses?.slice(1) ?? [];

  return (
    <MainShell>
      <div className="mx-auto flex max-w-[1240px] justify-center px-4 py-[60px] lg:px-0">
        <div className="w-full max-w-[432px]">
          <h1 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111111]">저장한 코스</h1>

          {error ? <p className="mt-4 text-[14px] text-[#f30031]">{error}</p> : null}

          {courses === null ? (
            <p className="mt-8 text-[14px] text-[#767676]">불러오는 중...</p>
          ) : courses.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-[#f1f1f5] bg-white px-6 py-10 text-center">
              <p className="text-[15px] text-[#767676]">아직 저장한 코스가 없어요.</p>
              <Button asChild className="mt-4 h-11 rounded-[14px] bg-[#f30031] px-6 text-[15px] font-semibold hover:bg-[#df032f]">
                <Link href="/course/create?step=1">코스 만들러 가기</Link>
              </Button>
            </div>
          ) : (
            <>
              {latest ? (
                <section className="mt-[34px]">
                  <p className="text-[16px] leading-[1.4] tracking-[-0.4px] text-[#111111]">최근 저장한 코스</p>

                  <Card className="mt-4 rounded-2xl border-[#FF1F4C] shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)]">
                    <CardContent className="flex items-center gap-3 p-5">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-[6px]">
                          <span className="inline-flex h-6 items-center rounded-full bg-[#FF1F4C] px-2 text-[12px] font-semibold leading-[1.4] tracking-[-0.3px] text-white">
                            {ZONE_LABEL[latest.zone] ?? latest.zone}
                          </span>
                          <span className="text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111111]">{formatDate(latest.createdAt)}</span>
                        </div>

                        <p className="mt-2 pl-[2px] text-[18px] font-semibold leading-[1.4] tracking-[-0.45px] text-[#111111]">{latest.title}</p>

                        <div className="mt-1 flex items-center gap-[6px] pl-[2px] text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111111]">
                          <span>장소 {spotCountOf(latest)}곳</span>
                          <span className="h-[10px] w-px rounded-[9px] bg-[#999999]" />
                          <span>{latest.nights === 0 ? "당일치기" : `${latest.nights}박${latest.nights + 1}일`}</span>
                        </div>
                      </div>

                      <button
                        className="text-[12px] text-[#999999] underline disabled:opacity-50"
                        disabled={removingId === latest.id}
                        onClick={() => handleRemove(latest.id)}
                        type="button"
                      >
                        삭제
                      </button>
                    </CardContent>
                  </Card>
                </section>
              ) : null}

              {rest.length > 0 ? (
                <section className="mt-[52px]">
                  <p className="text-[16px] leading-[1.4] tracking-[-0.4px] text-[#111111]">저장한 코스 목록</p>

                  <div className="mt-4 space-y-[10px]">
                    {rest.map((course) => (
                      <Card key={course.id} className="rounded-2xl border-[#F1F1F5] shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)]">
                        <CardContent className="flex items-center justify-between gap-3 px-[19px] py-[19px]">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-[14px] font-semibold leading-[1.4] text-[#111111]">{course.title}</p>
                              <span className="text-[12px] leading-[1.4] tracking-[-0.3px] text-[#111111]">{formatDate(course.createdAt)}</span>
                              <span className="h-[10px] w-px rounded-[9px] bg-[#999999]" />
                              <span className="text-[12px] leading-[1.4] tracking-[-0.3px] text-[#111111]">장소 {spotCountOf(course)}곳</span>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-3">
                            <button
                              className="text-[12px] text-[#999999] underline disabled:opacity-50"
                              disabled={removingId === course.id}
                              onClick={() => handleRemove(course.id)}
                              type="button"
                            >
                              삭제
                            </button>
                            <ChevronRight className="h-5 w-5 text-[#999999]" strokeWidth={1.8} />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              ) : null}
            </>
          )}
        </div>
      </div>
    </MainShell>
  );
}
