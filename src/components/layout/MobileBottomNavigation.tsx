import Link from "next/link";
import { ArrowUpRight, Plus, UserRound } from "lucide-react";

type MobileBottomNavigationProps = {
  active: "create" | "course" | "records" | null;
  className?: string;
};

const navItems = [
  { href: "/course/create?step=1", label: "코스 만들기", icon: Plus, active: "create" },
  { href: "/course/result", label: "추천 코스", icon: ArrowUpRight, active: "course" },
  { href: "/records", label: "나의 기록", icon: UserRound, active: "records" },
] as const;

export function MobileBottomNavigation({ active, className = "fixed inset-x-0 bottom-0" }: MobileBottomNavigationProps) {
  return (
    <nav aria-label="모바일 주요 메뉴" className={`${className} z-40 grid h-[88px] grid-cols-3 border-t border-[#f1f1f5] bg-white md:hidden`}>
      {navItems.map((item) => {
        const isActive = item.active === active;
        const Icon = item.icon;

        return (
          <Link key={item.href} aria-current={isActive ? "page" : undefined} className={`flex flex-col items-center justify-center gap-1 ${isActive ? "text-[#ff1f4c]" : "text-[#a1a1a1]"}`} href={item.href}>
            <Icon className="h-6 w-6" strokeWidth={1.6} />
            <span className={`text-[14px] leading-[1.4] tracking-[-0.35px] ${isActive ? "font-semibold text-[#111111]" : ""}`}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
