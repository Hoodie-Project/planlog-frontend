import Link from "next/link";
import { MainShell } from "@/components/layout/MainShell";
import { Button } from "@/components/ui/Button";
import {
  festivalCards,
  howToMakeCourse,
  landingPreviews,
  landingStampProgress,
} from "@/lib/mock-data";

export default function HomePage() {
  const stampSectionBackground = "/images/landing/landing_stamp.jpeg";

  return (
    <MainShell>
      <section className="overflow-hidden bg-white">
        <div className="mx-auto max-w-[1240px] px-4 pb-[56px] pt-[72px] text-center lg:px-0">
          <div>
            <h1 className="text-[48px] font-extrabold leading-[1.4] tracking-[-1.2px] text-slate-900">
              <span className="block">감성과 도착 정보만 고르면</span>
              <span className="block text-[#f30031]">강원도 여행 완성!</span>
            </h1>
            <p className="mt-6 text-[28px] font-semibold leading-[1.4] tracking-[-0.7px] text-slate-900">
              혼자 떠나는 강원도 여행을
              <br />
              계획부터 기록까지 가볍게 만들어드려요.
            </p>
            <div className="mt-10 flex justify-center">
              <Button asChild className="h-12 rounded-full bg-[#f30031] px-[27px] text-[20px] font-bold tracking-[-0.5px] hover:bg-[#df032f]">
                <Link href="/course/create">앱 다운로드</Link>
              </Button>
            </div>
          </div>

          <div className="mt-[72px] grid gap-4 lg:grid-cols-3">
            {landingPreviews.map((preview) => (
              <article key={preview.title} className="rounded-[20px] border border-[#f30031] bg-white px-5 pb-4 pt-5 text-left">
                <h2 className="text-[20px] font-semibold leading-[1.4] tracking-[-0.5px] text-slate-900">{preview.title}</h2>
                <div className="mt-[22px] space-y-[10px] text-[16px] leading-[1.4] tracking-[-0.4px] text-slate-900">
                  {preview.items.map(([time, label, tags]) => (
                    <div key={`${preview.title}-${time}-${label}`} className="grid grid-cols-[52px_1fr] gap-[10px]">
                      <span>{time}</span>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span>{label}</span>
                        {tags.map((tag) => (
                          <span key={tag} className="text-[12px] font-bold tracking-[-0.3px] text-[#ff5c7d]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-[28px] border-t border-[#ffc5d1] pt-4 text-[16px] leading-[1.4] tracking-[-0.4px] text-slate-900">
                  <span>
                    혼잡도: <strong className={preview.congestionTone}>{preview.congestion}</strong>
                  </span>
                  <span className="ml-3">도보:2.8km</span>
                  <span className="ml-3">코스 소요시간:6h 30m</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-[42px]">
        <div className="mx-auto max-w-[1240px] px-4 lg:px-0">
          <div className="mb-[14px] flex items-baseline gap-2">
            <h2 className="text-[24px] font-bold tracking-[-0.6px] text-slate-900">강원도 HOT 축제</h2>
            <p className="text-[16px] tracking-[-0.4px] text-slate-600">바로 즐길 수 있는 이번주 축제</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {festivalCards.map((festival) => (
              <article
                key={festival.title}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_6px_rgba(17,17,17,0.08)]"
              >
                <img alt={festival.title} className="h-[150px] w-[200px] rounded-lg object-cover" src={festival.image} />
                <div className="min-w-0">
                  <span className="inline-flex h-6 items-center rounded-full bg-slate-100 px-3 text-[12px] font-semibold text-slate-600">
                    {festival.badge}
                  </span>
                  <h3 className="mt-3 text-[16px] font-semibold text-slate-900">{festival.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-[14px] text-slate-700">
                    <span>{festival.location}</span>
                    <span className="h-2.5 w-px rounded-full bg-slate-400" />
                    <span>{festival.period}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#ffeaee] py-[60px]">
        <div className="mx-auto max-w-[1240px] px-4 lg:px-0">
          <div className="mb-7 flex items-baseline gap-2">
            <h2 className="text-[24px] font-bold tracking-[-0.6px] text-slate-900">코스 만드는 방법</h2>
            <p className="text-[16px] tracking-[-0.4px] text-slate-600">플랜로그와 함께 여행코스를 만들어보세요</p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {howToMakeCourse.map((item, index) => (
              <div key={item.title} className="flex items-center gap-3">
                <article
                  className="w-full rounded-2xl border bg-white px-6 pb-10 pt-6 shadow-[0_2px_3px_rgba(17,17,17,0.08)] md:w-[220px]"
                  style={{ borderColor: item.accent }}
                >
                  <div className="flex items-center gap-1">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#ff1f4c] text-[12px] font-bold text-white">
                      {item.step}
                    </span>
                    <h3 className="text-[16px] font-semibold leading-[1.4] text-slate-900">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-[14px] leading-[1.4] tracking-[-0.35px] text-slate-900">{item.description}</p>
                </article>
                {index < howToMakeCourse.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="hidden h-[2px] w-3 shrink-0 rounded-full md:block"
                    style={{ backgroundColor: item.accent }}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white pb-[36px] pt-[36px]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-top bg-no-repeat"
          style={{ backgroundImage: `url(${stampSectionBackground})`, backgroundSize: "100% auto" }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-white/72" />
        <div className="relative z-10 mx-auto max-w-[1240px] px-4 text-center lg:px-0">
          <div className="relative z-10 mx-auto inline-flex flex-col items-center gap-5 bg-white px-6 pb-1 mt-8">
            <h2 className="text-[48px] font-extrabold leading-[1.4] tracking-[-1.2px] text-slate-900">
              스탬프 투어로 완성하는
              <span className="block text-[#f30031]">나만의 지도</span>
            </h2>
            <p className="text-[28px] font-semibold leading-[1.4] tracking-[-0.7px] text-slate-900">
              여행하면서 스탬프를 모아
              <br />
              나만의 지도를 완성해보세요
            </p>
          </div>

          <div className="relative mx-auto mt-1 h-[420px] max-w-[1240px]">
            <article className="absolute left-1/2 top-[50px] z-[3] w-full max-w-[400px] -translate-x-1/2 rounded-[20px] border border-[#f30031] bg-white/95 px-7 pb-7 pt-6 text-left shadow-[0_10px_30px_rgba(17,17,17,0.08)] backdrop-blur-[3px]">
              <div className="flex items-center gap-3">
                <h3 className="text-[20px] font-semibold leading-[1.4] tracking-[-0.5px] text-slate-900">나의 감성 지도</h3>
                <span className="inline-flex h-6 items-center rounded-full border border-[#f30031] px-2 text-[12px] font-semibold tracking-[-0.3px] text-[#f30031]">
                  진행중
                </span>
              </div>

              <div className="mt-7 flex items-center gap-2">
                {landingStampProgress.map((stamp, index) => (
                  <div key={`stamp-${index}`} className="relative h-[60px] w-[60px] shrink-0">
                    <img alt="" aria-hidden="true" className="absolute inset-0 h-full w-full" src={stamp.badge} />
                    <img alt="" aria-hidden="true" className="absolute left-[8px] top-[8px] h-[44px] w-[44px]" src={stamp.outer} />
                    <img alt="" aria-hidden="true" className="absolute left-[10px] top-[10px] h-[41px] w-[41px]" src={stamp.inner} />
                    <span
                      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[12px] font-semibold tracking-[-0.3px] ${
                        stamp.done ? "text-[#f30031]" : "text-[#999999]"
                      }`}
                    >
                      완료
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-[#ffc5d1] pt-4 text-[16px] leading-[1.4] tracking-[-0.4px] text-slate-900">
                다음 목표: 레트로
              </div>
            </article>
          </div>
        </div>
      </section>

      <footer className="bg-white py-[25px] text-center text-[15px] font-semibold leading-[1.4] text-slate-600">
        <p>Contact: Hoodiev@google.com</p>
        <p className="mt-2">Copyright © Hoodiev All right reserved.</p>
      </footer>
    </MainShell>
  );
}
