import { describe, expect, it } from "vitest";
import { MAX_RESUME_BYTES } from "./limits";
import { validateResume } from "./validateResume";

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function file(name: string, size: number, type = "") {
  return { name, size, type };
}

describe("validateResume", () => {
  it("accepts a PDF of exactly 10 MB", () => {
    expect(validateResume(file("cv.pdf", MAX_RESUME_BYTES, "application/pdf"))).toEqual({
      ok: true,
      kind: "pdf",
    });
  });

  it("rejects one byte over 10 MB without rounding down to the limit", () => {
    expect(validateResume(file("cv.pdf", MAX_RESUME_BYTES + 1, "application/pdf"))).toEqual({
      ok: false,
      message: "This file is 10.1 MB. The limit is 10 MB.",
    });
  });

  it("reports the size of a large file to one decimal", () => {
    const result = validateResume(file("cv.pdf", 12.35 * 1024 * 1024, "application/pdf"));
    expect(result).toEqual({ ok: false, message: "This file is 12.4 MB. The limit is 10 MB." });
  });

  it("accepts a .docx the browser reports with an empty MIME type", () => {
    expect(validateResume(file("resume.docx", 2048, ""))).toEqual({ ok: true, kind: "docx" });
  });

  it("accepts a .docx by MIME type even without the extension", () => {
    expect(validateResume(file("resume", 2048, DOCX_MIME))).toEqual({ ok: true, kind: "docx" });
  });

  it("accepts an uppercase .PDF extension", () => {
    expect(validateResume(file("RESUME.PDF", 2048))).toEqual({ ok: true, kind: "pdf" });
  });

  it("rejects legacy .doc and other types", () => {
    const unsupported = { ok: false, message: "Upload a PDF or Word (.docx) file." };
    expect(validateResume(file("resume.doc", 2048, "application/msword"))).toEqual(unsupported);
    expect(validateResume(file("photo.png", 2048, "image/png"))).toEqual(unsupported);
    expect(validateResume(file("resume.pdf.txt", 2048, "text/plain"))).toEqual(unsupported);
  });

  it("rejects an empty file", () => {
    const result = validateResume(file("cv.pdf", 0, "application/pdf"));
    expect(result.ok).toBe(false);
  });

  it("reports the wrong type before the size", () => {
    expect(validateResume(file("huge.zip", MAX_RESUME_BYTES * 2))).toEqual({
      ok: false,
      message: "Upload a PDF or Word (.docx) file.",
    });
  });
});
