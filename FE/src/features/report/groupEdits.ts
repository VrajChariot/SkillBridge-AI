import type { Improvement } from "../../types/ats";

export type Impact = Improvement["impact"];

export interface IndexedEdit {
  /** Position in the original report; stable id for completion state. */
  index: number;
  edit: Improvement;
}

export interface EditGroup {
  impact: Impact;
  title: string;
  edits: IndexedEdit[];
}

const order: { impact: Impact; title: string }[] = [
  { impact: "high", title: "High impact" },
  { impact: "medium", title: "Medium impact" },
  { impact: "low", title: "Low impact" },
];

function normalizeImpact(value: unknown): Impact {
  return value === "high" || value === "medium" ? value : "low";
}

/** Groups edits high → medium → low, keeping report order inside a group. Empty groups are dropped. */
export function groupEdits(improvements: Improvement[]): EditGroup[] {
  return order
    .map(({ impact, title }) => ({
      impact,
      title,
      edits: improvements
        .map((edit, index) => ({ index, edit }))
        .filter(({ edit }) => normalizeImpact(edit.impact) === impact),
    }))
    .filter((group) => group.edits.length > 0);
}
