import { describe, expect, it } from "vitest";
import { emptyDraft, firstInvalidField, validateDraft } from "./draft";
import { MISSING_RESUME } from "./validateResume";

const resume = new File(["%PDF"], "cv.pdf", { type: "application/pdf" });
const posting = "Senior engineer building payment APIs in Go and Postgres.";

describe("validateDraft", () => {
  it("passes a posting with a resume", () => {
    const errors = validateDraft({ jobDescription: posting, file: resume }, null);
    expect(firstInvalidField(errors)).toBeNull();
  });

  it("asks for a resume when none is chosen", () => {
    expect(validateDraft({ jobDescription: posting, file: null }, null).resume).toBe(
      MISSING_RESUME,
    );
  });

  it("keeps the rejection reason over the generic missing message", () => {
    const rejection = "Upload a PDF or Word (.docx) file.";
    expect(validateDraft({ jobDescription: posting, file: null }, rejection).resume).toBe(
      rejection,
    );
  });

  it("blocks on a rejected replacement even when an earlier file is kept", () => {
    const rejection = "This file is 12.4 MB. The limit is 4.5 MB.";
    expect(validateDraft({ jobDescription: posting, file: resume }, rejection).resume).toBe(
      rejection,
    );
  });
});

describe("firstInvalidField", () => {
  it("focuses the posting before the resume when both are invalid", () => {
    expect(firstInvalidField(validateDraft(emptyDraft, null))).toBe("posting");
  });

  it("focuses the resume when only the resume is invalid", () => {
    expect(firstInvalidField(validateDraft({ jobDescription: posting, file: null }, null))).toBe(
      "resume",
    );
  });
});
