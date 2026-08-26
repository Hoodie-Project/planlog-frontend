import Link from "next/link";
import { ChevronRight } from "lucide-react";
import sentimentCalmIcon from "@/asset/svgs/sentiment-calm.svg";
import wavesIcon from "@/asset/svgs/waves.svg";
import { MainShell } from "@/components/layout/MainShell";
import { Card, CardContent } from "@/components/ui/Card";
import { recordsArchiveCards, recordsSummaryCards } from "@/lib/mock-data";
import { getDominantTravelProfile, getRecordTagTheme, getTravelProfileTheme, type RecordTagKey, type TravelProfileMetric } from "@/lib/records-theme";

const recordTags = [
  "바다",
  "산악",
  "자연",
  "문화",
  "포토",
] as const;

const travelProfileRows: TravelProfileMetric[] = [
  { label: "동해 바다", percent: 72 },
  { label: "설원·산악", percent: 22 },
  { label: "계곡·자연", percent: 66 },
  { label: "레트로·문화", percent: 17 },
  { label: "절경·포토", percent: 46 },
] as const;

export default function RecordsPage() {
  const summaryCards = [
    { ...recordsSummaryCards[0], href: "/course/saved" },
    { ...recordsSummaryCards[2], href: "/records" },
    { ...recordsSummaryCards[1], href: "/records" },
  ];
  const recentCards = recordsArchiveCards.slice(0, 3);
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
                  <h1 className="text-[24px] font-semibold leading-[1.4] tracking-[-0.6px] text-[#111111]">하영님의 여행 기록 보관함</h1>
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
                <p className="text-[18px] font-semibold leading-[1.4] tracking-[-0.45px] text-[#111111]">하영님은</p>
                <p className="mt-2 text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111111]">여유롭게 바다를 거닐며 충전하는 여행자</p>

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
                  <p className="mt-3 text-center text-[14px] font-semibold leading-[1.4] tracking-[-0.35px] text-[#111111]">조용한 바다 산책형</p>
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
              <button className="inline-flex items-center gap-1 text-[14px] font-semibold leading-[1.4] tracking-[-0.35px] text-[#505050]" type="button">
                전체({recentCards.length})
                <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>

            <div className="space-y-[17px]">
              {recentCards.map((record, index) => {
                const tag = (recordTags[index] ?? recordTags[0]) as RecordTagKey;
                const tagTheme = getRecordTagTheme(tag);

                return (
                  <Link key={record.id} className="block" href={`/records/${record.id}`}>
                    <Card className="rounded-2xl border-[#f1f1f5] shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)] transition-transform hover:-translate-y-[1px]">
                      <CardContent className="flex items-start justify-between gap-4 p-5">
                        <div className="min-w-0 space-y-2">
                          <div className="flex items-center gap-[7px]">
                            <span
                              className={`inline-flex h-6 items-center rounded-full px-2 text-[12px] font-semibold leading-[1.4] tracking-[-0.3px] ${tagTheme.chipBackgroundClassName} ${tagTheme.chipTextClassName}`}
                            >
                              {tag}
                            </span>
                            <span className="text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111111]">{record.date}</span>
                          </div>
                          <p className="text-[18px] font-semibold leading-[1.4] tracking-[-0.45px] text-[#111111]">{record.title}</p>
                          <div className="flex items-center gap-[6px] text-[14px] leading-[1.4] tracking-[-0.35px] text-[#ff1f4c]">
                            <span>방문 장소 4곳</span>
                            <span className="h-[10px] w-px rounded-[9px] bg-[#999999]" />
                            <span>{record.stamps}</span>
                          </div>
                        </div>

                        <ChevronRight className="mt-1 h-6 w-6 shrink-0 text-[#999999]" strokeWidth={1.8} />
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </MainShell>
  );
}
