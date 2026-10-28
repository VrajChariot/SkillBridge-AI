export function AppHeader() {
  return (
    <header className="border-b border-rule bg-paper" data-print="hide">
      <a
        href="#main"
        className="sr-only rounded bg-ink px-3 py-2 text-sm text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-20"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center px-5 sm:px-8">
        <p className="flex items-center gap-2.5 font-semibold tracking-tight">
          <img src="/favicon.svg" alt="" width={24} height={24} />
          SkillBridge
        </p>
      </div>
    </header>
  );
}
