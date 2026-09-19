"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Coffee, FlagTriangleRight, Trees } from "lucide-react";
import { MainShell } from "@/components/layout/MainShell";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { deleteSavedCourse, listSavedCourses } from "@/api/saved-courses";
import { useAuthStore } from "@/store/auth-store";
import { type SavedCourse, type SavedCourseStatus, useCourseStore } from "@/store/course-store";
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

const statusMeta: Record<SavedCourseStatus, { label: string; badgeClassName: string; iconClassName: string }> = {
  WAITING: { label: "대기중", badgeClassName: "bg-[#f4f4f4] text-[#505050]", iconClassName: "text-[#ffa346]" },
  IN_PROGRESS: { label: "진행중", badgeClassName: "bg-[#dff6e9] text-[#17863b]", iconClassName: "text-[#55cc4b]" },
  COMPLETED: { label: "완료", badgeClassName: "bg-[#ff1f4c] text-white", iconClassName: "text-[#bf43ed]" },
};

type MobileCourse = SavedCourse & { source: "api" | "preview" };

function StatusIcon({ status }: { status: SavedCourseStatus }) {
  const className = `h-7 w-7 shrink-0 ${statusMeta[status].iconClassName}`;

  if (status === "WAITING") return <Coffee className={className} strokeWidth={2.3} />;
  if (status === "IN_PROGRESS") return <Trees className={className} strokeWidth={2.3} />;
  return <FlagTriangleRight className={className} strokeWidth={2.3} />;
}

