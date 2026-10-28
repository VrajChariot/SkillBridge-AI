import pytest

from src.errors import AppError, ErrorCode
from src.extraction import DOCX_CONTENT_TYPE, extract_resume_text
from tests.documents import blank_pdf, docx, encrypted_pdf, text_pdf


def _error(filename, content_type, data) -> AppError:
    with pytest.raises(AppError) as caught:
        extract_resume_text(filename, content_type, data)
    return caught.value


def test_reads_pdf_text():
    text = extract_resume_text("cv.pdf", "application/pdf", text_pdf("Jane Doe Python"))

    assert "Jane Doe Python" in text


def test_reads_docx_paragraphs_and_table_cells():
    data = docx(["Jane Doe", "Backend engineer"], table_cells=["Python", "Kubernetes"])

    text = extract_resume_text("cv.docx", DOCX_CONTENT_TYPE, data)

    for expected in ["Jane Doe", "Backend engineer", "Python", "Kubernetes"]:
        assert expected in text


def test_docx_with_text_only_in_tables_is_readable():
    text = extract_resume_text("cv.docx", DOCX_CONTENT_TYPE, docx([], ["Python"]))

    assert "Python" in text


@pytest.mark.parametrize(
    ("filename", "content_type", "build"),
    [
        ("resume.PDF", "application/octet-stream", lambda: text_pdf("Jane")),
        ("resume", "application/pdf", lambda: text_pdf("Jane")),
        ("Resume.DOCX", None, lambda: docx(["Jane"])),
        ("resume", DOCX_CONTENT_TYPE, lambda: docx(["Jane"])),
    ],
)
def test_type_is_detected_by_content_type_or_extension(filename, content_type, build):
    assert "Jane" in extract_resume_text(filename, content_type, build())


@pytest.mark.parametrize(
    ("filename", "content_type"),
    [("resume.txt", "text/plain"), ("resume.doc", "application/msword"), (None, None)],
)
def test_other_types_are_unsupported(filename, content_type):
    error = _error(filename, content_type, b"Jane Doe")

    assert (error.code, error.status) == (ErrorCode.UNSUPPORTED_FILE_TYPE, 415)


@pytest.mark.parametrize(
    ("filename", "data"),
    [
        ("cv.pdf", b""),
        ("cv.docx", b""),
        ("cv.pdf", b"%PDF-1.4 truncated garbage"),
        ("cv.docx", b"PK\x03\x04 not really a zip"),
        ("cv.docx", text_pdf("A PDF renamed to docx")),
        ("cv.pdf", encrypted_pdf()),
        ("cv.pdf", blank_pdf()),
        ("cv.docx", docx(["   ", ""])),
    ],
    ids=[
        "empty-pdf",
        "empty-docx",
        "corrupt-pdf",
        "corrupt-docx",
        "mislabelled",
        "encrypted-pdf",
        "no-text-pdf",
        "whitespace-docx",
    ],
)
def test_unreadable_resumes(filename, data):
    error = _error(filename, None, data)

    assert (error.code, error.status) == (ErrorCode.RESUME_UNREADABLE, 422)
