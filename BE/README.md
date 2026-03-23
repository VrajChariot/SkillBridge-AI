# SkillBridge AI - Backend Service

FastAPI-based resume analysis service that uses Google's Gemini AI to evaluate resumes against job descriptions with deep reasoning and comprehensive feedback.

## Overview

The backend service is a FastAPI application that provides intelligent resume parsing and ATS (Applicant Tracking System) analysis. It accepts PDF resumes and job descriptions, then uses Google's Gemini 3 Flash model with extended thinking to provide detailed insights on resume-to-job alignment.

## Features

- ✅ **PDF Resume Upload**: Direct PDF file upload with automatic text extraction
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
| Document Processing | Docling                |
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
```

Obtain your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

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

**GET** `/`

Simple health check endpoint.

**Response:**

```json
{
  "Hello": "World"
}
```

### Upload & Analyze Resume

**POST** `/upload`

Analyzes a resume against a job description using AI.

**Parameters:**

- `file` (form-data, required): PDF resume file
- `job_description` (string, required): Job description text

**Example Request:**

```bash
curl -X POST "http://localhost:8000/upload" \
  -F "file=@resume.pdf" \
  -F "job_description=Senior Python Developer..."
```

**Response:**

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

**Status Codes:**

- `200`: Analysis successful
- `400`: Invalid request (missing file or job description)
- `500`: Server error

## Project Structure

```
src/
├── main.py                 # FastAPI app, routes, and core logic
├── __pycache__/           # Python bytecode cache
tests/
├── __init__.py
├── ...                    # Test files (to be added)
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
- `docling` - PDF document extraction
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

```bash
poetry run pytest tests/ -v
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

### Issue: PDF upload fails

**Solution:**

1. Ensure file is a valid PDF
2. Check file size limits (currently no hard limit, but consider adding)
3. Verify `python-multipart` is installed: `poetry show | grep multipart`

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
