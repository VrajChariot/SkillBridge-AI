"""Error contract: every failed request returns `{"detail": str, "code": str}`."""

import logging
from enum import StrEnum

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


class ErrorCode(StrEnum):
    FILE_TOO_LARGE = "file_too_large"
    UNSUPPORTED_FILE_TYPE = "unsupported_file_type"
    RESUME_UNREADABLE = "resume_unreadable"
    JOB_DESCRIPTION_MISSING = "job_description_missing"
    JOB_DESCRIPTION_TOO_LONG = "job_description_too_long"
    ANALYSIS_FAILED = "analysis_failed"
    SERVICE_UNAVAILABLE = "service_unavailable"
    UNKNOWN = "unknown"


class AppError(Exception):
    """An expected failure with a stable code the frontend maps to guidance."""

    def __init__(self, code: ErrorCode, status: int, detail: str) -> None:
        super().__init__(detail)
        self.code = code
        self.status = status
        self.detail = detail


MISSING_FILE_DETAIL = "No resume file was attached."
MISSING_JOB_DESCRIPTION_DETAIL = (
    "The job posting is empty. Paste the full posting text and try again."
)
UNEXPECTED_DETAIL = (
    "The server hit an unexpected error. Try again; if it keeps happening, report it."
)


def error_response(
    status: int, code: ErrorCode, detail: str, headers: dict[str, str] | None = None
) -> JSONResponse:
    return JSONResponse(
        status_code=status,
        content={"detail": detail, "code": code},
        headers=headers,
    )


async def _app_error_handler(_: Request, exc: AppError) -> JSONResponse:
    return error_response(exc.status, exc.code, exc.detail)


async def _validation_error_handler(
    _: Request, exc: RequestValidationError
) -> JSONResponse:
    fields = {error["loc"][-1] for error in exc.errors() if error.get("loc")}
    if "file" in fields:
        return error_response(422, ErrorCode.RESUME_UNREADABLE, MISSING_FILE_DETAIL)
    if "job_description" in fields:
        return error_response(
            422, ErrorCode.JOB_DESCRIPTION_MISSING, MISSING_JOB_DESCRIPTION_DETAIL
        )
    return error_response(
        422, ErrorCode.UNKNOWN, "The request was not in the expected format."
    )


async def _http_error_handler(
    _: Request, exc: StarletteHTTPException
) -> JSONResponse:
    detail = exc.detail if isinstance(exc.detail, str) else UNEXPECTED_DETAIL
    return error_response(exc.status_code, ErrorCode.UNKNOWN, detail, exc.headers)


async def _unhandled_error_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error(
        "Unhandled error on %s %s",
        request.method,
        request.url.path,
        exc_info=exc,
    )
    return error_response(500, ErrorCode.UNKNOWN, UNEXPECTED_DETAIL)


def register_error_handlers(app: FastAPI) -> None:
    app.add_exception_handler(AppError, _app_error_handler)
    app.add_exception_handler(RequestValidationError, _validation_error_handler)
    app.add_exception_handler(StarletteHTTPException, _http_error_handler)
    app.add_exception_handler(Exception, _unhandled_error_handler)
