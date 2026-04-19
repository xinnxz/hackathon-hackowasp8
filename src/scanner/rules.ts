import path from "node:path";
import type { GuardrailConfig } from "../config";
import type { Finding } from "../types";

type RuleFlags = GuardrailConfig["rules"];

export function scanRuleLine(file: string, line: number, content: string, rules?: RuleFlags): Finding[] {
  const findings: Finding[] = [];
  const on = (flag?: boolean) => flag !== false;

  if (on(rules?.cors) && (/cors\s*\(\s*\{\s*origin\s*:\s*["']\*["']/.test(content) || /Access-Control-Allow-Origin["']?\s*[:=]\s*["']\*["']/.test(content))) {
    findings.push({
      type: "misconfiguration",
      title: "Wildcard CORS policy detected",
      severity: "high",
      file,
      line,
      description: "Allowing every origin weakens browser-side trust boundaries and can expose authenticated endpoints.",
      recommendation: "Restrict allowed origins to trusted hosts or make the policy environment-specific.",
    });
  }

  if (on(rules?.injection) && (/SELECT .*[$`"']\s*\+\s*[A-Za-z0-9_.]+/i.test(content) || /query\s*\(\s*["'`].*SELECT .*['"`]\s*\+\s*/i.test(content))) {
    findings.push({
      type: "injection",
      title: "String-concatenated SQL query detected",
      severity: "critical",
      file,
      line,
      description: "Manual query concatenation can enable SQL injection and data exposure.",
      recommendation: "Use parameterized queries or a query builder that binds untrusted input safely.",
    });
  }

  if (on(rules?.authMiddleware) && /app\.(get|post|put|delete)\([^,]+,\s*(async\s*)?\(req,\s*res\)/.test(content) && file.includes(path.join("src", ""))) {
    findings.push({
      type: "access-control",
      title: "Route handler without obvious authorization middleware",
      severity: "medium",
      file,
      line,
      description: "A direct route handler was found without an earlier auth middleware in the same line.",
      recommendation: "Protect sensitive routes with authentication and authorization middleware before the handler.",
    });
  }

  if (on(rules?.xss) && /dangerouslySetInnerHTML|innerHTML\s*=|document\.write\(/.test(content)) {
    findings.push({
      type: "xss",
      title: "Potential XSS sink detected",
      severity: "high",
      file,
      line,
      description: "Direct HTML sinks can enable script injection when content is not sanitized.",
      recommendation: "Sanitize untrusted content or use safer rendering APIs.",
    });
  }

  if (on(rules?.eval) && /\beval\s*\(|\bFunction\s*\(|child_process\.(exec|execSync)\s*\(/.test(content)) {
    findings.push({
      type: "injection",
      title: "Dynamic code execution pattern detected",
      severity: "high",
      file,
      line,
      description: "Dynamic execution APIs are high-risk and can lead to command/code injection.",
      recommendation: "Avoid dynamic evaluation of untrusted input and use allowlisted command wrappers.",
    });
  }

  if (on(rules?.ssrf) && /fetch\s*\(\s*req\.(query|body)|axios\.(get|post)\s*\(\s*req\.(query|body)/.test(content)) {
    findings.push({
      type: "ssrf",
      title: "Potential SSRF flow detected",
      severity: "medium",
      file,
      line,
      description: "Outbound request URL appears to be influenced by user input.",
      recommendation: "Validate destination hosts against an allowlist and block internal IP ranges.",
    });
  }

  if (on(rules?.insecureHttp) && /["'`]http:\/\//i.test(content)) {
    findings.push({
      type: "misconfiguration",
      title: "Insecure HTTP endpoint hardcoded",
      severity: "medium",
      file,
      line,
      description: "Hardcoded non-TLS URL can leak data over plaintext transport.",
      recommendation: "Use HTTPS endpoints and enforce TLS for outbound calls.",
    });
  }

  if (on(rules?.weakCrypto) && /md5|sha1/i.test(content) && /password|hash|crypto/i.test(content)) {
    findings.push({
      type: "crypto",
      title: "Weak cryptographic primitive usage",
      severity: "high",
      file,
      line,
      description: "Weak hash algorithms such as MD5/SHA1 are not safe for credential protection.",
      recommendation: "Use Argon2, bcrypt, or PBKDF2 with modern parameters.",
    });
  }

  if (on(rules?.pathTraversal) && /(\.\.\/|\.\.\\)/.test(content) && /(readFile|writeFile|open|sendFile|path\.join)/.test(content)) {
    findings.push({
      type: "path-traversal",
      title: "Potential path traversal pattern",
      severity: "high",
      file,
      line,
      description: "File path construction appears to include traversal tokens.",
      recommendation: "Normalize paths and validate that final paths remain under an allowlisted base directory.",
    });
  }

  return findings;
}
