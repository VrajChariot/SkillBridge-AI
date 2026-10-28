export function AppFooter() {
  return (
    <footer className="border-t border-rule" data-print="hide">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-5 text-sm text-graphite sm:flex-row sm:justify-between sm:px-8">
        <p>SkillBridge doesn't store your resume. It's sent to Google Gemini for analysis.</p>
        <p>
          Built by{" "}
          <a
            href="https://vrajdev.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm font-medium text-ink underline underline-offset-4 hover:no-underline"
          >
            Vraj Shah
          </a>
        </p>
      </div>
    </footer>
  );
}
