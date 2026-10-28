import { useId, useMemo } from "react";
import type { Improvement } from "../../types/ats";
import { EditItem } from "./EditItem";
import { groupEdits } from "./groupEdits";
import { useCompletedEdits } from "./useCompletedEdits";

interface EditChecklistProps {
  improvements: Improvement[];
  reportKey: string;
}

/** Ranked edits, grouped by impact, that the user can tick off as they revise. */
export function EditChecklist({ improvements, reportKey }: EditChecklistProps) {
  const baseId = useId();
  const groups = useMemo(() => groupEdits(improvements), [improvements]);
  const { done, toggle } = useCompletedEdits(reportKey);
  const doneCount = improvements.filter((_, i) => done.has(i)).length;

  return (
    <section aria-labelledby={`${baseId}-title`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h2 id={`${baseId}-title`} className="text-xl font-semibold">
          Edits to make
        </h2>
        {improvements.length > 0 && (
          <p aria-live="polite" className="tabular text-sm text-graphite">
            {doneCount} of {improvements.length} done
          </p>
        )}
      </div>

      {groups.length === 0 ? (
        <p className="mt-3 text-graphite">
          No edits suggested. Your resume is ready to send for this job.
        </p>
      ) : (
        groups.map((group) => (
          <div key={group.impact} className="mt-6">
            <h3 className="flex items-baseline gap-2 border-b border-rule pb-2 text-base font-semibold">
              {group.title}
              <span className="tabular text-sm font-normal text-graphite">
                {group.edits.length} {group.edits.length === 1 ? "edit" : "edits"}
              </span>
            </h3>
            <ul className="divide-y divide-rule">
              {group.edits.map(({ index, edit }) => (
                <EditItem
                  key={index}
                  id={`${baseId}-edit-${index}`}
                  edit={edit}
                  done={done.has(index)}
                  onToggle={() => toggle(index)}
                />
              ))}
            </ul>
          </div>
        ))
      )}
    </section>
  );
}
