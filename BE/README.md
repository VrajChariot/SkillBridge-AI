# SkillBridge AI - Backend Service

FastAPI-based resume analysis service that uses Google's Gemini AI to evaluate resumes against job descriptions with deep reasoning and comprehensive feedback.

## Overview

The backend service is a FastAPI application that provides intelligent resume parsing and ATS (Applicant Tracking System) analysis. It accepts PDF resumes and job descriptions, then uses Google's Gemini 3 Flash model with extended thinking to provide detailed insights on resume-to-job alignment.

## Features

- ✅ **PDF and DOCX Resume Upload**: Up to 4.5 MB (Vercel's request body limit), with automatic text extraction
- ✅ **AI Resume Analysis**: Uses Google Gemini 3 Flash with deep reasoning capabilities
- ✅ **Comprehensive Scoring**: Multi-dimensional analysis including:
  - Overall match score (0-100)
  - Category breakdowns (keywords, experience, skills, education, formatting)
  - Strengths and weaknesses identification
  - Actionable improvement suggestions with impact levels
- ✅ **ATS Optimization**: Specific formatting tips to pass Applicant Tracking Systems
- ✅ **Streaming Support**: Efficient handling of streamed API responses
- ✅ **JSON Output**: Structured, validated JSON responses for frontend integration

## Tech Stack

| Layer               | Technology             |
| ------------------- | ---------------------- |
| Framework           | FastAPI                |
| Server              | Uvicorn                |
| Python              | 3.12+                  |
| AI Model            | Google Gemini 3 Flash  |
| Document Processing | pypdf and python-docx |
| Environment         | Poetry + Python-dotenv |

## Installation

### 1. Prerequisites

- Python 3.12 or higher
- Poetry (recommended) or pip
- Google Gemini API key

### 2. Install Dependencies

```bash
# Using Poetry (recommended)
poetry install

# Or using pip
pip install -r requirements.txt
```

### 3. Configure Environment

Create a `.env` file in the BE directory:

```env
GEMINI_API_KEY=your-api-key-here
CORS_ORIGINS=http://localhost:5173
```

Obtain your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

`CORS_ORIGINS` is a comma-separated allowlist of browser origins permitted to
call the API. Keep it limited to the frontend origins you control. For
example, a separate deployed frontend could use:

```env
CORS_ORIGINS=http://localhost:5173,https://your-frontend.example.com
```

When the frontend and backend are served through the same Vercel project
domain, browser CORS is not required for the `/api` rewrite, so the local
origin can be removed from the production value.

## Running the Service

### Development Mode

```bash
# Using Poetry
poetry run uvicorn src.main:app --reload

# Or directly with Python
python -m uvicorn src.main:app --reload
```

The API will be available at: `http://localhost:8000`

Interactive API documentation: `http://localhost:8000/docs`

### Production Mode

```bash
poetry run uvicorn src.main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### Health Check

**GET** `/api/health`

Simple health check endpoint.

**Response:**

```json
{
  "status": "OK"
}
```

### Upload & Analyze Resume

**POST** `/api/upload`

Analyzes a resume against a job description using AI.

**Parameters:**

- `file` (form-data, required): PDF or DOCX resume, at most 4.5 MB
- `job_description` (form-data, required): Job posting text, at most 20,000 characters after trimming whitespace

**Example Request:**

```bash
curl -X POST "http://localhost:8000/api/upload" \
  -F "file=@resume.pdf" \
  -F "job_description=Senior Python Developer..."
```

**Response:** validated against `src/schemas.py` (mirrors `FE/src/types/ats.ts`). Scores are integers clamped to 0-100, `impact` is one of `high`, `medium`, `low`, and list fields default to `[]`.

```json
{
  "current_score": 78,
  "score_breakdown": {
    "keyword_match": 85,
    "experience_relevance": 80,
    "skills_alignment": 75,
    "education_fit": 70,
    "formatting_clarity": 80
  },
  "strengths": [
    "Strong Python expertise demonstrated in projects",
    "Relevant experience with FastAPI framework",
    "Good communication skills shown in descriptions"
  ],
  "improvements": [
    {
      "section": "Skills",
      "issue": "Missing required AWS certifications mentioned in JD",
      "suggestion": "Add 'AWS Solutions Architect' or relevant AWS certifications",
      "impact": "high"
    },
    {
      "section": "Experience",
      "issue": "No mention of team leadership in current roles",
      "suggestion": "Highlight any mentoring or team lead experience",
      "impact": "medium"
    },
    {
      "section": "Keywords",
      "issue": "Limited use of industry terminology",
      "suggestion": "Include 'microservices', 'Docker', 'Kubernetes', 'CI/CD' where applicable",
      "impact": "medium"
    }
  ],
  "missing_keywords": ["AWS", "Kubernetes", "Docker", "CI/CD", "Microservices"],
  "projected_score_after_improvements": 92,
  "ats_compatibility_tips": [
    "Avoid headers/footers in PDF - ATS may fail to parse",
    "Use standard fonts (Arial, Calibri) for better OCR",
    "Keep consistent date formatting (MM/YYYY or similar)",
    "Use standard section headers (Experience, Skills, Education)"
  ],
  "summary": "Your resume demonstrates solid technical capabilities with a 78% match to this role. Addressing the missing AWS certifications and adding architectural pattern keywords would significantly boost your competitiveness."
}
```

**Errors:**

Every error response has the body `{"detail": "<human readable>", "code": "<code>"}`. The frontend maps `code` to guidance, so treat codes as a stable contract.

| code                       | status | when                                                                       |
| -------------------------- | ------ | -------------------------------------------------------------------------- |
| `file_too_large`           | 413    | Resume is larger than 4.5 MB                                               |
| `unsupported_file_type`    | 415    | Resume is not PDF or DOCX (by content type or extension)                   |
| `resume_unreadable`        | 422    | No file attached, empty file, corrupt or password-protected file, or no extractable text |
| `job_description_missing`  | 422    | `job_description` is missing or only whitespace                            |
| `job_description_too_long` | 422    | `job_description` is longer than 20,000 characters                         |
| `analysis_failed`          | 502    | Gemini call failed, or its reply was not valid JSON matching the schema    |
| `service_unavailable`      | 503    | `GEMINI_API_KEY` is not configured                                         |
| `unknown`                  | 500    | Unexpected server error (details are logged server-side, never returned)   |

Other HTTP errors (for example 404 on an unknown route) use the same body with code `unknown`.

## Project Structure

```
src/
├── main.py                 # FastAPI app, CORS, routes, upload limits
├── errors.py               # Error codes, AppError, JSON exception handlers
├── schemas.py              # Pydantic response models (AtsReport)
├── extraction.py           # PDF/DOCX text extraction
├── analysis.py             # Gemini client, prompt, call, output validation
prompts/
└── systemprompt-v1.md      # Versioned Gemini system prompt
tests/
├── conftest.py             # Fake Gemini client (no network in tests)
├── documents.py            # In-memory PDF/DOCX fixtures
├── factories.py            # Sample model report payloads
├── test_*.py               # Schema, extraction, analysis and API contract tests
pyproject.toml            # Poetry dependency and project config
.env                      # Environment variables (local, not in git)
.gitignore                # Git ignore rules
README.md                 # This file
```

## Configuration

### pyproject.toml

Key dependencies:

- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `google-genai` - Google Gemini API client
- `pypdf` - PDF text extraction
- `python-docx` - DOCX text extraction
- `python-dotenv` - Environment variable management
- `python-multipart` - File upload support

## Development

### Code Style

Follow PEP 8 conventions:

```bash
# Format code
poetry run black src/

# Lint
poetry run pylint src/
```

### Adding Dependencies

```bash
poetry add package-name
```

### Running Tests

Tests use FastAPI's `TestClient` and a fake Gemini client, so they need no API key and never touch the network.

```bash
poetry install --with dev
poetry run pytest

# Or with an existing virtualenv
python -m pytest
```

## Troubleshooting

### Issue: Import errors in Pylance

**Solution:**

1. Verify Poetry environment: `poetry env info -p`
2. In VS Code: `Command Palette → Python: Select Interpreter`
3. Select the `.venv/bin/python` from your BE folder
4. Restart the Language Server

### Issue: GEMINI_API_KEY not recognized

**Solution:**

1. Check `.env` file exists in the root of BE/
2. Verify format: `GEMINI_API_KEY=your-key-here` (no quotes)
3. Restart the development server

### Issue: Resume upload fails

**Solution:** read the `code` in the error body (see the error table above).

1. `unsupported_file_type`: upload a PDF or DOCX
2. `file_too_large`: the limit is 4.5 MB
3. `resume_unreadable`: the file is empty, damaged, password protected, or a scanned image with no text; export a text-based PDF or DOCX
4. Verify `python-multipart` is installed: `poetry show | grep multipart`

### Issue: Slow API response

**Solution:**

1. Normal due to Gemini's extended thinking - expected 10-30 seconds
2. Current implementation uses `ThinkingLevel.HIGH` for detailed analysis
3. Consider caching results if same resumes are analyzed multiple times

## Performance Considerations

- **API Response Time**: 10-30 seconds per analysis due to extended thinking
- **Token Usage**: Varies based on resume and job description length
- **Rate Limits**: Google Gemini API rate limits apply (check your plan)
- **Concurrency**: FastAPI handles concurrent requests; Gemini API rate limiting is the bottleneck

## Security

- ⚠️ **Do not commit `.env` file** - it's in `.gitignore`
- API keys should never be exposed in code or version control
- Consider adding authentication middleware for production
- Validate and sanitize user inputs before processing
- Add CORS configuration if frontend is on different domain

## Future Enhancements

- [ ] Batch resume analysis
- [ ] Resume caching to reduce API calls
- [ ] Multiple language support
- [ ] Custom scoring weights
- [ ] Resume version comparison
- [ ] Historical analysis tracking
- [ ] Integration with job boards (LinkedIn, Indeed)

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test thoroughly
3. Run tests: `poetry run pytest`
4. Commit with clear messages
5. Push to branch and create a pull request

## License

Proprietary - SkillBridge AI

---

**Made with** ❤️ **and** ☕ **by Vraj**

**Questions?** Check the main [README.md](../README.md) for project-wide information or contact the development team.
