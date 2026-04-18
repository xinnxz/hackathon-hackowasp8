import type { AiSuggestion, Finding } from "../types";

const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const BATCH_SIZE = 5;
const MAX_RETRIES = 2;
const REQUEST_TIMEOUT_MS = 15_000;

export async function generateFixSuggestions(
  findings: Finding[],
  apiKey?: string,
): Promise<Finding[]> {
  const key = apiKey ?? process.env["GEMINI_API_KEY"];
  if (!key) {
    console.error("\x1b[33m[AI] No GEMINI_API_KEY found — using static fallback suggestions.\x1b[0m");
    return findings.map((f) => ({ ...f, aiSuggestion: buildFallbackSuggestion(f) }));
  }

  console.log(`\x1b[35m[AI] Sending ${findings.length} findings to Gemini...\x1b[0m`);

  const results: Finding[] = [];
  for (let i = 0; i < findings.length; i += BATCH_SIZE) {
    const batch = findings.slice(i, i + BATCH_SIZE);
    const settled = await Promise.allSettled(
      batch.map((f) => requestWithRetry(f, key)),
    );
    for (let j = 0; j < batch.length; j++) {
      const finding = batch[j]!;
      const result = settled[j]!;
      if (result.status === "fulfilled") {
        results.push({ ...finding, aiSuggestion: result.value });
      } else {
        console.error(`\x1b[31m[AI] Failed for "${finding.title}": ${String(result.reason)}\x1b[0m`);
        results.push({ ...finding, aiSuggestion: buildFallbackSuggestion(finding) });
      }
    }
  }
  return results;
}

async function requestWithRetry(finding: Finding, apiKey: string): Promise<AiSuggestion> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await callGemini(finding, apiKey);
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES) {
        await sleep(500 * (attempt + 1));
      }
    }
  }
  throw lastError;
}

async function callGemini(finding: Finding, apiKey: string): Promise<AiSuggestion> {
  const prompt = buildPrompt(finding);
  const url = `${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.15,
          maxOutputTokens: 450,
          responseMimeType: "application/json",
        },
      }),
    });
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Gemini HTTP ${response.status}: ${body.slice(0, 200)}`);
  }

  const payload = await response.json() as Record<string, unknown>;
  const text = extractText(payload);
  if (!text) throw new Error("Gemini returned empty content");

  const parsed = tryParseJson(text);
  if (!parsed) throw new Error(`Gemini output is not valid JSON: ${text.slice(0, 100)}`);

  return {
    explanation: safeString(parsed["explanation"], finding.recommendation),
    fixedCode: safeString(parsed["fixedCode"], "// See recommendation above."),
    references: normalizeReferences(parsed["references"], finding),
    source: "gemini",
  };
}

function buildPrompt(finding: Finding): string {
  return [
    "You are an application security expert.",
    "Return ONLY a JSON object (no markdown, no explanation outside the JSON).",
    "Keys: explanation (string), fixedCode (string), references (string[]).",
    "",
    `OWASP Category: ${finding.owaspCategory?.id ?? "N/A"} ${finding.owaspCategory?.name ?? ""}`,
    `Finding type: ${finding.type}`,
    `Severity: ${finding.severity}`,
    `Title: ${finding.title}`,
    `Description: ${finding.description}`,
    `Recommendation: ${finding.recommendation}`,
    "",
    "Provide a concise secure-code fix. fixedCode must be valid code snippet. references must include the OWASP cheat-sheet URL.",
  ].join("\n");
}

function extractText(payload: Record<string, unknown>): string {
  try {
    const candidates = payload["candidates"] as Array<Record<string, unknown>>;
    const parts = (candidates[0]?.["content"] as Record<string, unknown>)?.["parts"] as Array<Record<string, unknown>>;
    const text = parts[0]?.["text"];
    return typeof text === "string" ? text.trim() : "";
  } catch {
    return "";
  }
}

function tryParseJson(raw: string): Record<string, unknown> | null {
  // Strip markdown fences if model ignores responseMimeType
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
  try {
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    // Try to extract first {...} block
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]) as Record<string, unknown>;
      } catch {
        return null;
      }
    }
    return null;
  }
}

function buildFallbackSuggestion(finding: Finding): AiSuggestion {
  return {
    explanation: finding.recommendation,
    fixedCode: buildFallbackCode(finding),
    references: [finding.owaspCategory?.link ?? "https://cheatsheetseries.owasp.org/"],
    source: "fallback",
  };
}

function buildFallbackCode(finding: Finding): string {
  if (finding.type === "injection") {
    return "const query = 'SELECT * FROM users WHERE id = ?';\ndb.query(query, [userId]);";
  }
  if (finding.type === "secret") {
    return "const token = process.env.API_TOKEN;\nif (!token) throw new Error('Missing API_TOKEN env var');";
  }
  if (finding.type === "misconfiguration") {
    return "app.use(cors({ origin: process.env.ALLOWED_ORIGIN?.split(',') ?? [] }));";
  }
  if (finding.type === "xss") {
    return "// Use DOMPurify or framework escaping instead of innerHTML\nconst safe = DOMPurify.sanitize(userInput);\nelement.textContent = safe;";
  }
  if (finding.type === "crypto") {
    return "const { hash } = await import('argon2');\nconst digest = await hash(password, { type: argon2.argon2id });";
  }
  return "// Review the finding, apply the recommendation, and re-run the scanner.";
}

function safeString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function normalizeReferences(value: unknown, finding: Finding): string[] {
  if (Array.isArray(value)) {
    const urls = value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
    if (urls.length > 0) return urls;
  }
  return [finding.owaspCategory?.link ?? "https://cheatsheetseries.owasp.org/"];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
