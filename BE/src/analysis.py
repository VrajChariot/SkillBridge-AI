"""Asks Gemini to compare a resume with a job posting and validates the reply."""

import json
import logging
import os
import re
from pathlib import Path

from google import genai
from google.genai import types
from pydantic import ValidationError

from src.errors import AppError, ErrorCode
from src.schemas import AtsReport

logger = logging.getLogger(__name__)

MODEL = "gemini-3-flash-preview"
SYSTEM_PROMPT = (
    Path(__file__).resolve().parent.parent / "prompts" / "systemprompt-v1.md"
).read_text(encoding="utf-8")

ANALYSIS_FAILED_DETAIL = (
    "The analysis service returned an unusable response. Try again in a moment."
)
_FENCE = re.compile(r"^```[a-zA-Z]*\s*(.*?)\s*```$", re.DOTALL)


def analyze_resume(resume_text: str, job_description: str) -> AtsReport:
    client = create_client()
    raw = _generate(client, build_user_message(resume_text, job_description))
    return parse_report(raw)


def create_client() -> genai.Client:
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise AppError(
            ErrorCode.SERVICE_UNAVAILABLE,
            503,
            "Analysis is unavailable because the server has no Gemini API key "
            "configured. Try again later.",
        )
    return genai.Client(api_key=api_key)


def build_user_message(resume_text: str, job_description: str) -> str:
    return (
        "Analyze the following resume against the job description.\n\n"
        f"<resume>\n{resume_text}\n</resume>\n\n"
        f"<job_description>\n{job_description}\n</job_description>\n\n"
        "Return your analysis as a single raw JSON object following the schema exactly."
    )


def _generate(client: genai.Client, user_message: str) -> str:
    contents = [
        types.Content(role="user", parts=[types.Part.from_text(text=user_message)])
    ]
    config = types.GenerateContentConfig(
        system_instruction=SYSTEM_PROMPT,
        thinking_config=types.ThinkingConfig(thinking_level=types.ThinkingLevel.HIGH),
        response_mime_type="application/json",
    )
    try:
        chunks = client.models.generate_content_stream(
            model=MODEL, contents=contents, config=config
        )
        return "".join(chunk.text for chunk in chunks if chunk.text)
    except Exception as exc:  # SDK and transport errors share no base class
        logger.error("Gemini request failed", exc_info=exc)
        raise AppError(
            ErrorCode.ANALYSIS_FAILED, 502, ANALYSIS_FAILED_DETAIL
        ) from exc


def strip_code_fences(text: str) -> str:
    cleaned = text.strip()
    match = _FENCE.match(cleaned)
    return match.group(1) if match else cleaned


def parse_report(raw: str) -> AtsReport:
    try:
        return AtsReport.model_validate(json.loads(strip_code_fences(raw)))
    except (json.JSONDecodeError, ValidationError) as exc:
        logger.error("Gemini returned an invalid report: %s", exc)
        raise AppError(
            ErrorCode.ANALYSIS_FAILED, 502, ANALYSIS_FAILED_DETAIL
        ) from exc
