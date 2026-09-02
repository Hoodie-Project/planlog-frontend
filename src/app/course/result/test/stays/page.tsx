"use client";

import { ChevronRight } from "lucide-react";
import { TestCourseMapLayout } from "@/components/course-result-test/TestCourseMapLayout";
import { testRecommendedStayMap, testRecommendedStays } from "@/lib/mock-data";

export default function TestCourseStayPage() {
  return (
    <TestCourseMapLayout
      center={testRecommendedStayMap.center}
      markers={testRecommendedStayMap.markers}
      mobileSummary={
        <div>
          <h2 className="text-[20px] font-bold tracking-[-0.5px] text-[#111111]">추천 숙소</h2>
          <p className="mt-2 text-[14px] leading-[1.4] tracking-[-0.35px] text-[#505050]">코스와 가까운 숙소를 확인해 보세요!</p>
        </div>
      }
      panel={
        <div className="flex h-full flex-col gap-6 overflow-y-auto px-5 pb-10 pt-6">
          <div>
            <h1 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111111]">추천 숙소</h1>
            <p className="mt-1 text-[16px] leading-[1.4] tracking-[-0.4px] text-[#111111]">코스와 가까운 숙소를 확인해 보세요!</p>
          </div>

          <div className="space-y-2">
            {testRecommendedStays.map((stay) => (
              <button
                key={stay.id}
                className="flex w-[300px] items-start gap-3 rounded-2xl border border-[#f1f1f5] bg-white p-5 text-left shadow-[0px_2px_6px_rgba(17,17,17,0.08)] transition hover:-translate-y-[1px]"
                type="button"
              >
                <div className="h-[100px] w-[133px] shrink-0 overflow-hidden rounded-[8px] border border-[#f1f1f5]">
                  <img alt={stay.title} className="h-full w-full object-cover" src={stay.image} />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-4">
                  <div>
                    <p className="text-[14px] font-semibold leading-[1.4] text-[#111111]">{stay.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1 text-[12px] font-semibold leading-[1.4] tracking-[-0.3px] text-[#505050]">
                      {stay.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[16px] font-bold leading-[1.4] tracking-[-0.4px] text-[#ff1f4c]">{stay.price}</p>
                    <div className="mt-1 inline-flex items-center text-[12px] font-semibold leading-[1.4] tracking-[-0.3px] text-[#505050]">
                      숙소 선택하기
                      <ChevronRight className="h-3 w-3" strokeWidth={2} />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      }
    />
  );
}
