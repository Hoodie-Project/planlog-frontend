"use client";

import { FormEvent, useState } from "react";
import { guestLogin } from "@/api/auth/guest-login";
import { useAuthStore } from "@/store/auth-store";

export function GuestLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const signIn = useAuthStore((state) => state.signIn);
  const [guestId, setGuestId] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!guestId.trim() || !password) {
      setErrorMessage("게스트 아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const response = await guestLogin({ guestId: guestId.trim(), password });
      signIn(response);
      onSuccess();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "게스트 로그인에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <form className="space-y-5" onSubmit={handleSubmit}>
    <label className="block text-[14px] font-semibold text-[#111111]">게스트 아이디<input autoComplete="username" className="mt-2 h-12 w-full rounded-xl border border-[#d9d9d9] px-4 text-[15px] outline-none transition focus:border-[#f30031]" disabled={isSubmitting} onChange={(event) => setGuestId(event.target.value)} placeholder="게스트 아이디를 입력해 주세요" value={guestId} /></label>
    <label className="block text-[14px] font-semibold text-[#111111]">비밀번호<input autoComplete="current-password" className="mt-2 h-12 w-full rounded-xl border border-[#d9d9d9] px-4 text-[15px] outline-none transition focus:border-[#f30031]" disabled={isSubmitting} onChange={(event) => setPassword(event.target.value)} placeholder="비밀번호를 입력해 주세요" type="password" value={password} /></label>
    {errorMessage ? <p className="text-center text-[13px] leading-[1.4] tracking-[-0.3px] text-[#f30031]">{errorMessage}</p> : null}
    <button className="h-12 w-full rounded-xl bg-[#f30031] text-[15px] font-semibold text-white disabled:bg-[#a9a9a9]" disabled={isSubmitting} type="submit">{isSubmitting ? "로그인 중..." : "게스트 로그인"}</button>
  </form>;
}
