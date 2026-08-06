"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MainShell } from "@/components/layout/MainShell";
import { RouteMapMock, SectionPanel, TimelineList } from "@/components/mock-pages/MockPageShared";
import { Button } from "@/components/ui/Button";
import { toCourseResultView } from "@/lib/course-create";
import {
  courseFeedbackOptions,
  companionEmotionNotes,
  currentCourse,
  recommendedAccommodations,
  recommendedCourseReasons,
  recommendedCourseTags,
} from "@/lib/mock-data";
import { useCourseStore } from "@/store/course-store";

type ManualStayForm = {
  name: string;
  address: string;
};

export default function CourseResultPage() {
  const generatedCourse = useCourseStore((state) => state.generatedCourse);
  const resultView = generatedCourse ? toCourseResultView(generatedCourse) : currentCourse;

  const [selectedStayId, setSelectedStayId] = useState<string | null>(null);
  const [confirmStayId, setConfirmStayId] = useState<string | null>(null);
  const [manualStayOpen, setManualStayOpen] = useState(false);
  const [manualStayForm, setManualStayForm] = useState<ManualStayForm>({ name: "", address: "" });

  const selectedStay = useMemo(() => {
    if (selectedStayId === "manual") {
      return manualStayForm.name ? { title: manualStayForm.name, area: manualStayForm.address } : null;
    }

    return recommendedAccommodations.find((item) => item.id === selectedStayId) ?? null;
  }, [manualStayForm.address, manualStayForm.name, selectedStayId]);

  const timelineItems = resultView.timeline.map((item, index) => ({
    name: item.name,
    time: item.time,
    category: item.meta,
    active: index === 0,
    done: index === resultView.timeline.length - 1,
  }));

  const handleManualStaySubmit = () => {
    if (!manualStayForm.name.trim() || !manualStayForm.address.trim()) {
      return;
    }

    setSelectedStayId("manual");
    setManualStayOpen(false);
  };

  return (
    <MainShell>
      <div className="mx-auto max-w-[1240px] px-4 py-10 lg:px-0">
        <section className="rounded-[24px] border border-[#efe8dc] bg-[#fffcf7] px-8 py-7 shadow-[0_10px_30px_rgba(17,17,17,0.04)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {recommendedCourseTags.map((tag) => (
                  <span key={tag} className="text-[15px] font-semibold tracking-[-0.35px] text-[#f30031]">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="space-y-2">
                <h1 className="text-[44px] font-extrabold leading-[1.25] tracking-[-1px] text-slate-900">{resultView.title}</h1>
                <p className="text-[18px] leading-[1.5] tracking-[-0.4px] text-slate-600">{resultView.summary}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="h-11 rounded-[14px] bg-[#f30031] px-6 text-[16px] font-semibold hover:bg-[#df032f]">저장하기</Button>
              <Button
                className="h-11 rounded-[14px] border border-[#e8dfd3] bg-white px-6 text-[16px] font-semibold text-slate-900 hover:bg-[#faf6ef]"
                variant="outline"
              >
                다시 추천받기
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <RouteMapMock
              compact
              summaryLines={
                <>
                  강릉역 → 오죽헌 → 중앙시장
                  <br />→ 안목해변 → 주문진 등대
                </>
              }
            />
            <SectionPanel className="mt-0 rounded-t-none border-t-0" contentClassName="px-6 pb-6 pt-6">
              <div className="mt-6 grid grid-cols-4 gap-4">
                {Object.entries(resultView.stats).map(([key, value]) => (
                  <div key={key} className="border-r border-[#ebe3d8] pr-3 last:border-r-0 last:pr-0">
                    <p className="text-[14px] tracking-[-0.35px] text-slate-500">{key}</p>
                    <p className={`mt-2 text-[18px] font-bold tracking-[-0.45px] ${key === "혼잡도" ? "text-[#f30031]" : "text-slate-900"}`}>{value}</p>
                  </div>
                ))}
              </div>
            </SectionPanel>
          </div>

          <div>
            <TimelineList items={timelineItems} title="일정표" />
            <SectionPanel className="mt-0 rounded-t-none border-t-0" contentClassName="px-6 pb-6 pt-2">
              <div className="rounded-[18px] border border-[#efe8dc] bg-[#fffcf7] px-5 py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[20px] font-bold tracking-[-0.45px] text-slate-900">18:00 숙소 체크인</p>
                    <p className="mt-1 text-[15px] tracking-[-0.35px] text-slate-500">
                      {selectedStay ? `${selectedStay.title} · ${selectedStay.area}` : "감성힐링 숙소 권장"}
                    </p>
                  </div>
                  <Button
                    className="h-10 rounded-[12px] bg-[#f30031] px-5 text-[15px] font-semibold hover:bg-[#df032f]"
                    onClick={() => setManualStayOpen(true)}
                  >
                    숙소 입력하기
                  </Button>
                </div>
              </div>

              <Button
                asChild
                className="mt-4 h-12 w-full rounded-[14px] border border-[#e8dfd3] bg-white text-[16px] font-semibold text-slate-900 hover:bg-[#faf6ef]"
                variant="outline"
              >
                <Link href="/course/saved">코스 상세 보기</Link>
              </Button>
            </SectionPanel>
          </div>
        </section>

        <SectionPanel className="mt-6" contentClassName="px-6 py-5">
          <h2 className="text-[28px] font-bold tracking-[-0.7px] text-slate-900">이 코스를 추천한 이유</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {recommendedCourseReasons.map((reason, index) => (
              <div key={reason} className="flex items-start gap-3">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fff1f4] text-[12px] font-bold text-[#f30031]">
                  {index + 1}
                </span>
                <p className="text-[18px] font-semibold leading-[1.45] tracking-[-0.4px] text-slate-800">{reason}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[20px] border border-[#f3ebe1] bg-[#faf7f1] px-5 py-5">
            <p className="text-[20px] font-bold tracking-[-0.45px] text-slate-700">이 코스가 마음에 들지 않으시나요?</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {courseFeedbackOptions.map((option) => (
                <button
                  key={option}
                  className="rounded-[12px] border border-[#ebe3d8] bg-white px-4 py-3 text-[15px] font-semibold tracking-[-0.35px] text-slate-800 transition hover:bg-[#fff6f7]"
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </SectionPanel>

        <SectionPanel className="mt-6" contentClassName="px-6 py-5">
          <h2 className="text-[28px] font-bold tracking-[-0.7px] text-slate-900">코스와 가까운 숙소</h2>
          <div className="mt-5 grid gap-4 xl:grid-cols-3">
            {recommendedAccommodations.map((stay) => (
              <article
                key={stay.id}
                className={`rounded-[20px] border bg-white px-5 py-5 shadow-[0_2px_8px_rgba(17,17,17,0.03)] ${
                  selectedStayId === stay.id ? "border-[#f30031] ring-2 ring-[#f30031]/10" : "border-[#efe8dc]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`inline-flex h-7 items-center rounded-full bg-slate-100 px-3 text-[12px] font-bold tracking-[-0.3px] ${stay.tone}`}>
                    {stay.badge}
                  </span>
                  <span className="text-[13px] tracking-[-0.3px] text-slate-500">{stay.area}</span>
                </div>
                <p className="mt-4 text-[22px] font-bold tracking-[-0.55px] text-slate-900">{stay.title}</p>
                <p className={`mt-2 text-[20px] font-bold tracking-[-0.45px] ${stay.tone}`}>{stay.price}</p>
                <Button
                  className="mt-5 h-11 w-full rounded-[14px] bg-[#f30031] text-[16px] font-semibold hover:bg-[#df032f]"
                  onClick={() => setConfirmStayId(stay.id)}
                >
                  숙소 선택하기
                </Button>
              </article>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel className="mt-6" contentClassName="px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-[28px] font-bold tracking-[-0.7px] text-slate-900">같은 코스를 걷는 사람들</h2>
              <p className="mt-1 text-[15px] tracking-[-0.35px] text-slate-500">가장 많이 남긴 감정: 평온함</p>
            </div>
            <p className="text-[14px] tracking-[-0.35px] text-slate-500">오늘 12명 저장</p>
          </div>

          <div className="mt-5 space-y-3">
            {companionEmotionNotes.map((item) => (
              <div key={item.rank} className="flex items-center gap-3 rounded-[16px] bg-[#fffcf7] px-4 py-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f1ede8] text-[13px] font-bold text-slate-500">
                  {item.rank}
                </span>
                <span className={`inline-flex h-7 items-center rounded-full px-3 text-[12px] font-bold tracking-[-0.3px] ${item.tone}`}>{item.mood}</span>
                <p className="text-[16px] font-semibold tracking-[-0.35px] text-slate-800">&quot;{item.quote}&quot;</p>
              </div>
            ))}
          </div>
        </SectionPanel>
      </div>

      {confirmStayId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,17,17,0.35)] px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-[430px] rounded-[28px] bg-white p-8 shadow-[0_20px_50px_rgba(17,17,17,0.18)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(180deg,#eef3ff_0%,#fafcff_100%)] text-[44px] text-[#3c65e8]">
              ?
            </div>
            <p className="mt-8 text-center text-[32px] font-bold tracking-[-0.7px] text-slate-900">해당 숙소로 지정하시겠습니까?</p>
            <div className="mt-10 grid grid-cols-2 gap-4">
              <Button
                className="h-14 rounded-[14px] bg-[linear-gradient(180deg,#3d6cff_0%,#2f5ce9_100%)] text-[20px] font-semibold hover:bg-[linear-gradient(180deg,#3d6cff_0%,#2f5ce9_100%)]"
                onClick={() => {
                  setSelectedStayId(confirmStayId);
                  setConfirmStayId(null);
                }}
              >
                예
              </Button>
              <Button
                className="h-14 rounded-[14px] border border-[#e8dfd3] bg-white text-[20px] font-semibold text-slate-900 hover:bg-[#faf6ef]"
                onClick={() => setConfirmStayId(null)}
                variant="outline"
              >
                아니요
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {manualStayOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,17,17,0.35)] px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-[500px] rounded-[28px] bg-white p-8 shadow-[0_20px_50px_rgba(17,17,17,0.18)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(180deg,#eef3ff_0%,#fafcff_100%)] text-[44px] text-[#3c65e8]">
              ⌂
            </div>
            <p className="mt-6 text-center text-[30px] font-bold tracking-[-0.7px] text-slate-900">숙소명과 주소를 입력해 주세요.</p>

            <div className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-[16px] font-semibold tracking-[-0.35px] text-slate-900">숙소명 *</span>
                <input
                  className="h-14 w-full rounded-[14px] border border-[#e8dfd3] px-4 text-[16px] outline-none transition focus:border-[#f30031]"
                  placeholder="숙소명을 입력해 주세요."
                  value={manualStayForm.name}
                  onChange={(event) => setManualStayForm((prev) => ({ ...prev, name: event.target.value }))}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[16px] font-semibold tracking-[-0.35px] text-slate-900">주소 *</span>
                <input
                  className="h-14 w-full rounded-[14px] border border-[#e8dfd3] px-4 text-[16px] outline-none transition focus:border-[#f30031]"
                  placeholder="주소를 입력해 주세요."
                  value={manualStayForm.address}
                  onChange={(event) => setManualStayForm((prev) => ({ ...prev, address: event.target.value }))}
                />
              </label>
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                className="h-14 flex-1 rounded-[14px] bg-[#f30031] text-[20px] font-semibold hover:bg-[#df032f]"
                onClick={handleManualStaySubmit}
              >
                제출
              </Button>
              <Button
                className="h-14 rounded-[14px] border border-[#e8dfd3] bg-white px-6 text-[18px] font-semibold text-slate-900 hover:bg-[#faf6ef]"
                onClick={() => setManualStayOpen(false)}
                variant="outline"
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </MainShell>
  );
}
