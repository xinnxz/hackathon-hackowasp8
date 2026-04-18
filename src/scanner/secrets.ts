import type { Finding, Severity } from "../types";

type SecretPattern = {
  title: string;
  severity: Severity;
  regex: RegExp;
  recommendation: string;
};

const secretPatterns: SecretPattern[] = [
  {
    title: "Possible GitHub token committed",
    severity: "critical",
    regex: /\bghp_[A-Za-z0-9]{30,}\b/,
    recommendation: "Remove the token, rotate it, and load credentials from environment variables or a secrets manager.",
  },
  {
    title: "Private key material found",
    severity: "critical",
    regex: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/,
    recommendation: "Delete the committed private key and replace it with a runtime secret reference.",
  },
  {
    title: "Hardcoded JWT or API secret",
    severity: "high",
    regex: /\b(?:jwt|api|secret|token|password)[A-Za-z0-9_]*\s*[:=]\s*["'][A-Za-z0-9_\-\/+=]{16,}["']/i,
    recommendation: "Move credentials into environment variables and rotate compromised values.",
  },
  {
    title: "AWS access key detected",
    severity: "high",
    regex: /\bAKIA[0-9A-Z]{16}\b/,
    recommendation: "Remove exposed AWS keys and rotate IAM credentials immediately.",
  },
  {
    title: "Google API key detected",
    severity: "high",
    regex: /\bAIza[0-9A-Za-z\-_]{35}\b/,
    recommendation: "Rotate the Google API key and move it to secure secret storage.",
  },
  {
    title: "Slack token or webhook detected",
    severity: "high",
    regex: /(xox[baprs]-[A-Za-z0-9-]{10,}|https:\/\/hooks\.slack\.com\/services\/[A-Za-z0-9/_-]+)/,
    recommendation: "Revoke the exposed Slack credential and keep webhook URLs out of source control.",
  },
  {
    title: "Database connection string committed",
    severity: "high",
    regex: /\b(?:mongodb|postgres(?:ql)?|mysql):\/\/[^\s"'`]+/i,
    recommendation: "Move database URLs into environment variables or a vault-backed configuration store.",
  },
];

export function scanSecretLine(file: string, line: number, content: string): Finding[] {
  const findings: Finding[] = [];

  for (const pattern of secretPatterns) {
    if (pattern.regex.test(content)) {
      findings.push({
        type: "secret",
        title: pattern.title,
        severity: pattern.severity,
        file,
        line,
        description: `Secret-like content was detected in source control: ${content.trim().slice(0, 120)}`,
        recommendation: pattern.recommendation,
      });
    }
  }

  const quoted = content.match(/["']([A-Za-z0-9+/_=-]{20,})["']/);
  if (quoted && looksHighEntropy(quoted[1]) && /secret|token|key|password/i.test(content)) {
    findings.push({
      type: "secret",
      title: "High-entropy credential-like value found",
      severity: "high",
      file,
      line,
      description: "A long high-entropy string appears next to a secret-like variable name.",
      recommendation: "Replace the hardcoded value with an environment variable and rotate the credential.",
    });
  }

  return findings;
}

function looksHighEntropy(value: string): boolean {
  const uniqueChars = new Set(value).size;
  return uniqueChars >= 10 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
}
