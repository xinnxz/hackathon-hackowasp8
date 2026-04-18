import type { AiSuggestion, Finding } from "../types";

const fallbackReference = "https://cheatsheetseries.owasp.org/";

export async function generateFixSuggestions(findings: Finding[]): Promise<Finding[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return findings.map((finding) => ({ ...finding, aiSuggestion: buildFallbackSuggestion(finding) }));
  }

  const updated: Finding[] = [];
  for (const finding of findings) {
    try {
      const aiSuggestion = await requestGeminiSuggestion(finding, apiKey);
      updated.push({ ...finding, aiSuggestion });
    } catch {
      updated.push({ ...finding, aiSuggestion: buildFallbackSuggestion(finding) });
    }
  }
  return updated;
}

async function requestGeminiSuggestion(finding: Finding, apiKey: string): Promise<AiSuggestion> {
  const prompt = [
    "You are an application security assistant.",
    "Provide a compact secure coding fix for the finding below.",
    "Return JSON with keys: explanation, fixedCode, references.",
    `Title: ${finding.title}`,
    `Severity: ${finding.severity}`,
    `Description: ${finding.description}`,
    `Recommendation: ${finding.recommendation}`,
  ].join("\n");

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 350 },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini call failed with ${response.status}`);
  }

  const payload = await response.json() as any;
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string" || text.length === 0) {
    throw new Error("Gemini returned empty content");
  }

  const parsed = tryParseJson(text);
  if (!parsed) {
    throw new Error("Gemini output is not valid JSON");
  }

  return {
    explanation: safeString(parsed.explanation, finding.recommendation),
    fixedCode: safeString(parsed.fixedCode, "// Apply the recommendation and rerun the scanner."),
    references: normalizeReferences(parsed.references),
    source: "gemini",
  };
}

function tryParseJson(raw: string): any | null {
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function buildFallbackSuggestion(finding: Finding): AiSuggestion {
  return {
    explanation: `Fallback suggestion: ${finding.recommendation}`,
    fixedCode: buildFallbackCode(finding),
    references: [finding.owaspCategory?.link ?? fallbackReference],
    source: "fallback",
  };
}

function buildFallbackCode(finding: Finding): string {
  if (finding.type === "injection") {
    return "const query = 'SELECT * FROM users WHERE id = ?';\ndb.query(query, [userId]);";
  }
  if (finding.type === "secret") {
    return "const token = process.env.API_TOKEN;\nif (!token) throw new Error('Missing API_TOKEN');";
  }
  if (finding.type === "misconfiguration") {
    return "app.use(cors({ origin: ['https://trusted.example'] }));";
  }
  return "// Apply secure coding controls and verify with OWASP Guardrail.";
}

function safeString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function normalizeReferences(value: unknown): string[] {
  if (Array.isArray(value)) {
    const urls = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    if (urls.length > 0) {
      return urls;
    }
  }
  return [fallbackReference];
}
