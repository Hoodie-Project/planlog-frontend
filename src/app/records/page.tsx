"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import sentimentCalmIcon from "@/asset/svgs/sentiment-calm.svg";
import wavesIcon from "@/asset/svgs/waves.svg";
import { MainShell } from "@/components/layout/MainShell";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { listSavedCourses } from "@/api/saved-courses";
import { getStampProgress, listStamps, type StampProgressDto } from "@/api/stamps";
import { useAuthStore } from "@/store/auth-store";
import { getDominantTravelProfile, getRecordTagTheme, getTravelProfileTheme, type RecordTagKey, type TravelProfileMetric } from "@/lib/records-theme";
import type { CourseZone, SavedCourseDto } from "@/types/course";

const ZONE_TO_PROFILE_LABEL: Record<CourseZone, TravelProfileMetric["label"]> = {
  SEA: "동해 바다",
  SNOW: "설원·산악",
  VALLEY: "계곡·자연",
  RETRO: "레트로·문화",
  PHOTO: "절경·포토",
};

const ZONE_TO_TAG: Record<CourseZone, RecordTagKey> = {
  SEA: "바다",
  SNOW: "산악",
  VALLEY: "자연",
  RETRO: "문화",
  PHOTO: "포토",
};

function formatDate(iso: string) {
  const date = new Date(iso);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function spotCountOf(course: SavedCourseDto) {
  return course.payload.days.reduce((sum, day) => sum + day.items.filter((item) => item.type === "SPOT").length, 0);
}

export default function RecordsPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);
  const user = useAuthStore((state) => state.user);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);

  const [courses, setCourses] = useState<SavedCourseDto[] | null>(null);
  const [progress, setProgress] = useState<StampProgressDto | null>(null);
  const [stampedContentIds, setStampedContentIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!hydrated || !accessToken) return;

    Promise.all([listSavedCourses(accessToken), getStampProgress(accessToken), listStamps(accessToken)])
      .then(([coursesRes, progressRes, stampsRes]) => {
        setCourses(coursesRes);
        setProgress(progressRes);
        setStampedContentIds(new Set(stampsRes.map((s) => s.contentId)));
      })
      .catch(() => {
        setCourses([]);
      });
  }, [accessToken, hydrated]);

  if (hydrated && !accessToken) {
    return (
      <MainShell>
        <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-4 px-4 py-[80px] text-center">
          <h1 className="text-[24px] font-bold text-[#111111]">나의 기록</h1>
          <p className="text-[15px] text-[#767676]">로그인하면 나의 여행 기록을 볼 수 있어요.</p>
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

  const totalStamps = progress?.totalStamps ?? 0;
  const travelProfileRows: TravelProfileMetric[] =
    progress?.zones.map((z) => ({
      label: ZONE_TO_PROFILE_LABEL[z.zone as CourseZone],
      percent: totalStamps > 0 ? Math.round((z.stampCount / totalStamps) * 100) : 0,
    })) ?? [];

  const summaryCards = [
    { label: "저장한 코스", value: String(courses?.length ?? 0), detail: "", href: "/course/saved" },
    { label: "기록 카드", value: String(courses?.length ?? 0), detail: "", href: "/records" },
    { label: "완료한 스탬프", value: String(totalStamps), detail: progress?.completed ? "5존 완주!" : "", href: "/records" },
  ];

  const recentCards = (courses ?? []).slice(0, 3);
  const dominantProfile = getDominantTravelProfile(travelProfileRows);
  const dominantProfileTheme = dominantProfile ? getTravelProfileTheme(dominantProfile.label) : null;

  return (
    <MainShell>
      <div className="mx-auto max-w-[1240px] px-4 py-[60px] lg:px-0">
        <section className="mx-auto max-w-[820px]">
          <Card className="rounded-2xl border-[#f1f1f5] shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)]">
            <CardContent className="grid gap-5 p-[19px] lg:grid-cols-[1fr_454px] lg:items-center">
              <div className="space-y-3">
                <p className="text-[18px] font-semibold leading-[1.4] tracking-[-0.45px] text-[#ff1f4c]">나의 기록</p>
                <div className="space-y-2">
                  <h1 className="text-[24px] font-semibold leading-[1.4] tracking-[-0.6px] text-[#111111]">
                    {user?.nickname ?? "게스트"}님의 여행 기록 보관함
                  </h1>
                  <p className="text-[14px] leading-[1.4] tracking-[-0.35px] text-[#505050]">
                    여행 성향·저장한 코스·최근 기록 ·스탬프 진행도를
                    <br />
                    한번에 모아볼 수 있어요.
                  </p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                {summaryCards.map((item) => (
                  <Link
                    key={item.label}
                    className="relative block rounded-2xl border border-[#f1f1f5] bg-white px-[21px] py-[19px] shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)] transition-transform hover:-translate-y-[1px]"
                    href={item.href}
                  >
                    <ChevronRight className="absolute right-[13px] top-[19px] h-5 w-5 text-[#999999]" strokeWidth={1.8} />
                    <p className="text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111111]">{item.label}</p>
                    <p className="mt-1 text-[12px] leading-[1.4] tracking-[-0.3px] text-[#ff1f4c]">{item.detail}</p>
                    <p className="mt-[10px] text-[24px] font-semibold leading-[1.4] tracking-[-0.6px] text-[#ff1f4c]">{item.value}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mx-auto mt-16 grid max-w-[820px] gap-5 lg:grid-cols-[432px_368px]">
          <div className="space-y-5">
            <h2 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111111]">나의 여행 성향</h2>

            <Card className="rounded-2xl border-[#f1f1f5] shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)]">
              <CardContent className="p-[21px]">
                <p className="text-[18px] font-semibold leading-[1.4] tracking-[-0.45px] text-[#111111]">{user?.nickname ?? "게스트"}님은</p>
                <p className="mt-2 text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111111]">
                  {dominantProfile ? `${dominantProfile.label} 감성을 가장 좋아하는 여행자` : "아직 스탬프를 모으지 않았어요"}
                </p>

                <div className="mt-5 rounded-lg border border-[#f1f1f5] bg-white px-6 py-6 shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)]">
                  <div className="flex items-center justify-center gap-[2px]">
                    <img
                      alt=""
                      aria-hidden="true"
                      className="h-11 w-11 object-contain"
                      src={wavesIcon.src}
                      style={dominantProfileTheme ? { filter: dominantProfileTheme.iconFilter } : undefined}
                    />
                    <img
                      alt=""
                      aria-hidden="true"
                      className="h-11 w-11 object-contain"
                      src={sentimentCalmIcon.src}
                      style={dominantProfileTheme ? { filter: dominantProfileTheme.iconFilter } : undefined}
                    />
                  </div>
                  <p className="mt-3 text-center text-[14px] font-semibold leading-[1.4] tracking-[-0.35px] text-[#111111]">
                    {dominantProfile ? `${dominantProfile.label}형 여행자` : "여행을 기록해보세요"}
                  </p>
                </div>

                <div className="mt-7 space-y-[10px]">
                  {travelProfileRows.map((row) => (
                    <div key={row.label} className="grid grid-cols-[67px_1fr_34px] items-center gap-[10px]">
                      {(() => {
                        const theme = getTravelProfileTheme(row.label);

                        return (
                          <>
                            <span className="text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111111]">{row.label}</span>
                            <div className="h-2 rounded-full bg-[#f1f1f5]">
                              <div className={`h-2 rounded-full ${theme.progressClassName}`} style={{ width: `${row.percent}%` }} />
                            </div>
                            <span className={`text-right text-[12px] leading-[1.4] tracking-[-0.3px] ${theme.textClassName}`}>{row.percent}%</span>
                          </>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111111]">최근 기록 카드</h2>
              <Link className="inline-flex items-center gap-1 text-[14px] font-semibold leading-[1.4] tracking-[-0.35px] text-[#505050]" href="/course/saved">
                전체({courses?.length ?? 0})
                <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
              </Link>
            </div>

            {courses === null ? (
              <p className="text-[14px] text-[#767676]">불러오는 중...</p>
            ) : recentCards.length === 0 ? (
              <p className="text-[14px] text-[#767676]">아직 저장한 코스가 없어요. 코스를 만들고 저장해보세요.</p>
            ) : (
              <div className="space-y-[17px]">
                {recentCards.map((course) => {
                  const tag = ZONE_TO_TAG[course.zone];
                  const tagTheme = getRecordTagTheme(tag);
                  const spots = course.payload.days.flatMap((day) => day.items.filter((item) => item.type === "SPOT"));
                  const stampedCount = spots.filter((s) => stampedContentIds.has(s.contentId)).length;

                  return (
                    <Link key={course.id} className="block" href={`/records/${course.id}`}>
                      <Card className="rounded-2xl border-[#f1f1f5] shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)] transition-transform hover:-translate-y-[1px]">
                        <CardContent className="flex items-start justify-between gap-4 p-5">
                          <div className="min-w-0 space-y-2">
                            <div className="flex items-center gap-[7px]">
                              <span
                                className={`inline-flex h-6 items-center rounded-full px-2 text-[12px] font-semibold leading-[1.4] tracking-[-0.3px] ${tagTheme.chipBackgroundClassName} ${tagTheme.chipTextClassName}`}
                              >
                                {tag}
                              </span>
                              <span className="text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111111]">{formatDate(course.createdAt)}</span>
                            </div>
                            <p className="text-[18px] font-semibold leading-[1.4] tracking-[-0.45px] text-[#111111]">{course.title}</p>
                            <div className="flex items-center gap-[6px] text-[14px] leading-[1.4] tracking-[-0.35px] text-[#ff1f4c]">
                              <span>방문 장소 {spots.length}곳</span>
                              <span className="h-[10px] w-px rounded-[9px] bg-[#999999]" />
                              <span>스탬프 {stampedCount}/{spots.length}</span>
                            </div>
                          </div>

                          <ChevronRight className="mt-1 h-6 w-6 shrink-0 text-[#999999]" strokeWidth={1.8} />
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </MainShell>
  );
}
