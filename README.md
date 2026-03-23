# SkillBridge AI

**Intelligent Resume Optimization Using AI-Powered Job Matching**

SkillBridge AI is a comprehensive platform designed to help job seekers and professionals align their resumes with specific job descriptions. Using Google's Gemini API with advanced reasoning capabilities, the platform analyzes resumes against job postings to provide actionable insights for improving competitiveness in the job market.

## Features

- **AI-Powered Resume Analysis**: Leverages Google Gemini 3 Flash with deep reasoning to analyze resume-to-job-description alignment
- **ATS Compatibility Scoring**: Ensures your resume passes Applicant Tracking Systems
- **Detailed Feedback**: Receives comprehensive breakdowns including:
  - Overall match score (0-100)
  - Category-specific scores (keyword match, experience relevance, skills alignment, education fit, formatting)
  - Strengths identification
  - Actionable improvement suggestions with priority levels
  - Missing keywords analysis
  - ATS-specific formatting tips
- **Projected Score Improvements**: Realistic estimates of potential score gains after implementing suggestions
- **PDF Support**: Direct PDF upload capability for automatic text extraction

## Project Structure

```
SkillBridge AI/
├── BE/                  # Backend service (FastAPI)
│   ├── src/
│   │   └── main.py     # FastAPI application with resume analysis endpoints
│   ├── tests/          # Unit and integration tests
│   ├── pyproject.toml  # Python dependencies and project metadata
│   └── README.md       # Backend documentation
├── .git/               # Git version control
└── README.md           # This file
```

## Quick Start

### Prerequisites

- Python 3.12+
- Poetry (for dependency management)
- Google Gemini API key

### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd BE
   ```

2. **Install dependencies:**

   ```bash
   poetry install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

4. **Run the development server:**
   ```bash
   poetry run uvicorn src.main:app --reload
   ```

The API will be available at `http://localhost:8000`.

## API Endpoints

### POST `/upload`

Upload a resume PDF and receive an AI analysis against a job description.

**Parameters:**

- `file` (multipart/form-data): PDF resume file
- `job_description` (string): Job description text to match against

**Response:**

```json
{
  "current_score": 72,
  "score_breakdown": {
    "keyword_match": 75,
    "experience_relevance": 80,
    "skills_alignment": 70,
    "education_fit": 65,
    "formatting_clarity": 75
  },
  "strengths": ["Strong technical background", "Relevant experience"],
  "improvements": [
    {
      "section": "Summary",
      "issue": "Missing key industry terms",
      "suggestion": "Add 'cloud infrastructure' and 'DevOps' to summary",
      "impact": "high"
    }
  ],
  "missing_keywords": ["Kubernetes", "Docker", "CI/CD pipeline"],
  "projected_score_after_improvements": 88,
  "ats_compatibility_tips": ["Use standard resume format", "Avoid graphics"],
  "summary": "Your resume has solid foundation with 72% job match..."
}
```

### GET `/health`

Health check endpoint.

**Response:**

```json
{
  "status": "OK"
}
```

## Technology Stack

### Backend

- **Framework**: FastAPI
- **Server**: Uvicorn
- **AI/ML**: Google Gemini 3 Flash API
- **Document Processing**: Docling (PDF extraction)
- **Environment Management**: Python-dotenv

## Development Guidelines

### Code Structure

- `src/main.py` - FastAPI application and routing
- `AI_resume_parsing()` - Core AI analysis function using Gemini with extended thinking

### Key Features of Implementation

- **Streaming Response Handling**: Efficiently handles streaming chunks from Gemini API
- **JSON Validation**: Ensures clean JSON output with markdown stripping
- **System Prompts**: Carefully crafted expert-level prompts for consistent, detailed analysis
- **High-Reasoning Mode**: Uses Gemini's deep thinking for nuanced evaluation

### Running Tests

```bash
cd BE
poetry run pytest tests/
```

## Environment Variables

Create a `.env` file in the `BE` directory:

```env
GEMINI_API_KEY=your_api_key_here
```

## Troubleshooting

### Import Resolution Issues

If Pylance shows unresolved imports:

1. Ensure you're using the Poetry virtual environment: `poetry env info -p`
2. Select the correct interpreter in VS Code: `Command Palette → Python: Select Interpreter`
3. Choose the `.venv` inside the `BE` folder
4. Restart the Language Server

### API Key Issues

- Verify `GEMINI_API_KEY` is set correctly in `.env`
- Ensure your API key is active and has quota available

## Contributing

1. Create a feature branch
2. Make changes following the existing code style
3. Run tests before submitting
4. Create a pull request with detailed description

## License

Proprietary - SkillBridge AI

## Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**Made with** ❤️ **and** ☕ **by Vraj**
