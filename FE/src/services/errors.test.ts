import { describe, expect, it } from "vitest";
import { ApiError, describeError, errorFromResponse } from "./errors";

describe("errorFromResponse", () => {
  it("prefers the backend error code over the status", () => {
    const error = errorFromResponse(422, {
      code: "resume_unreadable",
      detail: "No text could be extracted.",
    });
    expect(error.code).toBe("resume_unreadable");
    expect(error.message).toBe("No text could be extracted.");
    expect(error.status).toBe(422);
  });

  it("falls back to the status when no backend code is present", () => {
    expect(errorFromResponse(413, {}).code).toBe("file_too_large");
    expect(errorFromResponse(504, "").code).toBe("timeout");
  });

  it("treats a codeless server error as the service being unreachable", () => {
    // e.g. the dev proxy or hosting gateway answering because the backend is down.
    expect(errorFromResponse(500, "").code).toBe("service_unavailable");
    expect(errorFromResponse(502, "<html>Bad gateway</html>").code).toBe("service_unavailable");
  });

  it("keeps backend-reported failures as reported", () => {
    expect(errorFromResponse(500, { code: "unknown", detail: "x" }).code).toBe("unknown");
    expect(errorFromResponse(503, { code: "made_up" }).code).toBe("unknown");
    expect(errorFromResponse(502, { code: "analysis_failed" }).code).toBe("analysis_failed");
  });

  it("treats unrecognised client errors as unknown", () => {
    // FastAPI validation errors carry an array detail and no code.
    expect(errorFromResponse(422, { detail: [{ msg: "x" }] }).code).toBe("unknown");
  });
});

describe("describeError", () => {
  it("gives actionable copy for known codes", () => {
    const copy = describeError(new ApiError("file_too_large", "too big", 413));
    expect(copy.title).toMatch(/10 MB/);
  });

  it("never exposes raw messages of non-API errors", () => {
    const copy = describeError(new TypeError("Cannot read properties of undefined"));
    expect(copy.body).not.toMatch(/undefined/);
  });
});
