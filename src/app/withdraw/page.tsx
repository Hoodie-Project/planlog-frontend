"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { withdraw } from "@/api/auth/withdraw";
import { MainShell } from "@/components/layout/MainShell";
import { useAuthStore } from "@/store/auth-store";

export default function WithdrawPage() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const closeLoginModal = useAuthStore((state) => state.closeLoginModal);
  const signOut = useAuthStore((state) => state.signOut);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReviewer = user?.isGuest === true;
  const withdrawalDisabled = !hydrated || !accessToken || !agreed || submitting || isReviewer;

  const handleWithdraw = async () => {
    if (withdrawalDisabled || !accessToken) return;

    setSubmitting(true);
    setError(null);

    try {
      await withdraw(accessToken);
      closeLoginModal();
      signOut();
      router.replace("/");
    } catch {
      setError("회원탈퇴 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      setSubmitting(false);
    }
  };

  return (
    <MainShell>
      <section className="mx-auto w-full max-w-[820px] px-[34px] pb-28 pt-12 md:px-4 md:py-16 lg:px-0">
        <p className="text-[14px] font-semibold leading-[1.4] tracking-[-0.35px] text-[#ff1f4c]">PLANLOG</p>
        <h1 className="mt-3 text-[28px] font-bold leading-[1.4] tracking-[-0.7px] text-[#111111] md:text-[32px]">회원탈퇴 안내</h1>
        <p className="mt-3 text-[15px] leading-[1.7] tracking-[-0.35px] text-[#505050]">탈퇴를 진행하면 아래 내용이 즉시 삭제되며, 되돌릴 수 없습니다.</p>

        <div className="mt-8 rounded-2xl border border-[#f1f1f5] bg-white p-6 shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)] md:p-8">
          <h2 className="text-[20px] font-semibold leading-[1.4] tracking-[-0.5px] text-[#111111]">탈퇴 시 삭제되는 내용</h2>
          <ul className="mt-5 list-disc space-y-3 pl-5 text-[15px] leading-[1.7] tracking-[-0.35px] text-[#505050]">
            <li>계정 정보(닉네임, 프로필 등)</li>
            <li>저장한 코스와 찜한 장소</li>
            <li>스탬프와 여행 기록</li>
            <li>동선 매칭 신청, 알림 설정, 코스 피드백</li>
          </ul>

          <label className="mt-8 flex cursor-pointer items-start gap-2 text-[14px] leading-[1.5] tracking-[-0.35px] text-[#505050]">
            <input
              checked={agreed}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#ff1f4c]"
              disabled={isReviewer}
              onChange={(event) => setAgreed(event.target.checked)}
              type="checkbox"
            />
            위 내용을 확인했으며, 탈퇴에 동의합니다.
          </label>

          {error ? <p className="mt-3 text-[14px] leading-[1.5] tracking-[-0.35px] text-[#ff1f4c]">{error}</p> : null}

          <button
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#ff1f4c] px-5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 md:w-auto"
            disabled={withdrawalDisabled}
            onClick={handleWithdraw}
            type="button"
          >
            {submitting ? "탈퇴 처리 중..." : "회원탈퇴 하기"}
          </button>

          {isReviewer ? <p className="mt-3 text-[14px] leading-[1.5] tracking-[-0.35px] text-[#777777]">심사자 계정은 탈퇴가 불가능합니다.</p> : null}
          {!isReviewer && hydrated && !accessToken ? <p className="mt-3 text-[14px] leading-[1.5] tracking-[-0.35px] text-[#777777]">로그인 후 회원탈퇴를 진행할 수 있습니다.</p> : null}
        </div>

        <p className="mt-6 text-[14px] leading-[1.6] tracking-[-0.35px] text-[#777777]">법령에 따라 보관이 필요한 정보는 해당 법령에서 정한 기간 동안 보관될 수 있습니다.</p>
        <div className="mt-8 flex justify-center gap-4 text-[14px] text-[#888888]">
          <Link className="underline underline-offset-4" href="/records">나의 기록</Link>
          <span aria-hidden="true">|</span>
          <Link className="underline underline-offset-4" href="/privacy">개인정보처리방침</Link>
        </div>
      </section>
    </MainShell>
  );
}
