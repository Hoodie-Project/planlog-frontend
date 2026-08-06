import Link from "next/link";
import { MainShell } from "@/components/layout/MainShell";
import { SectionPanel } from "@/components/mock-pages/MockPageShared";
import {
  recordsArchiveCards,
  recordsRecentActivities,
  recordsSummaryCards,
  recordsTraitChips,
  zoneProgress,
} from "@/lib/mock-data";

export default function RecordsPage() {
  return (
    <MainShell>
      <div className="mx-auto max-w-[1240px] px-4 py-12 lg:px-0">
        <section className="rounded-[24px] border border-[#ffe0e7] bg-white px-8 py-8 shadow-[0_10px_30px_rgba(17,17,17,0.06)]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <p className="text-[15px] font-semibold tracking-[-0.35px] text-[#f30031]">나의 기록</p>
              <div className="space-y-2">
                <h1 className="text-[36px] font-extrabold leading-[1.35] tracking-[-0.9px] text-slate-900">하영님의 여행 기록 보관함</h1>
                <p className="text-[18px] leading-[1.5] tracking-[-0.45px] text-slate-600">
                  저장한 코스, 스탬프 진행도, 최근 기록을 한 화면에서 확인하는 목업 UI입니다.
                </p>
              </div>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-3 lg:w-[520px]">
              {recordsSummaryCards.map((item) => (
                <div key={item.label} className="rounded-[18px] border border-[#ffe8ee] bg-[#fffafb] px-5 py-4">
                  <p className="text-[14px] tracking-[-0.35px] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-[24px] font-bold tracking-[-0.6px] text-slate-900">{item.value}</p>
                  <p className="mt-1 text-[13px] tracking-[-0.3px] text-[#f30031]">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <SectionPanel title="나의 강원도 감성 지도" className="border-[#ffe0e7] shadow-[0_8px_24px_rgba(17,17,17,0.05)]" contentClassName="p-6">
            <div className="space-y-4">
              {zoneProgress.map((zone) => (
                <div key={zone.label}>
                  <div className="mb-2 flex items-center justify-between text-[15px] tracking-[-0.35px]">
                    <span className="font-semibold text-slate-900">{zone.label}</span>
                    <span className="text-slate-500">{zone.value}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#ffe8ee]">
                    <div className="h-2.5 rounded-full bg-[#f30031]" style={{ width: zone.percent }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel title="나의 여행 성향" className="border-[#ffe0e7] shadow-[0_8px_24px_rgba(17,17,17,0.05)]" contentClassName="p-6">
            <div className="space-y-4">
              <div className="rounded-[18px] border border-[#ffd6df] bg-[#fff6f8] px-5 py-4">
                <p className="text-[14px] font-semibold tracking-[-0.35px] text-[#f30031]">현재 가장 가까운 여행자 타입</p>
                <p className="mt-2 text-[22px] font-bold tracking-[-0.55px] text-slate-900">조용한 바다 산책형</p>
                <p className="mt-2 text-[15px] leading-[1.5] tracking-[-0.35px] text-slate-600">
                  혼자서 여유 있게 이동하며 바다와 레트로 공간을 번갈아 즐기는 패턴이 강해요.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {recordsTraitChips.map((item) => (
                  <span
                    key={item.label}
                    className="inline-flex h-9 items-center rounded-full border border-[#ffe0e7] bg-white px-4 text-[14px] font-semibold tracking-[-0.35px] text-slate-700"
                  >
                    {item.label} {item.value}
                  </span>
                ))}
              </div>
            </div>
          </SectionPanel>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionPanel title="최근 활동" className="border-[#ffe0e7] shadow-[0_8px_24px_rgba(17,17,17,0.05)]" contentClassName="p-6">
            <div className="space-y-3">
              {recordsRecentActivities.map((item) => (
                <div key={`${item.title}-${item.time}`} className="rounded-[16px] border border-[#ffe8ee] bg-white px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[16px] font-semibold leading-[1.45] tracking-[-0.35px] text-slate-900">{item.title}</p>
                    <span className={`shrink-0 text-[13px] font-semibold tracking-[-0.3px] ${item.tone}`}>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel title="최근 기록 카드" className="border-[#ffe0e7] shadow-[0_8px_24px_rgba(17,17,17,0.05)]" contentClassName="p-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {recordsArchiveCards.map((record) => (
                <article key={record.id} className="overflow-hidden rounded-[18px] border border-[#ffe8ee] bg-white">
                  <img alt={record.title} className="h-[180px] w-full object-cover" src={record.image} />
                  <div className="space-y-3 px-5 py-5">
                    <div className="space-y-1">
                      <p className="text-[13px] font-semibold tracking-[-0.3px] text-[#f30031]">
                        {record.location} · {record.date}
                      </p>
                      <h3 className="text-[18px] font-semibold leading-[1.4] tracking-[-0.45px] text-slate-900">{record.title}</h3>
                    </div>
                    <p className="text-[14px] tracking-[-0.35px] text-slate-500">{record.stamps}</p>
                    <p className="text-[14px] leading-[1.5] tracking-[-0.35px] text-slate-600">&quot;{record.note}&quot;</p>
                    <div className="flex flex-wrap gap-2">
                      {record.tags.map((tag) => (
                        <span key={tag} className="inline-flex h-7 items-center rounded-full bg-slate-100 px-3 text-[12px] font-semibold tracking-[-0.3px] text-slate-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link className="inline-flex text-[14px] font-semibold tracking-[-0.35px] text-[#f30031]" href={`/records/${record.id}`}>
                      기록 카드 보기
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </SectionPanel>
        </section>
      </div>
    </MainShell>
  );
}
