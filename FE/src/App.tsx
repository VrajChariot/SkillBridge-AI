import { useEffect, useRef } from "react";
import { AppFooter } from "./app/AppFooter";
import { AppHeader } from "./app/AppHeader";
import { ServiceNotice } from "./app/ServiceNotice";
import { useAnalysis } from "./app/useAnalysis";
import { useDraft } from "./app/useDraft";
import { IntakeScreen } from "./features/intake";
import { ReportScreen } from "./features/report";

export default function App() {
  const { state, start, cancel, reset } = useAnalysis();
  const [draft, setDraft] = useDraft();
  const showReport = state.phase === "done";
  const main = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // Swapping screens: start the new one at the top and move focus there.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    main.current?.focus({ preventScroll: true });
  }, [showReport]);

  const submit = () => {
    if (draft.file) start(draft.file, draft.jobDescription);
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />
      <main
        id="main"
        ref={main}
        tabIndex={-1}
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-6 outline-none sm:px-8 sm:py-8 sm:tall:py-10"
      >
        <ServiceNotice />
        {showReport ? (
          <ReportScreen
            report={state.report}
            fileName={state.fileName}
            onNewComparison={reset}
          />
        ) : (
          <IntakeScreen
            draft={draft}
            onDraftChange={setDraft}
            state={state}
            onSubmit={submit}
            onCancel={cancel}
          />
        )}
      </main>
      <AppFooter />
    </div>
  );
}
