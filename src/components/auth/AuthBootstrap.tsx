"use client";

import { useEffect, useRef } from "react";
import { isLogin, mockGoogleAuthResponse } from "@/lib/mock-auth";
import { useAuthStore } from "@/store/auth-store";

export function AuthBootstrap() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const signIn = useAuthStore((state) => state.signIn);
  const signOut = useAuthStore((state) => state.signOut);
  const bootstrappedRef = useRef(false);

  useEffect(() => {
    if (!hydrated || bootstrappedRef.current) {
      return;
    }

    bootstrappedRef.current = true;

    // TODO : 로그인 기능 개발 시 해당 코드 삭제
    if (isLogin) {
      if (!accessToken) {
        signIn(mockGoogleAuthResponse);
      }
      return;
    }

    if (accessToken) {
      signOut();
    }
  }, [accessToken, hydrated, signIn, signOut]);

  return null;
}
