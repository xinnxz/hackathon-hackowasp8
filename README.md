# OWASP Guardrail

DevSecOps scanner for hackathons and student teams to catch OWASP-style risks before merge.

## Why this project stands out

- Fail -> fix -> pass demo flow that judges can verify quickly.
- OWASP Top 10 mapping included on every finding.
- SARIF output works with GitHub Security upload.
- Optional AI fix suggestions via Gemini API (`GEMINI_API_KEY`).

## Core features

| Feature | Status |
| --- | --- |
| Secret scanning (GitHub, AWS, Google, Slack, DB URLs) | ✅ |
| Static code rules (CORS, SQL injection, XSS, eval, SSRF, weak crypto, path traversal) | ✅ |
| Dependency risk scan (`npm audit`) | ✅ |
| OWASP Top 10 mapping per finding | ✅ |
| AI fix suggestions (Gemini + fallback) | ✅ |
| Reports (JSON, HTML dashboard, SARIF) | ✅ |
| GitHub Actions workflow | ✅ |

## Project structure

- `src/cli.ts` - entry point and terminal UX
- `src/scanner/` - secrets, code rules, dependency scanners
- `src/owasp/mapping.ts` - OWASP category mapper
- `src/ai/suggestions.ts` - AI/fallback remediation generator
- `src/reporter/` - JSON, HTML dashboard, SARIF builders
- `demo/vulnerable-app` - failing demo target
- `demo/fixed-app` - passing demo target
- `.github/workflows/guardrail.yml` - CI guardrail policy

## Quick start

```bash
npm install
cd demo/vulnerable-app && npm install && cd ../..
cd demo/fixed-app && npm install && cd ../..
```

Run fail scenario:

```bash
npm run scan:demo -- --fail-on=high,critical
```

Run pass scenario:

```bash
npm run scan:fixed -- --fail-on=high,critical
```

Run with AI suggestions:

```bash
set GEMINI_API_KEY=your_api_key_here
npm run scan:demo:ai -- --fail-on=high,critical
```

Generated outputs:

- `report/guardrail-report.json`
- `report/guardrail-report.html`
- `report/guardrail-report.sarif`

## OWASP mapping coverage

| OWASP Category | Trigger examples |
| --- | --- |
| `A01:2021` Broken Access Control | Route without auth middleware |
| `A02:2021` Cryptographic Failures | Weak crypto usage |
| `A03:2021` Injection | SQL concat, eval/exec, XSS sinks |
| `A05:2021` Security Misconfiguration | Wildcard CORS, insecure HTTP |
| `A06:2021` Vulnerable Components | `npm audit` vulnerabilities |
| `A07:2021` Auth Failures | Hardcoded tokens/credentials |
| `A10:2021` SSRF | User-controlled outbound URL patterns |

## Demo script for judges (2 minutes)

1. Run `scan:demo` -> show FAIL with critical/high findings.
2. Open HTML report -> show OWASP mapping, severity donut, and fix suggestions.
3. Run `scan:fixed` -> show PASS.
4. Mention CI integration + SARIF upload in workflow.

## Tests

```bash
npm test
```

## Known limitations

- Rule engine is regex/pattern based and intentionally lightweight for hackathon speed.
- Dependency scan currently uses `npm audit` for Node ecosystems.
- AI suggestions depend on model output and should be reviewed before applying.
