"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type StatPillProps = {
  icon: string;
  label: string;
  tone?: "default" | "positive";
};

type TimelineItem = {
  name: string;
  time: string;
  category?: string | null;
  congestion?: string | null;
  move?: string | null;
  active?: boolean;
  done?: boolean;
  href?: string;
};

type SectionPanelProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

type RouteMapMockProps = {
  compact?: boolean;
  actionLabel?: string;
  summaryLines: ReactNode;
};

export function BreadcrumbTrail({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[14px] font-medium tracking-[-0.35px] text-slate-400">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-2">
          {item.href ? (
            <Link className="transition hover:text-slate-600" href={item.href}>
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
          {index < items.length - 1 ? <span>&gt;</span> : null}
        </div>
      ))}
    </div>
  );
}

export function SectionPanel({ title, description, children, className, contentClassName }: SectionPanelProps) {
  return (
    <Card className={cn("rounded-[24px] border border-[#efe8dc] bg-white shadow-[0_8px_24px_rgba(17,17,17,0.04)]", className)}>
      <CardContent className={cn("p-6", contentClassName)}>
        {title ? (
          <div className="mb-5">
            <h2 className="text-[28px] font-bold tracking-[-0.7px] text-slate-900">{title}</h2>
            {description ? <p className="mt-2 text-[15px] tracking-[-0.35px] text-slate-500">{description}</p> : null}
          </div>
        ) : null}
        {children}
      </CardContent>
    </Card>
  );
}

export function StatPill({ icon, label, tone = "default" }: StatPillProps) {
  return (
    <span
      className={cn(
        "inline-flex h-12 items-center gap-2 rounded-full border border-[#d9d0c5] bg-[#efe9df] px-5 text-[16px] font-semibold tracking-[-0.35px]",
        tone === "positive" ? "text-[#5fb85f]" : "text-slate-600"
      )}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  );
}

