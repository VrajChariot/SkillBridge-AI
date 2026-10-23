from io import BytesIO
from pathlib import Path

from fastapi import FastAPI, HTTPException, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from google import genai
from google.genai import types
from google.genai.types import ThinkingLevel 

from dotenv import load_dotenv
from docx import Document
from pypdf import PdfReader

load_dotenv()
app = FastAPI()
SYSTEM_PROMPT_PATH = Path(__file__).resolve().parent.parent / "prompts" / "systemprompt-v1.md"
SYSTEM_PROMPT = SYSTEM_PROMPT_PATH.read_text(encoding="utf-8")

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


@app.post("/api/upload")
async def upload_file(file: UploadFile, job_description: str = Form(...)):
    file_bytes = await file.read()
    resume_text = extract_resume_text(file.filename, file.content_type, file_bytes)
    return AI_resume_parsing(resume_text, job_description)


def extract_resume_text(
    filename: str | None, content_type: str | None, file_bytes: bytes
) -> str:
    filename = (filename or "").lower()
    if content_type == "application/pdf" or filename.endswith(".pdf"):
        reader = PdfReader(BytesIO(file_bytes))
        return "\n".join(page.extract_text() or "" for page in reader.pages)

    if (
        content_type
        == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        or filename.endswith(".docx")
    ):
        document = Document(BytesIO(file_bytes))
        return "\n".join(paragraph.text for paragraph in document.paragraphs)

    raise HTTPException(
        status_code=415,
        detail="Only PDF and DOCX resume files are supported.",
    )

def AI_resume_parsing(resume_query: str, job_description: str):

    user_message = f"""Analyze the following resume against the job description.

    <resume>
    {resume_query}
    </resume>

    <job_description>
    {job_description}
    </job_description>

    Return your analysis as a single raw JSON object following the schema exactly."""

    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )

    contents = [
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=user_message)],
        ),
    ]

    generate_content_config = types.GenerateContentConfig(
        system_instruction=SYSTEM_PROMPT,
        thinking_config=types.ThinkingConfig(
            thinking_level=ThinkingLevel.HIGH,                # deep reasoning for better analysis
        ),
        response_mime_type="application/json",    # ← forces JSON output natively
    )

    # Collect the streamed chunks into a single string
    raw_output = ""
    for chunk in client.models.generate_content_stream(
        model="gemini-3-flash-preview",         # use gemini-3 
        contents=user_message,
        config=generate_content_config,
    ):
        if chunk.text:
            raw_output += chunk.text

    # Safety net: strip accidental markdown fences
    cleaned = raw_output.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`").strip()
        if cleaned.startswith("json"):
            cleaned = cleaned[4:].strip()

    return json.loads(cleaned)