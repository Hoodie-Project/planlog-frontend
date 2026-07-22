import Link from "next/link";
import { MainShell } from "@/components/layout/MainShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { recordCards, zoneProgress } from "@/lib/mock-data";

export default function RecordsPage() {
  return (
    <MainShell>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-semibold">나의 기록</h1>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>나의 강원도 감성 지도</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {zoneProgress.map((zone) => (
                <div key={zone.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{zone.label}</span>
                    <span>{zone.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-cyan-500" style={{ width: zone.percent }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>나의 여행 성향</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-cyan-50 p-4">
                <p className="text-sm text-cyan-700">하영님은 ‘조용한 바다 산책형’</p>
                <p className="mt-2 text-slate-700">혼자서 바다를 거닐며 충전하는 여행자</p>
              </div>
              {["바다 감성 42%", "레트로 감성 28%", "자연 감성 18%", "포토 감성 12%"].map((item) => (
                <div key={item} className="rounded-lg border p-4">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">최근 저장한 코스</h2>
            <p className="text-sm text-slate-500">전체(3) &gt;</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {recordCards.map((record) => (
              <Card key={record.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{record.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  <p>{record.meta}</p>
                  <p>&quot;{record.note}&quot;</p>
                  <Link className="font-medium text-cyan-700" href={`/records/${record.id}`}>
                    기록 카드 보기
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainShell>
  );
}
