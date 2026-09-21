import Link from "next/link";
import { MainShell } from "@/components/layout/MainShell";
import { FestivalCarousel } from "@/components/landing/FestivalCarousel";
import { Button } from "@/components/ui/Button";
import landingCompleteStamp from "@/asset/svgs/landing-complete.svg";
import landingIncompleteStamp from "@/asset/svgs/landing-incomplete.svg";
import {
  howToMakeCourse,
  landingPreviews,
  landingStampProgress,
} from "@/lib/mock-data";

export default function HomePage() {
  const stampSectionBackground = "/images/landing/landing_stamp.jpeg";

  return (
    <MainShell mobileHeaderHidden>
      <section className="overflow-hidden bg-white">
        <header className="flex h-14 items-center px-8 md:hidden">
          <Link className="text-[16px] font-extrabold tracking-[-0.4px] text-[#111111]" href="/">
            PLANLOG
          </Link>
        </header>
        <div className="mx-auto max-w-[1240px] px-8 pb-10 pt-[52px] text-center md:px-4 md:pb-[56px] md:pt-[72px] lg:px-0">
          <div>
            <h1 className="text-[28px] font-extrabold leading-[1.4] tracking-[-0.7px] text-slate-900 md:text-[48px] md:tracking-[-1.2px]">
              <span className="block">감성과 도착 정보만 고르면</span>
              <span className="block text-[#f30031]">강원도 여행 완성!</span>
            </h1>
            <p className="mt-[14px] text-[16px] font-semibold leading-[1.4] tracking-[-0.4px] text-slate-900 md:mt-6 md:text-[28px] md:tracking-[-0.7px]">
              혼자 떠나는 강원도 여행을
              <br />
              계획부터 기록까지 가볍게 만들어드려요.
            </p>
            <div className="mt-10 hidden justify-center md:flex">
              <Button asChild className="h-12 rounded-full bg-[#f30031] px-[27px] text-[20px] font-bold tracking-[-0.5px] hover:bg-[#df032f]">
                <Link href="/course/create">앱 다운로드</Link>
              </Button>
            </div>
          </div>

          <div className="mt-9 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 text-left [scrollbar-width:none] md:mt-[72px] md:grid md:overflow-visible md:px-4 lg:grid-cols-3 lg:px-0">
            {landingPreviews.map((preview) => (
              <article key={preview.title} className="h-[320px] w-[310px] shrink-0 snap-start rounded-[20px] border border-[#f30031] bg-white px-[25px] pb-4 pt-8 md:h-auto md:w-auto md:px-5 md:pt-5">
                <h2 className="text-[16px] font-semibold leading-[1.4] tracking-[-0.4px] text-slate-900 md:text-[20px] md:tracking-[-0.5px]">{preview.title}</h2>
                <div className="mt-[22px] space-y-[10px] text-[14px] leading-[1.4] tracking-[-0.35px] text-slate-900 md:text-[16px] md:tracking-[-0.4px]">
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
                <div className="mt-[28px] border-t border-[#ffc5d1] pt-4 text-[14px] leading-[1.4] tracking-[-0.35px] text-slate-900 md:text-[16px] md:tracking-[-0.4px]">
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

      <section className="bg-white py-8 md:py-[42px]">
        <div className="mx-auto max-w-[1240px] px-8 lg:px-0">
          <div className="mb-[14px] flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h2 className="text-[24px] font-bold tracking-[-0.6px] text-slate-900">강원도 축제를 소개합니다</h2>
            <p className="text-[16px] tracking-[-0.4px] text-slate-600">강원도의 다채로운 축제를 만나보세요</p>
          </div>
          <FestivalCarousel />
        </div>
      </section>

      <section className="bg-[#ffeaee] py-10 md:py-[60px]">
        <div className="mx-auto max-w-[1240px] px-8 lg:px-0">
          <div className="mb-7 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h2 className="text-[24px] font-bold tracking-[-0.6px] text-slate-900">코스 만드는 방법</h2>
            <p className="text-[16px] tracking-[-0.4px] text-slate-600">플랜로그와 함께 여행코스를 만들어보세요</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-3 [scrollbar-width:none] md:flex-row md:items-center md:justify-between">
            {howToMakeCourse.map((item, index) => (
              <div key={item.title} className="flex shrink-0 items-center gap-3">
                <article
                  className="h-[138px] w-[200px] rounded-2xl border bg-white px-6 py-6 shadow-[0_2px_3px_rgba(17,17,17,0.08)] md:h-auto md:w-[220px] md:pb-10"
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

      <section className="relative overflow-hidden bg-white pb-[36px] pt-[36px] md:bg-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-top bg-no-repeat md:block"
          style={{ backgroundImage: `url(${stampSectionBackground})`, backgroundSize: "100% auto" }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-white md:bg-white/72" />
        <div className="relative z-10 mx-auto max-w-[1240px] px-8 text-center lg:px-0">
          <div className="relative z-10 mx-auto mt-2 inline-flex flex-col items-center gap-3 bg-white px-6 pb-1 md:mt-8 md:gap-5">
            <h2 className="text-[28px] font-extrabold leading-[1.4] tracking-[-0.7px] text-slate-900 md:text-[48px] md:tracking-[-1.2px]">
              스탬프 투어로 완성하는
              <span className="block text-[#f30031]">나만의 지도</span>
            </h2>
            <p className="text-[16px] font-semibold leading-[1.4] tracking-[-0.4px] text-slate-900 md:text-[28px] md:tracking-[-0.7px]">
              여행하면서 스탬프를 모아
              <br />
              나만의 지도를 완성해보세요
            </p>
          </div>

          <div className="relative mx-auto mt-1 h-[270px] max-w-[1240px] md:h-[420px]">
            <article className="absolute left-1/2 top-[34px] z-[3] h-[203px] w-[310px] -translate-x-1/2 rounded-[20px] border border-[#f30031] bg-white px-5 pb-5 pt-6 text-left shadow-[0_10px_30px_rgba(17,17,17,0.08)] md:top-[50px] md:h-auto md:w-full md:max-w-[400px] md:bg-white/95 md:px-7 md:pb-7 md:backdrop-blur-[3px]">
              <div className="flex items-center gap-3">
                <h3 className="text-[20px] font-semibold leading-[1.4] tracking-[-0.5px] text-slate-900">나의 감성 지도</h3>
                <span className="inline-flex h-6 items-center rounded-full border border-[#f30031] px-2 text-[12px] font-semibold tracking-[-0.3px] text-[#f30031]">
                  진행중
                </span>
              </div>

              <div className="mt-5 flex items-center gap-1 md:mt-7 md:gap-2">
                {landingStampProgress.map((stamp, index) => (
                  <div key={`stamp-${index}`} className="relative h-[52px] w-[52px] shrink-0 md:h-[60px] md:w-[60px]">
                    <img alt={stamp.done ? "완료한 스탬프" : "미완료 스탬프"} className="h-full w-full" src={stamp.done ? landingCompleteStamp.src : landingIncompleteStamp.src} />
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-[#ffc5d1] pt-3 text-[16px] leading-[1.4] tracking-[-0.4px] text-slate-900 md:mt-5 md:pt-4">
                다음 목표: 레트로
              </div>
            </article>
          </div>
        </div>
      </section>
    </MainShell>
  );
}
