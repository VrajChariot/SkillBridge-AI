import { describe, expect, it } from "vitest";
import { countWords, validatePosting } from "./validatePosting";

const words = (n: number) => Array.from({ length: n }, () => "skill").join(" ");

describe("countWords", () => {
  it("splits on any run of whitespace, including newlines and tabs", () => {
    expect(countWords("  Senior\n\nengineer\t(remote)  ")).toBe(3);
  });

  it("counts nothing in whitespace-only text", () => {
    expect(countWords(" \n\t ")).toBe(0);
  });
});

describe("validatePosting", () => {
  it("blocks a whitespace-only posting", () => {
    const result = validatePosting("   \n  ");
    expect(result.error).not.toBeNull();
    expect(result.hint).toBeNull();
  });

  it("allows exactly 20,000 characters", () => {
    expect(validatePosting("a".repeat(20_000)).error).toBeNull();
  });

  it("blocks 20,001 characters and says how many to remove", () => {
    expect(validatePosting("a".repeat(20_001)).error).toMatch(/^Remove 1 character\./);
    expect(validatePosting("a".repeat(21_500)).error).toMatch(/^Remove 1,500 characters/);
  });

  it("flags the count from 18,000 characters on", () => {
    expect(validatePosting("a".repeat(17_999)).nearLimit).toBe(false);
    expect(validatePosting("a".repeat(18_000)).nearLimit).toBe(true);
  });

  it("hints under 50 words but still allows submit", () => {
    const short = validatePosting(words(49));
    expect(short.hint).not.toBeNull();
    expect(short.error).toBeNull();
    expect(validatePosting(words(50)).hint).toBeNull();
  });
});
