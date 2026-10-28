/** Typical upper bound for a comparison; past it the copy stops promising. */
export const EXPECTED_ANALYSIS_SECONDS = 60;

/** Never reads 100% before the upload is actually done. */
export function uploadPercent(progress: number): number {
  return Math.min(99, Math.max(0, Math.floor(progress * 100)));
}

export function analyzingHint(elapsedSeconds: number): string {
  return elapsedSeconds < EXPECTED_ANALYSIS_SECONDS
    ? "This can take up to a minute."
    : "Taking longer than usual. Keep waiting or cancel and try again.";
}

/** "⌘ Enter" on Apple platforms, "Ctrl Enter" everywhere else. */
export function submitShortcut(platform: string): { modifier: string; key: string } {
  const apple = /mac|iphone|ipad|ipod/i.test(platform);
  return { modifier: apple ? "⌘" : "Ctrl", key: "Enter" };
}
