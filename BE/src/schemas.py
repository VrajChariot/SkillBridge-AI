"""Validated shape of an analysis report; mirrors `FE/src/types/ats.ts`."""

import math
from typing import Annotated, Any, Literal

from pydantic import BaseModel, BeforeValidator


def _clamp_score(value: Any) -> Any:
    """Round and clamp numeric model drift into 0-100; leave the rest to pydantic."""
    if isinstance(value, bool) or not isinstance(value, (int, float, str)):
        return value
    try:
        number = float(value)
    except ValueError:
        return value
    if not math.isfinite(number):
        return value
    return min(100, max(0, round(number)))


def _normalize_impact(value: Any) -> Any:
    return value.strip().lower() if isinstance(value, str) else value


def _none_as_empty(value: Any) -> Any:
    return [] if value is None else value


Score = Annotated[int, BeforeValidator(_clamp_score)]
TextList = Annotated[list[str], BeforeValidator(_none_as_empty)]


class ScoreBreakdown(BaseModel):
    keyword_match: Score
    experience_relevance: Score
    skills_alignment: Score
    education_fit: Score
    formatting_clarity: Score


class Improvement(BaseModel):
    section: str
    issue: str
    suggestion: str
    impact: Annotated[
        Literal["high", "medium", "low"], BeforeValidator(_normalize_impact)
    ]


class AtsReport(BaseModel):
    current_score: Score
    score_breakdown: ScoreBreakdown
    strengths: TextList = []
    improvements: Annotated[list[Improvement], BeforeValidator(_none_as_empty)] = []
    missing_keywords: TextList = []
    projected_score_after_improvements: Score
    ats_compatibility_tips: TextList = []
    summary: str
