import type { ATSAnalysisResponse } from "../../types/ats";

/** Mid-level frontend resume vs "Senior Frontend Engineer, Payments". */
export const paymentsReport: ATSAnalysisResponse = {
  current_score: 64,
  projected_score_after_improvements: 82,
  score_breakdown: {
    keyword_match: 46,
    experience_relevance: 68,
    skills_alignment: 72,
    education_fit: 80,
    formatting_clarity: 61,
  },
  summary:
    "Your React and TypeScript work lines up well with the core of this role, but the resume never mentions payments, checkout flows or PCI compliance, which the posting asks for repeatedly. Leading with measurable checkout or conversion work and naming the payment providers you have touched would close most of the gap.",
  strengths: [
    "Four years of production React with TypeScript, matching the posting's primary stack",
    "Led a design system migration used by six product teams",
    "Clear evidence of performance work: cut bundle size by 38% at Brightline",
    "Accessibility experience, including a WCAG 2.1 AA audit",
  ],
  improvements: [
    {
      section: "Experience",
      issue: "No payments or checkout work is mentioned",
      suggestion:
        "Rewrite the Brightline order-flow bullet to say you rebuilt the checkout page and name the providers you integrated, for example Stripe Elements and Adyen.",
      impact: "high",
    },
    {
      section: "Summary",
      issue: "Summary reads as a generalist frontend profile",
      suggestion:
        "Open with one sentence aimed at this role: frontend engineer focused on reliable, accessible payment experiences.",
      impact: "high",
    },
    {
      section: "Experience",
      issue: "Impact is described without numbers",
      suggestion:
        "Add the conversion or error-rate change from the checkout redesign, e.g. reduced failed payments by 12%.",
      impact: "high",
    },
    {
      section: "Skills",
      issue: "PCI DSS and 3-D Secure are absent",
      suggestion:
        "If you have worked inside PCI scope or handled 3-D Secure challenges, list them under Skills and reference them in a bullet.",
      impact: "medium",
    },
    {
      section: "Experience",
      issue: "Mentoring is implied but never stated",
      suggestion:
        "The posting is senior level; add a line about mentoring the two junior engineers on the design system team.",
      impact: "medium",
    },
    {
      section: "Skills",
      issue: "Testing tools are listed vaguely as 'testing'",
      suggestion: "Name the tools: Playwright, React Testing Library, Vitest.",
      impact: "medium",
    },
    {
      section: "Education",
      issue: "Graduation year takes a full line",
      suggestion: "Move the year to the same line as the degree to save vertical space.",
      impact: "low",
    },
  ],
  missing_keywords: [
    "Payments",
    "Checkout",
    "Stripe",
    "PCI DSS",
    "3-D Secure",
    "Fraud prevention",
    "Idempotency",
    "Playwright",
    "Mentoring",
  ],
  ats_compatibility_tips: [
    "Use standard section headings: Experience, Skills, Education.",
    "Keep the two-column skills table as a single column so parsers read it in order.",
    "Save as PDF with selectable text, not an exported image.",
    "Spell out acronyms once, for example Payment Card Industry (PCI) DSS.",
  ],
};

/** Edge case: strong match, nothing missing, no projected gain. */
export const strongReport: ATSAnalysisResponse = {
  current_score: 92,
  projected_score_after_improvements: 92,
  score_breakdown: {
    keyword_match: 94,
    experience_relevance: 90,
    skills_alignment: 95,
    education_fit: 88,
    formatting_clarity: 91,
  },
  summary:
    "Your resume already speaks the language of this posting and shows directly relevant experience. Only cosmetic edits remain.",
  strengths: [],
  improvements: [
    {
      section: "Contact",
      issue: "LinkedIn URL is not shortened",
      suggestion: "Use your custom LinkedIn URL instead of the default one with numbers.",
      impact: "low",
    },
  ],
  missing_keywords: [],
  ats_compatibility_tips: [],
};
