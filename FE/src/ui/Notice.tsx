import type { ReactNode } from "react";
import { Info, WarningCircle } from "@phosphor-icons/react";

type Tone = "error" | "info";

const tones: Record<Tone, { box: string; icon: string }> = {
  error: { box: "border-correction/30 bg-correction-faint", icon: "text-correction" },
  info: { box: "border-rule bg-sheet", icon: "text-graphite" },
};

export interface NoticeProps {
  tone: Tone;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}

/** Inline message. Errors are announced immediately; info politely. */
export function Notice({ tone, title, children, action }: NoticeProps) {
  const Icon = tone === "error" ? WarningCircle : Info;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded border px-4 py-3 ${tones[tone].box}`}
    >
      <Icon size={20} weight="bold" aria-hidden className={`mt-0.5 shrink-0 ${tones[tone].icon}`} />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        {children && <div className="mt-0.5 text-sm text-graphite">{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
