"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import coffeeStampIcon from "@/asset/svgs/completed-stamp-coffee.svg";
import completedStampIcon from "@/asset/svgs/completed-stamp.svg";
import mountainStampIcon from "@/asset/svgs/completed-stamp-mountain.svg";
import natureStampIcon from "@/asset/svgs/completed-stamp-nature.svg";
import photoStampIcon from "@/asset/svgs/completed-stamp-photo.svg";
import { StampReviewModal } from "@/components/review/StampReviewModal";
import { MainShell } from "@/components/layout/MainShell";
import { listStamps, type StampDto } from "@/api/stamps";
import { listRecords } from "@/api/platform";
import { getStampReview } from "@/lib/stamp-review";
import { useAuthStore } from "@/store/auth-store";

const themes = ["바다", "산악", "자연", "문화", "포토"] as const;
type StampTheme = (typeof themes)[number];
type SortOrder = "latest" | "oldest";

const themeStyle: Record<StampTheme, { background: string; text: string; icon: string }> = {
  바다: { background: "#e8ecff", text: "#5874ff", icon: completedStampIcon.src },
  산악: { background: "#efdff7", text: "#c548ff", icon: mountainStampIcon.src },
  자연: { background: "#d5f0e3", text: "#58cf48", icon: natureStampIcon.src },
  문화: { background: "#fff0df", text: "#ffa448", icon: coffeeStampIcon.src },
  포토: { background: "#ffdfdf", text: "#ff5858", icon: photoStampIcon.src },
};

type StampItem = { id: string; theme: StampTheme; place: string; date: string; emotion: string; review: string };

const previewStamps: StampItem[] = [
  { id: "sea-1", theme: "바다", place: "정동진해변", date: "2026.09.04", emotion: "평온함", review: "혼자여도 충분한 하루" },
  { id: "sea-2", theme: "바다", place: "주문진해수욕장", date: "2026.08.18", emotion: "즐거운", review: "파도 소리가 좋았어요" },
  { id: "sea-3", theme: "바다", place: "안목해변", date: "2025.07.12", emotion: "기분좋은", review: "커피와 바다가 잘 어울려요" },
  { id: "mountain-1", theme: "산악", place: "설악산", date: "2026.09.01", emotion: "뿌듯한", review: "정상에서 본 풍경이 잊히지 않아요" },
  { id: "mountain-2", theme: "산악", place: "치악산", date: "2026.09.01", emotion: "설렘", review: "숲길을 따라 걷는 시간이 좋았어요" },
  { id: "mountain-3", theme: "산악", place: "팔봉산", date: "2025.12.04", emotion: "자유로움", review: "천천히 올라가도 충분했어요" },
  { id: "nature-1", theme: "자연", place: "경포호수", date: "2026.08.10", emotion: "평온함", review: "호수 주변이 고요했어요" },
  { id: "nature-2", theme: "자연", place: "오대산 전나무숲", date: "2025.09.04", emotion: "감사하는", review: "나무 향이 기분 좋았어요" },
  { id: "culture-1", theme: "문화", place: "안목해변 커피거리", date: "2026.08.10", emotion: "즐거운", review: "여행의 쉼표 같은 곳" },
  { id: "culture-2", theme: "문화", place: "강릉 선교장", date: "2023.08.10", emotion: "설렘", review: "고즈넉한 시간이었어요" },
  { id: "photo-1", theme: "포토", place: "속초 천국의 계단", date: "2026.10.22", emotion: "기분좋은", review: "사진이 정말 잘 나와요" },
  { id: "photo-2", theme: "포토", place: "강릉 BTS 버스 정류장", date: "2026.10.22", emotion: "설렘", review: "기억에 남는 포토 스팟" },
];

const themeToZone: Record<StampTheme, StampDto["zone"]> = {
  바다: "SEA",
  산악: "SNOW",
  자연: "VALLEY",
  문화: "RETRO",
  포토: "PHOTO",
};

const zoneToTheme: Record<StampDto["zone"], StampTheme> = {
  SEA: "바다",
  SNOW: "산악",
  VALLEY: "자연",
  RETRO: "문화",
  PHOTO: "포토",
};

