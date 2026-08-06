"use client";

import Link from "next/link";
import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoginModal } from "@/components/auth/LoginModal";
import { useAuthStore } from "@/store/auth-store";

export function MainShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useAuthStore((state) => state.hydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);

  const navItems = [
    { href: "/", label: "ABOUT", exact: true },
    { href: "/course/create", label: "코스 만들기" },
    { href: "/course/result", label: "추천 코스" },
    { href: "/records", label: "나의 기록" },
  ];
  const protectedPaths = ["/course/create", "/course/result", "/records", "/my"];
  const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path));

  useEffect(() => {
    if (!hydrated || accessToken || !isProtectedRoute) {
      return;
    }

    openLoginModal("protected-route");
  }, [accessToken, hydrated, isProtectedRoute, openLoginModal]);

  const handleProtectedNavigation = (href: string) => {
    if (!hydrated) {
      return;
    }

    if (!accessToken) {
      openLoginModal("protected-route");
      return;
    }

    router.push(href);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-[1240px] items-center justify-between px-4 lg:px-0">
          <Link className="text-2xl font-extrabold tracking-tight text-[#f30031]" href="/">
            PLANLOG
          </Link>
          <nav className="hidden items-center gap-10 text-[17px] md:flex">
            {navItems.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const protectedNav = item.href !== "/";

              return (
                <button
                  key={item.label}
                  className={active ? "font-bold text-slate-900" : "text-slate-600"}
                  onClick={() => (protectedNav ? handleProtectedNavigation(item.href) : router.push(item.href))}
                  type="button"
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
          <nav className="hidden md:flex">
            <button
              className="inline-flex h-9 items-center justify-center rounded-full border border-[#f30031] px-5 text-[16px] text-slate-900"
              onClick={() => {
                if (!accessToken) {
                  openLoginModal("manual");
                  return;
                }

                router.push("/my");
              }}
              type="button"
            >
              {user ? `${user.nickname}님` : "로그인"}
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-white py-[25px] text-center text-[15px] font-semibold leading-[1.4] text-slate-600">
        <p>Contact: Hoodiev@google.com</p>
        <p className="mt-2">Copyright © Hoodiev All right reserved.</p>
      </footer>
      <LoginModal />
    </div>
  );
}
