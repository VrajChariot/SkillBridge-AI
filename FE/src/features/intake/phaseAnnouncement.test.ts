import { describe, expect, it } from "vitest";
import { phaseAnnouncement } from "./phaseAnnouncement";

describe("phaseAnnouncement", () => {
  it("stays quiet when the phase repeats, so progress ticks are not read out", () => {
    expect(phaseAnnouncement("uploading", "uploading")).toBeNull();
    expect(phaseAnnouncement("analyzing", "analyzing")).toBeNull();
  });

  it("confirms a cancel only when leaving a running comparison", () => {
    expect(phaseAnnouncement("analyzing", "idle")).toMatch(/^Comparison cancelled/);
    expect(phaseAnnouncement("uploading", "idle")).toMatch(/^Comparison cancelled/);
    expect(phaseAnnouncement("failed", "idle")).toBeNull();
  });

  it("leaves failures to the error notice", () => {
    expect(phaseAnnouncement("analyzing", "failed")).toBeNull();
  });
});
