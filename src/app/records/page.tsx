"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Plus } from "lucide-react";
import sentimentCalmIcon from "@/asset/svgs/sentiment-calm.svg";
import wavesIcon from "@/asset/svgs/waves.svg";
import { MainShell } from "@/components/layout/MainShell";
import { Card, CardContent } from "@/components/ui/Card";
import { getDominantTravelProfile, getTravelProfileTheme, type TravelProfileMetric } from "@/lib/records-theme";
import { useRecordsPreviewStore } from "@/store/records-preview-store";
import { useAuthStore } from "@/store/auth-store";
import { getMeStats, getRecordTraits, getStampTraits, type MeStatsDto, type RecordTraitsDto } from "@/api/platform";
import type { CourseZone } from "@/types/course";

const travelProfileRows: TravelProfileMetric[] = [
  { label: "동해 바다", percent: 72 },
  { label: "설원·산악", percent: 22 },
  { label: "계곡·자연", percent: 66 },
  { label: "레트로·문화", percent: 17 },
  { label: "절경·포토", percent: 46 },
] as const;

const profileLabelByZone: Record<CourseZone, TravelProfileMetric["label"]> = {
  SEA: "동해 바다",
  SNOW: "설원·산악",
  VALLEY: "계곡·자연",
  RETRO: "레트로·문화",
  PHOTO: "절경·포토",
};

const previewSummary = {
  empty: [
    { label: "저장한 코스", value: "0", detail: "", href: "/course/saved" },
    { label: "완료한 스탬프", value: "0", detail: "", href: "/records/stamps" },
  ],
  populated: [
    { label: "저장한 코스", value: "12", detail: "이번 달 +3", href: "/course/saved" },
    { label: "완료한 스탬프", value: "18", detail: "이번 달 +6", href: "/records/stamps" },
  ],
} as const;

