import json

import pytest

from src.analysis import analyze_resume
from src.errors import AppError, ErrorCode
from tests.factories import report_payload

REPORT_JSON = json.dumps(report_payload())


def _error(gemini_setup) -> AppError:
    gemini_setup()
    with pytest.raises(AppError) as caught:
        analyze_resume("Jane Doe, Python", "Backend engineer")
    return caught.value


@pytest.mark.parametrize(
    "reply",
    [
        REPORT_JSON,
        f"```json\n{REPORT_JSON}\n```",
        f"```\n{REPORT_JSON}\n```",
        f"  ```JSON {REPORT_JSON}```  \n",
    ],
    ids=["plain", "json-fence", "bare-fence", "inline-fence"],
)
def test_parses_plain_and_fenced_json(gemini, reply):
    gemini.reply(reply)

    report = analyze_resume("Jane Doe, Python", "Backend engineer")

    assert report.model_dump() == report_payload()


def test_joins_streamed_chunks(gemini):
    middle = len(REPORT_JSON) // 2
    gemini.reply(REPORT_JSON[:middle], REPORT_JSON[middle:])

    assert analyze_resume("resume", "job").current_score == 72


@pytest.mark.parametrize(
    "reply",
    [
        "I could not analyze this resume.",
        "[]",
        json.dumps(report_payload(summary=None)),
        "```json\n{\"current_score\": 70\n```",
    ],
    ids=["prose", "array", "schema-mismatch", "truncated"],
)
def test_unusable_replies_fail_the_analysis(gemini, reply):
    error = _error(lambda: gemini.reply(reply))

    assert (error.code, error.status) == (ErrorCode.ANALYSIS_FAILED, 502)


def test_sdk_errors_fail_the_analysis(gemini):
    error = _error(lambda: gemini.fail(ConnectionError("quota exceeded")))

    assert (error.code, error.status) == (ErrorCode.ANALYSIS_FAILED, 502)
    assert "quota" not in error.detail


@pytest.mark.parametrize("key", ["", "   "])
def test_missing_api_key_means_service_unavailable(gemini, monkeypatch, key):
    monkeypatch.setenv("GEMINI_API_KEY", key)

    error = _error(lambda: gemini.reply(REPORT_JSON))

    assert (error.code, error.status) == (ErrorCode.SERVICE_UNAVAILABLE, 503)
    assert gemini.requests == []
