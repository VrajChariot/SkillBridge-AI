export interface ScoreBreakdown {
  keyword_match: number;
  experience_relevance: number;
  skills_alignment: number;
  education_fit: number;
  formatting_clarity: number;
}

export interface Improvement {
  section: string;
  issue: string;
  suggestion: string;
  impact: "high" | "medium" | "low";
}

export interface ATSAnalysisResponse {
  current_score: number;
  score_breakdown: ScoreBreakdown;
  strengths: string[];
  improvements: Improvement[];
  missing_keywords: string[];
  projected_score_after_improvements: number;
  ats_compatibility_tips: string[];
  summary: string;
}

export interface AnalysisState {
  loading: boolean;
  error: string | null;
  data: ATSAnalysisResponse | null;
  fileName: string | null;
}
