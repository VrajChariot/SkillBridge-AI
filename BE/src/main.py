import os
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from src.analysis import analyze_resume
from src.errors import (
    MISSING_JOB_DESCRIPTION_DETAIL,
    AppError,
    ErrorCode,
    register_error_handlers,
)
from src.extraction import extract_resume_text
from src.schemas import AtsReport

load_dotenv()

# Vercel functions reject request bodies over 4.5 MB, so the resume can't be larger.
MAX_RESUME_BYTES = int(4.5 * 1024 * 1024)
MAX_JOB_DESCRIPTION_CHARS = 20_000

app = FastAPI()
register_error_handlers(app)

allowed_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/api/health")
def read_root():
    return {"status": "OK"}


# Sync handler: FastAPI runs it in a worker thread, so the slow Gemini call
# and PDF parsing never block the event loop.
@app.post("/api/upload", response_model=AtsReport)
def upload_file(file: UploadFile, job_description: str = Form(...)) -> dict[str, Any]:
    resume_bytes = _read_resume(file)
    posting = _validate_job_description(job_description)
    resume_text = extract_resume_text(file.filename, file.content_type, resume_bytes)
    return analyze_resume(resume_text, posting).model_dump()


def _read_resume(file: UploadFile) -> bytes:
    data = file.file.read(MAX_RESUME_BYTES + 1)
    if len(data) > MAX_RESUME_BYTES:
        raise AppError(
            ErrorCode.FILE_TOO_LARGE,
            413,
            "The resume is larger than 4.5 MB. Export a smaller PDF or DOCX and try again.",
        )
    return data


def _validate_job_description(job_description: str) -> str:
    posting = job_description.strip()
    if not posting:
        raise AppError(
            ErrorCode.JOB_DESCRIPTION_MISSING, 422, MISSING_JOB_DESCRIPTION_DETAIL
        )
    if len(posting) > MAX_JOB_DESCRIPTION_CHARS:
        raise AppError(
            ErrorCode.JOB_DESCRIPTION_TOO_LONG,
            422,
            "The job posting is longer than 20,000 characters. "
            "Remove the parts unrelated to the role and try again.",
        )
    return posting
