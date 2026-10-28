import { Check } from "@phosphor-icons/react";
import type { Improvement } from "../../types/ats";

interface EditItemProps {
  id: string;
  edit: Improvement;
  done: boolean;
  onToggle: () => void;
}

/** One suggested edit as a checklist row. Done rows dim but stay readable. */
export function EditItem({ id, edit, done, onToggle }: EditItemProps) {
  const high = edit.impact === "high";
  return (
    <li className="report-edit py-3">
      <label
        htmlFor={id}
        className={`flex cursor-pointer items-start gap-3 border-l-2 pl-4 ${
          high ? "border-correction" : "border-transparent"
        }`}
      >
        <input
          id={id}
          type="checkbox"
          checked={done}
          onChange={onToggle}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm border-2 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink ${
            done ? "border-matched bg-matched text-white" : "border-rule-strong bg-sheet"
          }`}
        >
          {done && <Check size={14} weight="bold" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="inline-block rounded-sm border border-rule px-1.5 text-xs text-graphite">
            {edit.section}
          </span>
          <span className={`mt-1 block ${done ? "font-medium text-graphite" : "font-semibold"}`}>
            {edit.issue}
          </span>
          <span className="mt-0.5 block max-w-prose text-graphite">{edit.suggestion}</span>
        </span>
        {done && <span className="sr-only">Done</span>}
      </label>
    </li>
  );
}
