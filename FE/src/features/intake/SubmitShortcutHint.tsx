import { submitShortcut } from "./progressCopy";

const keyClass =
  "min-w-6 rounded-sm border border-rule bg-sheet px-1.5 py-0.5 text-center font-sans text-xs font-medium text-graphite";

/** Visual reminder only; the textarea exposes the shortcut via aria-keyshortcuts. */
export function SubmitShortcutHint() {
  const { modifier, key } = submitShortcut(navigator.platform || navigator.userAgent);
  return (
    <p aria-hidden className="hidden items-center gap-1 text-sm text-graphite sm:flex">
      <kbd className={keyClass}>{modifier}</kbd>
      <kbd className={keyClass}>{key}</kbd>
    </p>
  );
}