export function RouteMapMock({ compact = false, actionLabel, summaryLines }: RouteMapMockProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#efe8dc] bg-white shadow-[0_10px_30px_rgba(17,17,17,0.04)]">
      <div
        className={cn(
          "rounded-t-[24px] bg-[linear-gradient(180deg,#fff3f6_0%,#fde9ee_100%)] p-6",
          compact && "border border-[#ffd1d8] bg-[linear-gradient(180deg,#fff7f8_0%,#fff0f3_100%)]"
        )}
      >
        <div className={cn("relative overflow-hidden rounded-[20px]", compact ? "h-[360px]" : "h-[520px]")}>
          <div className={cn("absolute rounded-full bg-[#f30031]", compact ? "left-[18%] top-[24%] h-4 w-4 border-[3px] border-white" : "left-[28%] top-[72%] h-7 w-7")} />
          <div className={cn("absolute rounded-full bg-[#f30031]", compact ? "left-[30%] top-[40%] h-4 w-4 border-[3px] border-white" : "left-[33%] top-[52%] h-7 w-7")} />
          <div className={cn("absolute rounded-full bg-[#f30031]", compact ? "left-[42%] top-[24%] h-4 w-4 border-[3px] border-white" : "left-[43%] top-[42%] h-7 w-7")} />
          <div className={cn("absolute rounded-full bg-[#f30031]", compact ? "left-[53%] top-[56%] h-4 w-4 border-[3px] border-white" : "left-[63%] top-[36%] h-7 w-7")} />
          <div className={cn("absolute rounded-full bg-[#f30031]", compact ? "left-[73%] top-[34%] h-4 w-4 border-[3px] border-white" : "left-[70%] top-[20%] h-7 w-7")} />

          <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
            <path
              d={compact ? "M18 24 C26 30, 24 42, 31 40 S43 24, 46 25 S48 58, 53 56 S64 40, 74 34" : "M30 70 L35 52 L45 42 L63 37 L70 22"}
              fill="none"
              stroke={compact ? "#ff7b94" : "#ffc5d1"}
              strokeDasharray={compact ? "4 4" : "2.4 2.4"}
              strokeLinecap="round"
              strokeWidth={compact ? "1.2" : "1.1"}
            />
          </svg>

          <div
            className={cn(
              "absolute text-[#f30031]",
              compact ? "left-1/2 top-1/2 w-[320px] -translate-x-1/2 -translate-y-1/2 text-center" : "left-[47%] top-[42%] text-[40px]"
            )}
          >
            {compact ? (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#f30031] bg-white text-[20px] text-[#f30031]">
                  ↗
                </div>
                <div className="mt-5 text-[16px] font-semibold leading-[1.55] tracking-[-0.35px] text-slate-600">{summaryLines}</div>
              </>
            ) : (
              "✈"
            )}
          </div>

          {!compact ? (
            <div className="absolute bottom-6 left-5 rounded-[16px] bg-white/90 px-5 py-4 shadow-[0_10px_25px_rgba(17,17,17,0.06)] backdrop-blur">
              <div className="text-[16px] font-bold leading-[1.6] tracking-[-0.35px] text-slate-700">{summaryLines}</div>
            </div>
          ) : null}
        </div>
      </div>

      {actionLabel ? (
        <div className="p-5">
          <button
            className="inline-flex h-14 w-full items-center justify-center rounded-[16px] bg-[#f30031] text-[24px] font-bold tracking-[-0.55px] text-white transition hover:bg-[#df032f]"
            type="button"
          >
            {actionLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function TimelineList({ items, title, titleClassName }: { items: TimelineItem[]; title: string; titleClassName?: string }) {
  return (
    <SectionPanel className="shadow-[0_10px_30px_rgba(17,17,17,0.04)]" contentClassName="p-6">
      <h2 className={cn("text-[24px] font-bold tracking-[-0.6px] text-slate-900", titleClassName)}>{title}</h2>

      <div className="mt-6">
        {items.map((item, index) => {
          const content = (
            <>
              <div className="relative flex justify-center">
                <span
                  className={cn(
                    "mt-1 rounded-full border-2",
                    item.active
                      ? "border-[#f30031] bg-[#f30031]"
                      : item.done
                        ? "border-[#dfd8cf] bg-[#efebe5]"
                        : "border-[#ff8ba0] bg-white",
                    titleClassName ? "h-7 w-7" : "h-6 w-6"
                  )}
                />
                {index < items.length - 1 ? <span className="absolute top-8 h-[calc(100%+16px)] w-px bg-[#e7ddd0]" /> : null}
              </div>

              <div className="min-w-0">
                <div className={cn("flex items-center gap-2", titleClassName && "gap-3")}>
                  <span className={cn("font-semibold tracking-[-0.35px] text-slate-500", titleClassName ? "text-[18px]" : "text-[16px]")}>{item.time}</span>
                  <p className={cn("font-bold tracking-[-0.5px] text-slate-900", titleClassName ? "text-[22px]" : "text-[20px]")}>{item.name}</p>
                </div>
                {item.category ? <p className={cn("mt-2 tracking-[-0.35px] text-slate-500", titleClassName ? "text-[17px]" : "text-[15px] leading-[1.5]")}>{item.category}</p> : null}
                {item.congestion && item.move ? (
                  <div className={cn("mt-3 flex flex-wrap items-center gap-2 font-semibold tracking-[-0.35px]", titleClassName ? "text-[16px]" : "text-[15px]")}>
                    <span className={item.congestion.includes("보통") ? "text-[#ff9d00]" : "text-[#5fb85f]"}>• {item.congestion}</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-slate-500">{item.move}</span>
                  </div>
                ) : null}
              </div>

              {!titleClassName ? <div className="flex items-center justify-end text-[22px] text-slate-300">{index < items.length - 1 ? "›" : ""}</div> : null}
            </>
          );

          const className = cn(
            "relative gap-4 py-4",
            titleClassName ? "grid grid-cols-[34px_1fr]" : "grid grid-cols-[34px_1fr_20px]",
            item.href && !item.done && "transition hover:rounded-[18px] hover:bg-[#fffcf7]"
          );

          return item.href ? (
            <Link key={`${item.time}-${item.name}`} className={className} href={item.href}>
              {content}
            </Link>
          ) : (
            <div key={`${item.time}-${item.name}`} className={className}>
              {content}
            </div>
          );
        })}
      </div>
    </SectionPanel>
  );
}
