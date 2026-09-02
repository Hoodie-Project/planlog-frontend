"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Bookmark, ChevronDown, ChevronLeft, RefreshCw, X } from "lucide-react";
import { TestCourseMapLayout } from "@/components/course-result-test/TestCourseMapLayout";
import { testRecommendedCourse, testRecommendedCourseMap, testRecommendedPlaces } from "@/lib/mock-data";

export default function TestCourseResultPage() {
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(1);
  const selectedPlace = useMemo(
    () => testRecommendedPlaces.find((place) => place.id === selectedPlaceId) ?? null,
    [selectedPlaceId]
  );

  return (
    <TestCourseMapLayout
      center={testRecommendedCourseMap.center}
      markers={testRecommendedCourseMap.markers}
      mapOverlay={
        selectedPlace ? (
          <>
            <div className="absolute left-4 top-4 z-20 hidden xl:block">
              <div className="overflow-hidden rounded-[16px] border border-[#e5e5ec] bg-white shadow-[0px_2px_6px_rgba(17,17,17,0.08)]">
                <div className="flex h-[calc(100vh-112px)] min-h-[720px] w-[350px] flex-col">
                  <div className="flex items-center justify-between px-4 py-4">
                    <button className="text-[#111111]" onClick={() => setSelectedPlaceId(null)} type="button">
                      <ChevronLeft className="h-6 w-6" strokeWidth={1.9} />
                    </button>
                    <button className="text-[#111111]" onClick={() => setSelectedPlaceId(null)} type="button">
                      <X className="h-6 w-6" strokeWidth={1.9} />
                    </button>
                  </div>

                  <div className="border-b border-[#e5e5ec] px-4 pb-4">
                    <div className="h-[224px] overflow-hidden rounded-[2px]">
                      <img alt={selectedPlace.name} className="h-full w-full object-cover" src={selectedPlace.image} />
                    </div>
                    <div className="mt-3">
                      <h3 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111111]">{selectedPlace.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[16px] tracking-[-0.4px] text-[#111111]">
                        {selectedPlace.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 space-y-1 text-[16px] leading-[1.4] tracking-[-0.4px] text-[#111111]">
                      <p>{selectedPlace.address}</p>
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="font-bold">{selectedPlace.status}</span>
                        <span>{selectedPlace.hours}</span>
                        <ChevronDown className="h-3 w-3" strokeWidth={2} />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold">혼잡도</span>
                        <span className={`font-bold ${selectedPlace.congestionTone}`}>{selectedPlace.congestion}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 bg-white" />
                </div>
              </div>

              <button
                className="absolute left-[350px] top-[420px] flex h-[60px] w-10 items-center justify-center rounded-br-[16px] rounded-tr-[16px] border border-[#e5e5ec] border-l-0 bg-white shadow-[0px_2px_6px_rgba(17,17,17,0.08)]"
                onClick={() => setSelectedPlaceId(null)}
                type="button"
              >
                <ChevronLeft className="h-6 w-6 text-[#111111]" strokeWidth={1.9} />
              </button>
            </div>

            <div className="absolute inset-x-4 top-4 z-20 xl:hidden">
              <div className="overflow-hidden rounded-[16px] border border-[#e5e5ec] bg-white shadow-[0px_2px_6px_rgba(17,17,17,0.08)]">
                <div className="flex items-center justify-between px-4 py-3">
                  <button className="text-[#111111]" onClick={() => setSelectedPlaceId(null)} type="button">
                    <ChevronLeft className="h-5 w-5" strokeWidth={1.9} />
                  </button>
                  <button className="text-[#111111]" onClick={() => setSelectedPlaceId(null)} type="button">
                    <X className="h-5 w-5" strokeWidth={1.9} />
                  </button>
                </div>
                <div className="border-t border-[#f2f2f4] px-4 pb-4 pt-1">
                  <p className="text-[20px] font-bold tracking-[-0.5px] text-[#111111]">{selectedPlace.name}</p>
                  <p className="mt-1 text-[14px] leading-[1.4] tracking-[-0.35px] text-[#111111]">{selectedPlace.address}</p>
                </div>
              </div>
            </div>
          </>
        ) : null
      }
      mobileSummary={
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-bold tracking-[-0.5px] text-[#111111]">{testRecommendedCourse.title}</h2>
            <p className="mt-2 text-[14px] leading-[1.4] tracking-[-0.35px] text-[#505050]">
              {testRecommendedCourse.timeline.map((item) => `${item.time} ${item.label}`).join(" · ")}
            </p>
          </div>
          <Link className="shrink-0 text-[14px] font-semibold tracking-[-0.35px] text-[#505050]" href="/course/saved">
            상세보기
          </Link>
        </div>
      }
      onMarkerClick={setSelectedPlaceId}
      panel={
        <div className="flex h-full flex-col gap-[13px] px-5 pb-8 pt-6">
          <div>
            <h1 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111111]">{testRecommendedCourse.title}</h1>
            <div className="mt-[13px] flex flex-wrap items-center gap-1">
              <button
                className="inline-flex h-8 items-center justify-center rounded-full bg-[#ff1f4c] px-4 text-[14px] font-bold tracking-[-0.35px] text-white transition hover:bg-[#eb1b47]"
                type="button"
              >
                <Bookmark className="mr-1 h-4 w-4" strokeWidth={2.2} />
                저장하기
              </button>
              <button
                className="inline-flex h-8 items-center justify-center rounded-full bg-[#ffeaee] px-4 text-[14px] font-bold tracking-[-0.35px] text-[#111111] transition hover:bg-[#ffe0e7]"
                type="button"
              >
                <RefreshCw className="mr-1 h-4 w-4" strokeWidth={2.2} />
                다시 추천받기
              </button>
            </div>
          </div>

          <div className="flex-1 pt-[11px]">
            <div className="space-y-5 border-b border-[#e5e5ec] pb-4 text-[16px] font-semibold leading-[1.4] tracking-[-0.4px] text-[#111111]">
              {testRecommendedCourse.timeline.map((item) => (
                <button
                  key={`${item.time}-${item.label}`}
                  className="flex items-start gap-2 text-left"
                  onClick={() => {
                    const matchedPlace = testRecommendedPlaces.find((place) => place.time === item.time);
                    if (matchedPlace) {
                      setSelectedPlaceId(matchedPlace.id);
                    }
                  }}
                  type="button"
                >
                  <span className="w-[50px] shrink-0">{item.time}</span>
                  <span>{item.label}</span>
                </button>
              ))}

              <button className="flex items-start gap-1 text-left text-[#111111]" type="button">
                <span className="text-[20px] leading-none text-[#ff1f4c]">+</span>
                <span>일정 추가하기</span>
              </button>

              <button className="flex items-start gap-1 text-left text-[#111111]" type="button">
                <span className="text-[20px] leading-none text-[#ff1f4c]">+</span>
                <span>숙소 추가하기</span>
              </button>
            </div>

            <Link
              className="mt-4 inline-flex items-center gap-0.5 text-[14px] font-semibold leading-[1.4] tracking-[-0.35px] text-[#505050] transition hover:text-slate-900"
              href="/course/saved"
            >
              상세보기
              <ArrowRight className="h-4 w-4" strokeWidth={2.1} />
            </Link>
          </div>
        </div>
      }
      path={testRecommendedCourseMap.path}
    />
  );
}
