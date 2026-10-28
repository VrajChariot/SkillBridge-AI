import type { ReactNode } from "react";

/** Highlighter swipe. Use only for content the user should add. */
export function Mark({ children }: { children: ReactNode }) {
  return <mark className="marker">{children}</mark>;
}
