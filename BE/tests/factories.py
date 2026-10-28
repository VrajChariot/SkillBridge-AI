from typing import Any


def report_payload(**overrides: Any) -> dict[str, Any]:
    """A well-formed model response; override fields to simulate drift."""
    payload: dict[str, Any] = {
        "current_score": 72,
        "score_breakdown": {
            "keyword_match": 70,
            "experience_relevance": 80,
            "skills_alignment": 65,
            "education_fit": 90,
            "formatting_clarity": 60,
        },
        "strengths": ["Five years of Python services"],
        "improvements": [
            {
                "section": "Skills",
                "issue": "Kubernetes is required but not listed",
                "suggestion": "Add the Kubernetes work from the platform migration",
                "impact": "high",
            }
        ],
        "missing_keywords": ["Kubernetes"],
        "projected_score_after_improvements": 85,
        "ats_compatibility_tips": ["Use a standard Experience heading"],
        "summary": "Strong backend match. Adding Kubernetes closes the main gap.",
    }
    payload.update(overrides)
    return payload
