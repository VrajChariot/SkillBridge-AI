import pytest
from pydantic import ValidationError

from src.schemas import AtsReport
from tests.factories import report_payload


@pytest.mark.parametrize(
    ("raw", "expected"),
    [(0, 0), (100, 100), (101, 100), (-4, 0), (78.6, 79), ("85", 85), (250.0, 100)],
)
def test_scores_are_rounded_and_clamped_into_range(raw, expected):
    breakdown = {**report_payload()["score_breakdown"], "keyword_match": raw}
    report = AtsReport.model_validate(
        report_payload(
            current_score=raw,
            projected_score_after_improvements=raw,
            score_breakdown=breakdown,
        )
    )

    assert report.current_score == expected
    assert report.projected_score_after_improvements == expected
    assert report.score_breakdown.keyword_match == expected


@pytest.mark.parametrize("raw", ["high score", float("nan"), None, [72]])
def test_non_numeric_scores_are_rejected(raw):
    with pytest.raises(ValidationError):
        AtsReport.model_validate(report_payload(current_score=raw))


@pytest.mark.parametrize(("raw", "expected"), [("High", "high"), (" MEDIUM ", "medium"), ("low", "low")])
def test_impact_is_case_insensitive(raw, expected):
    improvement = {**report_payload()["improvements"][0], "impact": raw}

    report = AtsReport.model_validate(report_payload(improvements=[improvement]))

    assert report.improvements[0].impact == expected


def test_unknown_impact_is_rejected():
    improvement = {**report_payload()["improvements"][0], "impact": "critical"}

    with pytest.raises(ValidationError):
        AtsReport.model_validate(report_payload(improvements=[improvement]))


def test_missing_or_null_lists_become_empty():
    payload = report_payload(strengths=None, improvements=None)
    del payload["missing_keywords"]
    del payload["ats_compatibility_tips"]

    report = AtsReport.model_validate(payload)

    assert report.strengths == []
    assert report.improvements == []
    assert report.missing_keywords == []
    assert report.ats_compatibility_tips == []


def test_unknown_fields_are_dropped_from_the_dump():
    report = AtsReport.model_validate(report_payload(weaknesses=["none"]))

    assert set(report.model_dump()) == set(report_payload())


@pytest.mark.parametrize("field", ["summary", "score_breakdown", "current_score"])
def test_required_fields_must_be_present(field):
    payload = report_payload()
    del payload[field]

    with pytest.raises(ValidationError):
        AtsReport.model_validate(payload)
