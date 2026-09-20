"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MainShell } from "@/components/layout/MainShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getMeStats, getNotificationSettings, listRecentActivities, type MeStatsDto, type NotificationSettingsDto, type RecentActivityDto, updateNotificationSettings } from "@/api/platform";
import { useAuthStore } from "@/store/auth-store";

export default function MyPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);
  const closeLoginModal = useAuthStore((state) => state.closeLoginModal);
  const signOut = useAuthStore((state) => state.signOut);

  const [summaryStats, setSummaryStats] = useState<MeStatsDto | null>(null);
  const [settings, setSettings] = useState<NotificationSettingsDto | null>(null);
  const [activities, setActivities] = useState<RecentActivityDto[]>([]);

  useEffect(() => {
    if (!hydrated || !accessToken) return;

    Promise.all([getMeStats(accessToken), getNotificationSettings(accessToken), listRecentActivities(accessToken, 5)])
      .then(([nextStats, nextSettings, nextActivities]) => { setSummaryStats(nextStats); setSettings(nextSettings); setActivities(nextActivities); })
      .catch(() => { setSummaryStats(null); setSettings(null); setActivities([]); });
  }, [accessToken, hydrated]);

  const handleSignOut = () => {
    closeLoginModal();
    signOut();
    router.replace("/");
  };

  const statLabels = [
    `저장한 코스 ${summaryStats?.savedCoursesCount ?? "-"}`,
    `스탬프 ${summaryStats?.stampsCount ?? "-"}`,
    `여행 기록 ${summaryStats?.recordsCount ?? "-"}`,
  ];

  const toggleSetting = async (key: keyof NotificationSettingsDto) => {
    if (!accessToken || !settings) return;
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    try { setSettings(await updateNotificationSettings(accessToken, { [key]: next[key] })); } catch { setSettings(settings); }
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
                {statLabels.map((item) => (
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
                {([ ["D-Day 알림", "ddayAlert"], ["축제 알림", "festivalAlert"], ["코스 리마인드", "courseReminder"] ] as const).map(([label, key]) => (
                  <button key={key} className="flex w-full items-center justify-between rounded-lg border p-4 text-left" onClick={() => toggleSetting(key)} type="button">
                    <span>{label}</span>
                    <span className={`text-sm ${settings?.[key] ? "text-cyan-700" : "text-slate-400"}`}>{settings?.[key] ? "ON" : "OFF"}</span>
                  </button>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>최근 활동</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {activities.length ? activities.map((activity) => <div key={`${activity.type}-${activity.occurredAt}`} className="rounded-lg bg-slate-50 p-3 text-sm"><p>{activity.title}</p><p className="mt-1 text-xs text-slate-500">{new Date(activity.occurredAt).toLocaleDateString("ko-KR")}</p></div>) : <p className="text-sm text-slate-500">최근 활동이 없어요.</p>}
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
