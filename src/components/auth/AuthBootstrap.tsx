"use client";

import { useEffect, useRef } from "react";
import { getMe } from "@/api/auth/me";
import { MANUAL_MOCK_ACCESS_TOKEN, MANUAL_MOCK_AUTH_RESPONSE } from "@/lib/mock-auth";
import { useAuthStore } from "@/store/auth-store";

const ASSUME_LOGGED_IN = false;

export function AuthBootstrap() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const signIn = useAuthStore((state) => state.signIn);
  const signOut = useAuthStore((state) => state.signOut);
  const validatedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!accessToken) {
      if (ASSUME_LOGGED_IN) {
        // TODO: 실제 로그인 기능 안정화 후 삭제
        signIn(MANUAL_MOCK_AUTH_RESPONSE);
        return;
      }

      validatedTokenRef.current = null;
      setUser(null);
      return;
    }

    if (accessToken === MANUAL_MOCK_ACCESS_TOKEN) {
      validatedTokenRef.current = accessToken;
      setUser(MANUAL_MOCK_AUTH_RESPONSE.user);
      return;
    }

    if (validatedTokenRef.current === accessToken) {
      return;
    }

    validatedTokenRef.current = accessToken;

    void getMe(accessToken)
      .then((user) => {
        setUser(user);
      })
      .catch(() => {
        validatedTokenRef.current = null;
        signOut();
      });
  }, [accessToken, hydrated, setUser, signIn, signOut]);

  return null;
}
