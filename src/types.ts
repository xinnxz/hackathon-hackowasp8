export type Severity = "low" | "medium" | "high" | "critical";

export type FindingType =
  | "secret"
  | "misconfiguration"
  | "injection"
  | "access-control"
  | "dependency"
  | "xss"
  | "ssrf"
  | "crypto"
  | "path-traversal";

export type OwaspCategoryId =
  | "A01:2021"
  | "A02:2021"
  | "A03:2021"
  | "A04:2021"
  | "A05:2021"
  | "A06:2021"
  | "A07:2021"
  | "A08:2021"
  | "A09:2021"
  | "A10:2021";

export type OwaspMapping = {
  id: OwaspCategoryId;
  name: string;
  description: string;
  link: string;
};

export type AiSuggestion = {
  explanation: string;
  fixedCode: string;
  references: string[];
  source: "groq" | "fallback";
};

export type Finding = {
  type: FindingType;
  title: string;
  severity: Severity;
  file: string;
  line: number;
  description: string;
  recommendation: string;
  owaspCategory?: OwaspMapping;
  aiSuggestion?: AiSuggestion;
};

export type SecurityScore = {
  score: number;
  grade: string;
  label: string;
  color: string;
  bg: string;
  breakdown: Record<Severity, number>;
};

export type GuardrailReport = {
  scannedPath: string;
  generatedAt: string;
  policy: {
    failOn: Severity[];
    scoreThreshold: number;
    notes?: string[];
  };
  findings: Finding[];
  summary: Record<Severity, number>;
  securityScore: SecurityScore;
  passed: boolean;
};

export const severityRank: Record<Severity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export const defaultFailOn: Severity[] = ["high", "critical"];
