from io import BytesIO

from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from google import genai
from google.genai import types
from google.genai.types import ThinkingLevel 

from docling.document_converter import DocumentConverter
from docling_core.types.io import DocumentStream
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def read_root():
    return {"status": "OK"}


@app.post("/upload")
async def upload_file(file: UploadFile, job_description: str = Form(...)):
    file_bytes = await file.read()
    source = DocumentStream(
        name=file.filename or "uploaded_document.pdf",
        stream=BytesIO(file_bytes),
    )
    converter = DocumentConverter()
    result = converter.convert(source)
    # return {"filename": file.filename, "text": result.document.export_to_markdown()}
    return AI_resume_parsing(result.document.export_to_markdown(), job_description)

"""
This function takes a resume (as text) and a job description, then uses the Gemini API to analyze how well the resume matches the job description. It constructs a detailed system prompt to guide the AI in providing a structured JSON response that includes a score, breakdown of strengths and weaknesses, missing keywords, and actionable improvement suggestions. The function handles streaming responses from the API and ensures that only valid JSON is returned, stripping any accidental markdown formatting if necessary.
"""
def AI_resume_parsing(resume_query: str, job_description: str):

    system_prompt = """You are an expert ATS (Applicant Tracking System) analyst and professional resume coach with 15+ years of experience in technical recruiting.

    Your task is to evaluate a candidate's resume against a given job description and return a detailed analysis.

    You MUST respond with ONLY a valid JSON object — no markdown, no code fences, no explanation, no preamble. Raw JSON only.

    The JSON must strictly follow this schema:
    {
    "current_score": <integer 0–100>,
    "score_breakdown": {
        "keyword_match": <integer 0–100>,
        "experience_relevance": <integer 0–100>,
        "skills_alignment": <integer 0–100>,
        "education_fit": <integer 0–100>,
        "formatting_clarity": <integer 0–100>
    },
    "strengths": [
        "<string: what the resume already does well relative to the JD>"
    ],
    "improvements": [
        {
        "section": "<string: e.g. Summary, Experience, Skills, Education, Formatting>",
        "issue": "<string: specific problem identified>",
        "suggestion": "<string: exact actionable fix>",
        "impact": "<low | medium | high>"
        }
    ],
    "missing_keywords": [
        "<string: important keyword or phrase from JD missing in resume>"
    ],
    "projected_score_after_improvements": <integer 0–100>,
    "ats_compatibility_tips": [
        "<string: ATS-specific formatting or keyword tip>"
    ],
    "summary": "<string: 2–3 sentence overall assessment>"
    }

    Rules:
    - current_score must reflect honest ATS + recruiter match quality.
    - projected_score_after_improvements must be realistic, not inflated — max realistic gain is 25–30 points.
    - improvements array must have at least 3 and no more than 10 items.
    - missing_keywords must list only terms explicitly present in the JD but absent in the resume.
    - Output ONLY the JSON object. Any non-JSON output will break the system."""

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
        system_instruction=system_prompt,         # ← system prompt goes here in Gemini
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