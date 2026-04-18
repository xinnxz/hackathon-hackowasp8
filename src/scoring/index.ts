import type { Finding, SecurityScore, Severity } from "../types";

/**
 * Penalty weights per severity.
 * Tuned so a single critical finding guarantees an F,
 * and a clean scan earns A+.
 */
const PENALTY: Record<Severity, number> = {
  critical: 25,
  high: 10,
  medium: 3,
  low: 1,
};

type Grade = "A+" | "A" | "B" | "C" | "D" | "F";

interface GradeConfig {
  label: string;
  color: string;
  bg: string;
}

const GRADE_CONFIGS: Record<Grade, GradeConfig> = {
  "A+": { label: "Excellent — No findings", color: "#4ade80", bg: "#14532d" },
  "A":  { label: "Good — Low risk only",   color: "#86efac", bg: "#166534" },
  "B":  { label: "Fair — Minor issues",     color: "#fde047", bg: "#713f12" },
  "C":  { label: "Moderate risk",           color: "#fb923c", bg: "#7c2d12" },
  "D":  { label: "High risk — Act now",     color: "#f87171", bg: "#7f1d1d" },
  "F":  { label: "Critical — Immediate action required", color: "#ff5a76", bg: "#450a0a" },
};

export function calculateSecurityScore(findings: Finding[]): SecurityScore {
  if (findings.length === 0) {
    return { score: 100, grade: "A+", label: GRADE_CONFIGS["A+"].label, color: GRADE_CONFIGS["A+"].color, bg: GRADE_CONFIGS["A+"].bg, breakdown: { critical: 0, high: 0, medium: 0, low: 0 } };
  }

  const breakdown = { critical: 0, high: 0, medium: 0, low: 0 };
  let penalty = 0;
  for (const finding of findings) {
    breakdown[finding.severity] += PENALTY[finding.severity];
    penalty += PENALTY[finding.severity];
  }

  const score = Math.max(0, Math.min(100, 100 - penalty));
  const grade = scoreToGrade(score);
  const cfg = GRADE_CONFIGS[grade];
  return { score, grade, label: cfg.label, color: cfg.color, bg: cfg.bg, breakdown };
}

function scoreToGrade(score: number): Grade {
  if (score === 100) return "A+";
  if (score >= 90)  return "A";
  if (score >= 75)  return "B";
  if (score >= 50)  return "C";
  if (score >= 25)  return "D";
  return "F";
}

export function formatScoreBar(score: number, width = 20): string {
  const filled = Math.round((score / 100) * width);
  const empty = width - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}
