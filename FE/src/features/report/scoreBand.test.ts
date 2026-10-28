import { describe, expect, it } from "vitest";
import { clampScore, scoreBand } from "./scoreBand";

describe("scoreBand", () => {
  it.each([
    [39, "weak"],
    [40, "partial"],
    [59, "partial"],
    [60, "good"],
    [79, "good"],
    [80, "strong"],
    [79.5, "good"],
  ])("puts %s in the %s band", (score, band) => {
    expect(scoreBand(score)).toBe(band);
  });

  it("clamps out-of-range scores", () => {
    expect(scoreBand(-20)).toBe("weak");
    expect(scoreBand(140)).toBe("strong");
    expect(scoreBand(Number.NaN)).toBe("weak");
  });
});

describe("clampScore", () => {
  it("keeps values inside 0..100", () => {
    expect(clampScore(-1)).toBe(0);
    expect(clampScore(Number.POSITIVE_INFINITY)).toBe(100);
    expect(clampScore(101)).toBe(100);
    expect(clampScore(64)).toBe(64);
  });
});
