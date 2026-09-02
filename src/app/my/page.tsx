"use client";

import { useRouter } from "next/navigation";
import { MainShell } from "@/components/layout/MainShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuthStore } from "@/store/auth-store";

export default function MyPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const closeLoginModal = useAuthStore((state) => state.closeLoginModal);
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = () => {
    closeLoginModal();
    signOut();
    router.replace("/");
  };

  return (
    <MainShell>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-semibold">마이페이지</h1>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>프로필</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xl font-semibold">{user?.nickname ?? "게스트"}님</p>
              <p className="text-slate-600">{user?.provider ?? "GUEST"} 계정으로 로그인 중</p>
              <div className="grid grid-cols-3 gap-3">
                {["저장한 코스 4", "스탬프 12", "여행 기록 3"].map((item) => (
                  <div key={item} className="rounded-lg bg-slate-100 p-4 text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>알림 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {["D-Day 알림", "축제 알림", "코스 리마인드"].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-lg border p-4">
                    <span>{item}</span>
                    <span className="text-sm text-cyan-700">ON</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>권한 설정 / 기타</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {["위치 권한", "푸시 알림", "심사자 모드 안내", "서비스 소개"].map((item) => (
                  <div key={item} className="rounded-lg border p-4">
                    {item}
                  </div>
                ))}
                <button
                  className="w-full cursor-pointer rounded-lg border p-4 text-left transition-colors hover:bg-slate-50 active:bg-slate-100"
                  onClick={handleSignOut}
                  type="button"
                >
                  로그아웃
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainShell>
  );
}
