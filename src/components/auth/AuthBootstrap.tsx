"use client";

import { useEffect, useRef } from "react";
import { getMe } from "@/api/auth/me";
import { useAuthStore } from "@/store/auth-store";

const ASSUME_LOGGED_IN = true;
const DEMO_ACCESS_TOKEN = "demo-access-token";
const DEMO_USER = {
  id: "demo-user",
  provider: "GUEST" as const,
  nickname: "하영",
  email: null,
  profileImage: null,
  isGuest: true,
};

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
        signIn({
          accessToken: DEMO_ACCESS_TOKEN,
          user: DEMO_USER,
        });
        return;
      }

      validatedTokenRef.current = null;
      setUser(null);
      return;
    }

    if (accessToken === DEMO_ACCESS_TOKEN) {
      setUser(DEMO_USER);
      validatedTokenRef.current = DEMO_ACCESS_TOKEN;
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