export default function RecordsPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);
  const hasRecords = useRecordsPreviewStore((state) => state.hasRecords);
  const setHasRecords = useRecordsPreviewStore((state) => state.setHasRecords);
  const [stats, setStats] = useState<MeStatsDto | null>(null);
  const [recordTraits, setRecordTraits] = useState<RecordTraitsDto | null>(null);
  const [stampTraits, setStampTraits] = useState<RecordTraitsDto["traits"] | null>(null);

  useEffect(() => {
    if (!hydrated || !accessToken) {
      setStats(null);
      setRecordTraits(null);
      setStampTraits(null);
      return;
    }

    Promise.all([getMeStats(accessToken), getRecordTraits(accessToken), getStampTraits(accessToken)])
      .then(([nextStats, nextRecordTraits, nextStampTraits]) => {
        setStats(nextStats);
        setRecordTraits(nextRecordTraits);
        setStampTraits(nextStampTraits.traits);
      })
      .catch(() => {
        // 화면의 상태 전환용 미리보기는 API 오류와 별개로 계속 사용할 수 있습니다.
      });
  }, [accessToken, hydrated]);

  const activeTraits = recordTraits?.traits.length ? recordTraits.traits : stampTraits;
  const profileRows = useMemo<TravelProfileMetric[]>(() => activeTraits?.map((trait) => ({ label: profileLabelByZone[trait.zone], percent: trait.percent })) ?? travelProfileRows, [activeTraits]);
  const summaryCards = useMemo(() => (hasRecords ? previewSummary.populated : previewSummary.empty).map((item) => {
    if (!stats) return item;
    return {
      ...item,
      value: item.label === "저장한 코스" ? String(stats.savedCoursesCount) : String(stats.stampsCount),
      detail: "",
    };
  }), [hasRecords, stats]);
  const dominantProfile = getDominantTravelProfile(profileRows);
  const dominantProfileTheme = dominantProfile ? getTravelProfileTheme(dominantProfile.label) : null;

  return (
    <MainShell mobileFooterHidden mobileHeaderHidden>
      <header className="relative flex h-[112px] items-center justify-center px-[34px] md:hidden">
        <Link aria-label="이전 페이지" className="absolute left-[34px] inline-flex h-10 w-10 items-center justify-center" href="/">
          <ArrowLeft className="h-6 w-6 text-[#111111]" strokeWidth={1.8} />
        </Link>
        <h1 className="text-[20px] font-semibold leading-[1.4] tracking-[-0.5px] text-[#111111]">나의 기록</h1>
      </header>

      <main className="mx-auto max-w-[1240px] px-[34px] pb-[112px] pt-[26px] md:px-4 md:py-[60px] lg:px-0">
        <section className="mx-auto max-w-[820px]">
          <Card className="h-auto rounded-2xl border-[#f1f1f5] shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)] lg:h-40">
            <CardContent className="grid gap-5 p-6 md:p-[19px] lg:grid-cols-[1fr_302px] lg:items-center">
              <div>
                <p className="text-[18px] font-semibold leading-[1.4] tracking-[-0.45px] text-[#ff1f4c]">나의 기록</p>
                <h2 className="mt-[14px] text-[24px] font-semibold leading-[1.4] tracking-[-0.6px] text-[#111111]">하영님의 여행 기록 보관함</h2>
                <p className="mt-[7px] text-[14px] leading-[1.4] tracking-[-0.35px] text-[#505050]">
                  여행 성향·저장한 코스·최근 완료 ·스탬프 진행도를
                  <br />
                  한번에 모아볼 수 있어요.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-[10px]">
                {summaryCards.map((item) => (
                  <Link
                    key={item.label}
                    className="relative h-[118px] w-[146px] rounded-2xl border border-[#f1f1f5] bg-white px-[19px] py-[16px] shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)] transition-transform hover:-translate-y-[1px] md:h-[100px] lg:h-[120px] lg:py-[19px]"
                    href={item.href}
                  >
                    <ChevronRight className="absolute right-[13px] top-[19px] h-5 w-5 text-[#505050]" strokeWidth={1.8} />
                    <p className="text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111111]">{item.label}</p>
                    {item.detail ? <p className="mt-1 text-[12px] leading-[1.4] tracking-[-0.3px] text-[#ff1f4c]">{item.detail}</p> : null}
                    <p className={`${item.detail ? "mt-[10px]" : "mt-[25px]"} text-[24px] font-semibold leading-[1.4] tracking-[-0.6px] text-[#ff1f4c]`}>{item.value}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mx-auto mt-[52px] max-w-[820px] md:mt-14">
          <h2 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111111]">나의 여행 성향</h2>

          {hasRecords ? (
            <Card className="mt-[18px] min-h-[468px] rounded-2xl border-[#f1f1f5] shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)] md:min-h-0">
              <CardContent className="grid gap-8 p-[28px] md:p-[23px] lg:grid-cols-[365px_1fr] lg:gap-5">
                <div>
                  <p className="text-[18px] font-semibold leading-[1.4] tracking-[-0.45px] text-[#111111]">하영님은</p>
                  <p className="mt-2 text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111111]">여유롭게 바다를 거닐며 충전하는 여행자</p>
                  <div className="mt-[21px] h-[153px] rounded-lg border border-[#f1f1f5] bg-white px-6 pt-9 shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)] md:h-[132px] md:pt-7">
                    <div className="flex items-center justify-center gap-[2px]">
                      <img alt="" aria-hidden="true" className="h-11 w-11 object-contain" src={wavesIcon.src} style={dominantProfileTheme ? { filter: dominantProfileTheme.iconFilter } : undefined} />
                      <img alt="" aria-hidden="true" className="h-11 w-11 object-contain" src={sentimentCalmIcon.src} style={dominantProfileTheme ? { filter: dominantProfileTheme.iconFilter } : undefined} />
                    </div>
                    <p className="mt-2 text-center text-[14px] font-semibold leading-[1.4] tracking-[-0.35px] text-[#111111]">조용한 바다 산책형</p>
                  </div>
                </div>

                <div className="space-y-2 lg:pt-[69px]">
                  {profileRows.map((row) => {
                    const theme = getTravelProfileTheme(row.label);

                    return (
                      <div key={row.label} className="grid grid-cols-[67px_1fr_34px] items-center gap-2">
                        <span className="text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111111]">{row.label}</span>
                        <div className="h-2 rounded-full bg-[#f1f1f5]">
                          <div className={`h-2 rounded-full ${theme.progressClassName}`} style={{ width: `${row.percent}%` }} />
                        </div>
                        <span className={`text-right text-[12px] font-bold leading-[1.4] tracking-[-0.3px] ${theme.textClassName}`}>{row.percent}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mt-[18px] h-[470px] rounded-2xl border-[#f1f1f5] shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)] md:h-[249px]">
              <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
                <p className="text-[14px] leading-[1.4] tracking-[-0.35px] text-[#505050]">
                  완료한 코스를 기반으로 나의 여행 성향이 정해져요.
                  <br />
                  코스를 먼저 생성해 주세요.
                </p>
                <Link className="mt-3 inline-flex h-8 items-center gap-1 rounded-full bg-[#ff1f4c] px-3 text-[14px] font-semibold leading-[1.4] tracking-[-0.35px] text-white" href="/course/create?step=1">
                  <Plus className="h-4 w-4" strokeWidth={2.4} />
                  코스 만들기
                </Link>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      <aside aria-label="나의 기록 미리보기 상태" className="fixed bottom-5 right-5 z-40 hidden rounded-xl border border-[#f1f1f5] bg-white p-1 shadow-[0px_2px_10px_rgba(17,17,17,0.12)] md:block">
        <div className="flex text-[12px] font-semibold tracking-[-0.3px]">
          <button className={`rounded-lg px-3 py-2 ${!hasRecords ? "bg-[#ffedf1] text-[#ff1f4c]" : "text-[#505050]"}`} onClick={() => setHasRecords(false)} type="button">기본</button>
          <button className={`rounded-lg px-3 py-2 ${hasRecords ? "bg-[#ffedf1] text-[#ff1f4c]" : "text-[#505050]"}`} onClick={() => setHasRecords(true)} type="button">데이터 있음</button>
        </div>
      </aside>
    </MainShell>
  );
}
