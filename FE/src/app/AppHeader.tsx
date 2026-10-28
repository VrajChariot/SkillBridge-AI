import type { ReactNode } from "react";

export function AppHeader({ actions }: { actions?: ReactNode }) {
  return (
    <header className="border-b border-rule bg-paper" data-print="hide">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="/" className="flex items-center gap-2.5 rounded font-semibold tracking-tight">
          <img src="/favicon.svg" alt="" width={24} height={24} />
          SkillBridge
        </a>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