export default function CompletedStampsPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);
  const [selectedTheme, setSelectedTheme] = useState<StampTheme>("바다");
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedStampId, setSelectedStampId] = useState<string | null>(null);
  const [apiStamps, setApiStamps] = useState<StampItem[] | null>(null);

  useEffect(() => {
    if (!hydrated || !accessToken) {
      setApiStamps(null);
      return;
    }

    Promise.all([
      listStamps(accessToken, { zone: themeToZone[selectedTheme], order: sortOrder === "latest" ? "desc" : "asc" }),
      listRecords(accessToken),
    ])
      .then(([items, records]) => setApiStamps(items.map((stamp) => {
        const stampReview = getStampReview(stamp, records);

        return {
        id: stamp.id,
        theme: zoneToTheme[stamp.zone],
        place: stamp.title,
        date: new Date(stamp.visitedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\. /g, ".").replace(/\.$/, ""),
        emotion: stampReview.emotion,
        review: stampReview.review,
      };
      })))
      .catch(() => setApiStamps([]));
  }, [accessToken, hydrated, selectedTheme, sortOrder]);

  const stamps = apiStamps ?? previewStamps;
  const selectedStamp = stamps.find((stamp) => stamp.id === selectedStampId) ?? null;
  const visibleStamps = useMemo(() => apiStamps !== null ? stamps : stamps.filter((stamp) => stamp.theme === selectedTheme).sort((a, b) => sortOrder === "latest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)), [apiStamps, selectedTheme, sortOrder, stamps]);

  return <MainShell>
    <main className="mx-auto w-full max-w-[432px] px-4 py-[30px] lg:px-0">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[14px] leading-[1.4] tracking-[-0.35px]"><Link className="text-[#767676]" href="/records">나의 기록</Link><ChevronRight className="h-4 w-4 text-[#767676]" strokeWidth={1.8} /><span className="font-semibold text-[#111111]">완료한 스탬프</span></nav>
      <div className="mt-5"><h1 className="text-[24px] font-bold leading-[1.4] tracking-[-0.6px] text-[#111111]">완료한 스탬프</h1><p className="mt-1 text-[14px] leading-[1.4] tracking-[-0.35px] text-[#505050]">여행에서 모은 나만의 스탬프를 종류 별로 모아 볼 수 있어요.</p></div>
      <section className="mt-9"><div className="flex items-center justify-between gap-3"><div className="flex flex-wrap gap-2">{themes.map((theme) => <button key={theme} className={`h-6 rounded-full px-2 text-[12px] tracking-[-0.3px] ${theme === selectedTheme ? "border border-[#ff1f4c] bg-[#ffeaee] font-semibold text-[#ff1f4c]" : "bg-[#f6f6f6] text-[#111111]"}`} onClick={() => setSelectedTheme(theme)} type="button">{theme}</button>)}</div><div className="relative"><button className="inline-flex h-6 items-center gap-1 rounded-md border border-[#f1f1f5] bg-white px-2 text-[12px] tracking-[-0.3px] text-[#111111] shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)]" onClick={() => setSortOpen((open) => !open)} type="button">{sortOrder === "latest" ? "최신 순" : "오래된 순"}<ChevronDown className="h-[14px] w-[14px]" strokeWidth={1.8} /></button>{sortOpen ? <div className="absolute right-0 top-7 z-10 w-20 overflow-hidden rounded-md border border-[#f1f1f5] bg-white text-[12px] shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)]"><button className="block w-full px-2 py-1.5 text-left hover:bg-[#f6f6f6]" onClick={() => { setSortOrder("latest"); setSortOpen(false); }} type="button">최신 순</button><button className="block w-full px-2 py-1.5 text-left hover:bg-[#f6f6f6]" onClick={() => { setSortOrder("oldest"); setSortOpen(false); }} type="button">오래된 순</button></div> : null}</div></div>
        <div className="mt-5 grid grid-cols-3 gap-[6px]">{visibleStamps.map((stamp) => { const style = themeStyle[stamp.theme]; return <button key={stamp.id} className="overflow-hidden rounded-lg bg-white text-left shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)]" onClick={() => setSelectedStampId(stamp.id)} type="button"><div className="flex h-[84px] items-center justify-center" style={{ backgroundColor: style.background }}><img alt="" aria-hidden="true" className="h-[72px] w-[72px] object-contain" src={style.icon} /></div><div className="px-[11px] py-[10px] text-center"><p className="truncate text-[14px] font-semibold leading-[1.4] tracking-[-0.35px] text-[#111111]">{stamp.place}</p><p className="mt-[2px] text-[12px] leading-[1.4] tracking-[-0.3px] text-[#111111]">{stamp.date}</p><span className="mt-[2px] inline-flex h-6 items-center rounded-full bg-[#f6f6f6] px-2 text-[12px] font-semibold tracking-[-0.3px]" style={{ color: style.text }}>완료</span></div></button>; })}</div>
      </section>
    </main>
    {selectedStamp ? <StampReviewModal emotion={selectedStamp.emotion} mode="read" onClose={() => setSelectedStampId(null)} review={selectedStamp.review} /> : null}
  </MainShell>;
}
