"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthResponseDto, AuthUserDto } from "@/types/auth";

type LoginModalReason = "manual" | "protected-route";

type AuthStore = {
  accessToken: string | null;
  user: AuthUserDto | null;
  loginModalOpen: boolean;
  loginModalReason: LoginModalReason;
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  openLoginModal: (reason?: LoginModalReason) => void;
  closeLoginModal: () => void;
  signIn: (payload: AuthResponseDto) => void;
  setUser: (user: AuthUserDto | null) => void;
  signOut: () => void;
};

const defaultAuthState = {
  accessToken: null,
  user: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...defaultAuthState,
      loginModalOpen: false,
      loginModalReason: "manual",
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      openLoginModal: (reason = "manual") => set({ loginModalOpen: true, loginModalReason: reason }),
      closeLoginModal: () => set({ loginModalOpen: false }),
      signIn: ({ accessToken, user }) =>
        set({
          accessToken,
          user,
          loginModalOpen: false,
        }),
      setUser: (user) => set({ user }),
      signOut: () =>
        set({
          ...defaultAuthState,
          loginModalOpen: false,
        }),
    }),
    {
      name: "planlog-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
