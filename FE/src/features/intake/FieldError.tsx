import { WarningCircle } from "@phosphor-icons/react";

/** Inline validation message tied to a field via `aria-describedby`. */
export function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="flex items-start gap-1.5 text-sm font-medium text-correction">
      <WarningCircle size={18} weight="bold" aria-hidden className="mt-px shrink-0" />
      {message}
    </p>
  );
}
