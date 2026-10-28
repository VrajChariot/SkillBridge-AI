import { describe, expect, it } from "vitest";
import type { Improvement } from "../../types/ats";
import { groupEdits } from "./groupEdits";

const edit = (issue: string, impact: string): Improvement =>
  ({ section: "Experience", issue, suggestion: "", impact }) as Improvement;

describe("groupEdits", () => {
  it("orders groups high, medium, low and keeps report order inside each", () => {
    const groups = groupEdits([
      edit("a", "low"),
      edit("b", "high"),
      edit("c", "medium"),
      edit("d", "high"),
    ]);
    expect(groups.map((g) => g.impact)).toEqual(["high", "medium", "low"]);
    expect(groups[0].edits.map((e) => e.edit.issue)).toEqual(["b", "d"]);
    expect(groups[0].edits.map((e) => e.index)).toEqual([1, 3]);
  });

  it("treats unknown impact as low", () => {
    const groups = groupEdits([edit("x", "critical"), edit("y", "low")]);
    expect(groups).toHaveLength(1);
    expect(groups[0].impact).toBe("low");
    expect(groups[0].edits.map((e) => e.edit.issue)).toEqual(["x", "y"]);
  });

  it("skips empty groups", () => {
    expect(groupEdits([edit("m", "medium")]).map((g) => g.impact)).toEqual(["medium"]);
    expect(groupEdits([])).toEqual([]);
  });
});
