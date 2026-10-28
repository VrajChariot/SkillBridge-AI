import { useEffect, useRef, useState } from "react";
import { AppFooter } from "./app/AppFooter";
import { AppHeader } from "./app/AppHeader";
import { ServiceNotice } from "./app/ServiceNotice";
import { useAnalysis } from "./app/useAnalysis";
import { IntakeScreen, emptyDraft, type IntakeDraft } from "./features/intake";
import { ReportScreen } from "./features/report";

export default function App() {
  const { state, start, cancel, reset } = useAnalysis();
  const [draft, setDraft] = useState<IntakeDraft>(emptyDraft);
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
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main
        id="main"
        ref={main}
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 outline-none sm:px-8 sm:py-14"
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
