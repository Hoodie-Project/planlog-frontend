import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MainShell } from "@/components/layout/main-shell";
import { Button } from "@/components/ui/button";
import { festivalCards, howToMakeCourse, landingPreviews, landingStampIcons } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <MainShell>
      <section className="overflow-hidden bg-white">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-6 pb-24 pt-20 lg:grid-cols-[1fr_1.9fr]">
          <div className="pt-4">
            <h1 className="text-[44px] font-extrabold leading-[1.35] tracking-tight text-slate-900 lg:text-[48px]">
              감성과 도착 정보만 고르면
              <span className="block text-[#f30031]">강원도 여행 완성!</span>
            </h1>
            <p className="mt-7 text-[26px] font-semibold leading-[1.45] tracking-tight text-slate-900">
              혼자 떠나는 강원도 여행을
              <br />
              계획부터 기록까지 가볍게 만들어드려요.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild className="h-12 rounded-full bg-[#f30031] px-7 text-[18px] hover:bg-[#df032f]">
                <Link href="/course/create">
                  앱 다운로드
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {landingPreviews.map((preview) => (
              <article key={preview.title} className="rounded-[20px] border border-[#ff96ab] bg-white p-5">
                <h2 className="text-[18px] font-semibold leading-[1.4] text-slate-900">{preview.title}</h2>
                <div className="mt-5 space-y-3 text-[15px] text-slate-900">
                  {preview.items.map(([time, label, tags]) => (
                    <div key={`${preview.title}-${time}-${label}`} className="grid grid-cols-[52px_1fr] gap-4">
                      <span>{time}</span>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span>{label}</span>
                        {tags.map((tag) => (
                          <span key={tag} className="text-[11px] font-bold text-[#ff5c7d]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-[#ffc5d1] pt-4 text-[13px] text-slate-900">
                  <span>
                    혼잡도: <strong className={preview.congestionTone}>{preview.congestion}</strong>
                  </span>
                  <span className="ml-3">도보: 2.8km</span>
                  <span className="ml-3">코스 소요시간: 6h 30m</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="mb-7 flex items-baseline gap-2">
            <h2 className="text-[24px] font-bold text-slate-900">강원도 HOT 축제</h2>
            <p className="text-[15px] text-slate-600">바로 즐길 수 있는 이번주 축제</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
          {festivalCards.map((festival) => (
              <article
                key={festival.title}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_6px_rgba(17,17,17,0.08)]"
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

      <section className="bg-[#ffeaee] py-14">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="mb-7 flex items-baseline gap-2">
            <h2 className="text-[24px] font-bold text-slate-900">코스 만드는 방법</h2>
            <p className="text-[15px] text-slate-600">플랜로그와 함께 여행코스를 만들어보세요</p>
          </div>
          <div className="grid gap-3 md:grid-cols-5">
            {howToMakeCourse.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border bg-white px-6 pb-10 pt-6 shadow-[0_2px_3px_rgba(17,17,17,0.08)]"
                style={{ borderColor: item.accent }}
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#ff1f4c] text-[12px] font-bold text-white">
                    {item.step}
                  </span>
                  <h3 className="text-[16px] font-semibold text-slate-900">{item.title}</h3>
                </div>
                <p className="mt-3 text-[14px] leading-[1.45] text-slate-800">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16">
        <div className="mx-auto max-w-[1240px] px-6 text-center">
          <h2 className="text-[48px] font-extrabold leading-[1.35] tracking-tight text-slate-900">
            스탬프 투어로 완성하는
            <span className="block text-[#f30031]">나만의 지도</span>
          </h2>
          <p className="mt-6 text-[28px] font-semibold leading-[1.4] text-slate-900">
            여행하면서 스탬프를 모아
            <br />
            나만의 지도를 완성해보세요
          </p>

          <div className="relative mx-auto mt-14 h-[420px] max-w-[1240px]">
            {landingStampIcons.map((icon) => (
              <img key={icon.alt} alt={icon.alt} className={`absolute object-contain ${icon.className}`} src={icon.src} />
            ))}

            <article className="absolute left-1/2 top-1/2 w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-[20px] border border-[#f30031] bg-white p-6 text-left">
              <div className="flex items-center gap-3">
                <h3 className="text-[20px] font-semibold text-slate-900">나의 감성 지도</h3>
                <span className="inline-flex h-6 items-center rounded-full border border-[#f30031] px-2 text-[12px] font-semibold text-[#f30031]">
                  진행중
                </span>
              </div>

              <div className="mt-7 flex items-center gap-3">
                {[true, true, false, false, false].map((done, index) => (
                  <div
                    key={`stamp-${index}`}
                    className={`h-10 w-10 rounded-full border-2 ${
                      done ? "border-[#f30031] text-[#f30031]" : "border-slate-300 text-slate-400"
                    } flex items-center justify-center text-[11px] font-bold`}
                  >
                    완료
                  </div>
                ))}
              </div>

              <div className="mt-7 border-t border-[#ffc5d1] pt-4 text-[16px] text-slate-900">다음 목표: 레트로</div>
            </article>
          </div>
        </div>
      </section>

      <footer className="bg-white py-10 text-center text-[15px] font-semibold text-slate-600">
        <p>Contact: Hoodiev@google.com</p>
        <p className="mt-2">Copyright © Hoodiev All right reserved.</p>
      </footer>
    </MainShell>
  );
}
