import { describe, expect, it } from "vitest";
import { formatBytes } from "./formatBytes";
import { formatElapsed } from "./formatElapsed";
import { analyzingHint, submitShortcut, uploadPercent } from "./progressCopy";

describe("formatBytes", () => {
  it("uses bytes below one kilobyte", () => {
    expect(formatBytes(1)).toBe("1 byte");
    expect(formatBytes(1023)).toBe("1023 bytes");
  });

  it("rounds kilobytes to whole numbers", () => {
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(482 * 1024 + 300)).toBe("482 KB");
  });

  it("switches to megabytes instead of showing 1024 KB", () => {
    expect(formatBytes(1024 * 1024 - 100)).toBe("1 MB");
  });

  it("shows megabytes to one decimal and drops a trailing .0", () => {
    expect(formatBytes(1.2 * 1024 * 1024)).toBe("1.2 MB");
    expect(formatBytes(10 * 1024 * 1024)).toBe("10 MB");
  });
});

describe("formatElapsed", () => {
  it("rolls 0:59 over to 1:00", () => {
    expect(formatElapsed(59)).toBe("0:59");
    expect(formatElapsed(60)).toBe("1:00");
  });

  it("pads seconds and floors fractions", () => {
    expect(formatElapsed(7.9)).toBe("0:07");
    expect(formatElapsed(754)).toBe("12:34");
  });

  it("never shows negative time when the clock skews", () => {
    expect(formatElapsed(-3)).toBe("0:00");
  });
});

describe("uploadPercent", () => {
  it("floors so 99.6% never reads as done", () => {
    expect(uploadPercent(0.425)).toBe(42);
    expect(uploadPercent(0.996)).toBe(99);
    expect(uploadPercent(1)).toBe(99);
  });
});

describe("analyzingHint", () => {
  it("stops promising a minute once a minute has passed", () => {
    expect(analyzingHint(59)).toBe("This can take up to a minute.");
    expect(analyzingHint(60)).not.toBe("This can take up to a minute.");
  });
});

describe("submitShortcut", () => {
  it("uses the command key on Apple platforms only", () => {
    expect(submitShortcut("MacIntel").modifier).toBe("⌘");
    expect(submitShortcut("iPad").modifier).toBe("⌘");
    expect(submitShortcut("Win32").modifier).toBe("Ctrl");
    expect(submitShortcut("Linux x86_64").modifier).toBe("Ctrl");
  });
});
