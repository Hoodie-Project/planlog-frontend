import { MainShell } from "@/components/layout/MainShell";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { recordCards } from "@/lib/mock-data";

export default function RecordDetailPage() {
  const record = recordCards[0];

  return (
    <MainShell>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-semibold">기록 카드 상세</h1>
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="bg-slate-950 text-slate-50">
            <CardHeader>
              <CardTitle>공유용 이미지 카드</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>PLANLOG</p>
              <p>2026.06.12</p>
              <p className="text-xl font-semibold">{record.title}</p>
              <p>{record.meta}</p>
              <p className="text-slate-300">&quot;{record.note}&quot;</p>
              <div className="flex gap-3">
                <Button variant="secondary">이미지 저장</Button>
                <Button>공유하기</Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>여행 요약</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {["방문 장소 4곳", "획득 스탬프 3개", "오늘의 감정 평온함", "총 이동거리 2.8km"].map((item) => (
                  <div key={item} className="rounded-lg border p-4">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>획득한 스탬프</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {["오죽헌 · 레트로", "안목해변 · 바다", "주문진 등대 · 포토"].map((item) => (
                  <div key={item} className="rounded-lg border p-4">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainShell>
  );
}
