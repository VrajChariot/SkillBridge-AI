import json

import pytest
from fastapi.testclient import TestClient

from src.main import MAX_JOB_DESCRIPTION_CHARS, MAX_RESUME_BYTES, app
from tests.documents import docx, text_pdf
from tests.factories import report_payload

ALLOWED_ORIGIN = "http://localhost:5173"
POSTING = "Backend engineer: Python, FastAPI, Kubernetes."
PDF = ("resume.pdf", text_pdf("Jane Doe Python FastAPI"), "application/pdf")


@pytest.fixture
def client() -> TestClient:
    return TestClient(app, raise_server_exceptions=False)


def upload(client: TestClient, file=PDF, job_description: str | None = POSTING, **kw):
    files = {"file": file} if file else None
    data = {} if job_description is None else {"job_description": job_description}
    return client.post("/api/upload", files=files, data=data, **kw)


def assert_error(response, status: int, code: str) -> None:
    assert response.status_code == status, response.text
    body = response.json()
    assert body["code"] == code
    assert isinstance(body["detail"], str) and body["detail"]


def test_health(client):
    response = client.get("/api/health")

    assert (response.status_code, response.json()) == (200, {"status": "OK"})


def test_success_returns_the_validated_report(client, gemini):
    improvement = {**report_payload()["improvements"][0], "impact": "High"}
    drifted = report_payload(
        current_score=112,
        projected_score_after_improvements=-3,
        improvements=[improvement],
        weaknesses=["not part of the contract"],
    )
    del drifted["strengths"]
    gemini.reply(f"```json\n{json.dumps(drifted)}\n```")

    response = upload(client)

    assert response.status_code == 200
    assert response.json() == report_payload(
        current_score=100,
        projected_score_after_improvements=0,
        strengths=[],
    )


def test_docx_resumes_are_analyzed(client, gemini):
    gemini.reply(json.dumps(report_payload()))
    file = ("resume.docx", docx(["Jane Doe", "Python"]), "application/octet-stream")

    assert upload(client, file=file).status_code == 200


def test_file_over_10_mb_is_too_large(client):
    file = ("resume.pdf", b"0" * (MAX_RESUME_BYTES + 1), "application/pdf")

    assert_error(upload(client, file=file), 413, "file_too_large")


def test_file_of_exactly_10_mb_is_accepted_for_reading(client):
    file = ("resume.pdf", b"0" * MAX_RESUME_BYTES, "application/pdf")

    assert_error(upload(client, file=file), 422, "resume_unreadable")


def test_unsupported_file_type(client):
    file = ("resume.txt", b"Jane Doe, Python", "text/plain")

    assert_error(upload(client, file=file), 415, "unsupported_file_type")


def test_corrupt_resume_is_unreadable(client):
    file = ("resume.pdf", b"%PDF-1.4 garbage", "application/pdf")

    assert_error(upload(client, file=file), 422, "resume_unreadable")


def test_missing_file_field_is_unreadable(client):
    response = upload(client, file=None)

    assert_error(response, 422, "resume_unreadable")
    assert response.json()["detail"] == "No resume file was attached."


@pytest.mark.parametrize("job_description", [None, "", "  \n\t "])
def test_blank_or_missing_job_description(client, job_description):
    response = upload(client, job_description=job_description)

    assert_error(response, 422, "job_description_missing")


def test_job_description_over_limit_is_too_long(client):
    response = upload(client, job_description="x" * (MAX_JOB_DESCRIPTION_CHARS + 1))

    assert_error(response, 422, "job_description_too_long")


def test_job_description_at_limit_ignores_surrounding_whitespace(client, gemini):
    gemini.reply(json.dumps(report_payload()))
    posting = f"\n  {'x' * MAX_JOB_DESCRIPTION_CHARS}  \n"

    assert upload(client, job_description=posting).status_code == 200


def test_invalid_model_output_fails_the_analysis(client, gemini):
    gemini.reply("Sorry, I can't help with that.")

    assert_error(upload(client), 502, "analysis_failed")


def test_gemini_errors_fail_the_analysis(client, gemini):
    gemini.fail(TimeoutError("upstream timed out"))

    assert_error(upload(client), 502, "analysis_failed")


def test_missing_api_key_is_service_unavailable(client, monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY")

    assert_error(upload(client), 503, "service_unavailable")


def test_unhandled_errors_hide_internals(client, monkeypatch):
    def explode(*_):
        raise RuntimeError("secret: /srv/keys/gemini.txt")

    monkeypatch.setattr("src.main.extract_resume_text", explode)

    response = upload(client)

    assert_error(response, 500, "unknown")
    assert "secret" not in response.text


def test_unknown_routes_use_the_error_shape(client):
    assert_error(client.get("/api/nope"), 404, "unknown")


def test_cors_preflight_from_allowed_origin(client):
    response = client.options(
        "/api/upload",
        headers={
            "Origin": ALLOWED_ORIGIN,
            "Access-Control-Request-Method": "POST",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == ALLOWED_ORIGIN


def test_cors_rejects_other_origins(client):
    response = client.options(
        "/api/upload",
        headers={
            "Origin": "https://evil.example",
            "Access-Control-Request-Method": "POST",
        },
    )

    assert "access-control-allow-origin" not in response.headers


def test_error_responses_are_readable_cross_origin(client):
    file = ("resume.txt", b"Jane", "text/plain")

    response = upload(client, file=file, headers={"Origin": ALLOWED_ORIGIN})

    assert response.status_code == 415
    assert response.headers["access-control-allow-origin"] == ALLOWED_ORIGIN