function SavedCourseMobileView({ courses }: { courses: MobileCourse[] }) {
  const [selectedStatus, setSelectedStatus] = useState<SavedCourseStatus>("WAITING");
  const filteredCourses = courses.filter((course) => course.status === selectedStatus);
  const upcomingCourse = courses.find((course) => course.status === "WAITING") ?? courses[0] ?? null;

  return (
    <div className="pb-[112px] md:hidden">
      <header className="relative flex h-[144px] items-center justify-center px-[34px]">
        <Link aria-label="나의 기록으로 돌아가기" className="absolute left-[34px] inline-flex h-10 w-10 items-center justify-center" href="/records">
          <ArrowLeft className="h-6 w-6 text-[#111111]" strokeWidth={1.8} />
        </Link>
        <h1 className="text-[28px] font-bold leading-[1.4] tracking-[-0.7px] text-[#111111]">저장한 코스</h1>
      </header>

      <main className="px-[34px] pt-[13px]">
        <div className="flex items-center gap-1 text-[14px] leading-[1.4] tracking-[-0.35px]">
          <Link className="text-[#767676]" href="/records">나의 기록</Link>
          <ChevronRight className="h-4 w-4 text-[#767676]" strokeWidth={2} />
          <span className="font-semibold text-[#111111]">저장한 코스</span>
        </div>

        <section className="mt-6">
          <h2 className="text-[22px] font-medium leading-[1.4] tracking-[-0.55px] text-[#111111]">다가오는 여행</h2>
          {upcomingCourse ? (
            <Link className="mt-3 flex min-h-[124px] items-center gap-3 rounded-[20px] border-2 border-[#ff1f4c] px-[22px] py-4 shadow-[0_4px_8px_rgba(17,17,17,0.08)]" href={`/course/saved?courseId=${encodeURIComponent(upcomingCourse.id)}`}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 items-center rounded-full bg-[#ff1f4c] px-3 text-[14px] font-medium text-white">{upcomingCourse.source === "preview" ? "D-6" : "예정"}</span>
                  <span className="truncate text-[14px] tracking-[-0.35px] text-[#111111]">{upcomingCourse.source === "preview" ? "2026.08.10 월요일 10:30" : `${upcomingCourse.date} 저장`}</span>
                </div>
                <p className="mt-2 truncate text-[18px] font-bold leading-[1.4] tracking-[-0.45px] text-[#111111]">{upcomingCourse.title}</p>
                <p className="mt-1 truncate text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111111]">{ZONE_LABEL[upcomingCourse.zone] ?? upcomingCourse.zone} · 장소 {upcomingCourse.spotCount}곳</p>
              </div>
              <ChevronRight className="h-7 w-7 shrink-0 text-[#505050]" strokeWidth={2} />
            </Link>
          ) : (
            <div className="mt-6 rounded-[28px] border border-[#f1f1f5] px-6 py-9 text-center text-[16px] text-[#767676]">다가오는 여행이 없어요.</div>
          )}
        </section>

        <section className="mt-[52px]">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <h2 className="mr-auto text-[20px] font-medium leading-[1.4] tracking-[-0.5px] text-[#111111]">저장한 코스 목록</h2>
            {(Object.keys(statusMeta) as SavedCourseStatus[]).map((status) => (
              <button
                key={status}
                className={`h-8 rounded-full border px-3 text-[14px] font-medium leading-[1.4] tracking-[-0.35px] ${selectedStatus === status ? "border-[#ff1f4c] text-[#ff1f4c]" : "border-[#e1e2ea] text-[#8a8a8a]"}`}
                onClick={() => setSelectedStatus(status)}
                type="button"
              >
                {statusMeta[status].label}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-[10px]">
            {filteredCourses.length ? filteredCourses.map((course) => {
              const meta = statusMeta[course.status];
              return (
                <Link key={course.id} className="flex min-h-[88px] items-center gap-3 rounded-[20px] border border-[#e1e2ea] px-5 py-3 shadow-[0_4px_8px_rgba(17,17,17,0.08)]" href={`/course/saved?courseId=${encodeURIComponent(course.id)}`}>
                  <StatusIcon status={course.status} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[16px] font-medium leading-[1.4] tracking-[-0.4px] text-[#111111]">{course.title}</p>
                      <span className={`shrink-0 rounded-full px-2 py-1 text-[12px] font-semibold leading-[1.4] tracking-[-0.3px] ${meta.badgeClassName}`}>{meta.label}</span>
                    </div>
                    <p className="mt-1 text-[14px] leading-[1.4] tracking-[-0.35px] text-[#767676]">{course.date} · 장소 {course.spotCount}곳</p>
                  </div>
                  <ChevronRight className="h-6 w-6 shrink-0 text-[#505050]" strokeWidth={2} />
                </Link>
              );
            }) : <p className="py-8 text-center text-[16px] text-[#767676]">{statusMeta[selectedStatus].label}인 코스가 없어요.</p>}
          </div>
        </section>
      </main>

    </div>
  );
}

export default function SavedCoursePage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  const previewCourses = useCourseStore((state) => state.savedCourses);

  const [courses, setCourses] = useState<SavedCourseDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const mobileCourses = useMemo<MobileCourse[]>(() => {
    if (courses?.length) {
      return courses.map((course) => ({
        id: course.id,
        title: course.title,
        date: formatDate(course.createdAt),
        spotCount: spotCountOf(course),
        status: "WAITING",
        zone: course.zone,
        source: "api",
      }));
    }

    return previewCourses.map((course) => ({ ...course, source: "preview" }));
  }, [courses, previewCourses]);

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
    <MainShell mobileFooterHidden mobileHeaderHidden>
      <SavedCourseMobileView courses={mobileCourses} />
      <div className="mx-auto hidden max-w-[1240px] justify-center px-4 py-[60px] md:flex lg:px-0">
        <div className="w-full max-w-[432px]">
          <nav aria-label="현재 위치" className="flex items-center gap-1 text-[14px] leading-[1.4] tracking-[-0.35px]">
            <Link className="text-[#767676] transition-colors hover:text-[#111111]" href="/records">나의 기록</Link>
            <ChevronRight className="h-4 w-4 text-[#767676]" strokeWidth={2} />
            <span className="font-semibold text-[#111111]">저장한 코스</span>
          </nav>
          <h1 className="mt-5 text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111111]">저장한 코스</h1>

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
