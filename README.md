<div align="center">
  <h1>⛨ OWASP Guardrail V2 Enterprise</h1>
  <p><strong>DevSecOps scanner for Node/JS — OWASP mapping, scoring, SARIF, and optional AI fixes</strong></p>

  [![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
  [![HackOWASP 8.0](https://img.shields.io/badge/HackOWASP-8.0-ff4d6d.svg)](https://dorahacks.io/)
  [![CI: Guardrail](https://github.com/xinnxz/hackowasp8.0/actions/workflows/guardrail.yml/badge.svg)](https://github.com/xinnxz/hackowasp8.0/actions/workflows/guardrail.yml)
  [![AI Powered](https://img.shields.io/badge/AI-Groq%20LLaMA_3.3-a78bfa.svg)](https://console.groq.com/)

  <i>Cyber Security Track — HackOWASP 8.0</i>
</div>

---

## For judges — 2-minute demo

**One command** after clone + `npm install`:

```bash
npm run demo:judge
```

Then open **`report-demo-vulnerable/guardrail-report.html`** (bad app, expect FAIL) and **`report-demo-fixed/guardrail-report.html`** (fixed app, expect PASS / A+). Step-by-step script: **[docs/JUDGE_DEMO.md](docs/JUDGE_DEMO.md)**.

Optional wow factor: set `GROQ_API_KEY`, run `npm run demo:judge:ai`, then `npm run dashboard` after a scan.

---

## The problem

Security findings are often either **noisy** (developers tune out) or **heavy** (full enterprise SAST is hard to adopt in small teams and hackathon timelines). Teams still need **OWASP-relevant signal**, **clear pass/fail policy**, and **artifacts** (SARIF, HTML) that fit real pipelines.

---

## What OWASP Guardrail does

- **Scans** JavaScript/TypeScript-style projects with pattern-based rules (secrets, injection, XSS, weak crypto, dependencies via `npm audit`, and more), maps to **OWASP Top 10**, and produces a **letter grade (A+–F)**.
- **Reports** JSON, HTML, SARIF, Markdown, and a **PR-style Markdown comment** — suitable for GitHub Actions and review workflows.
- **Optional AI remediation** via **Groq (LLaMA 3.3)** for short explanations and fix snippets, plus a **local dashboard** to explore results.

---

## Who this is for (and what we are not)

**Built for:** Node/npm codebases, fast feedback in CI, hackathon-scale scope, and demos where **clarity beats raw rule count**.

**Not a drop-in replacement for** deep semantic analyzers (e.g. full AST taint engines). Guardrail trades some precision for **speed, zero JVM footprint, and a single-tool story** aligned with OWASP categories and developer-friendly output. That is an intentional scope choice for this project.

---

## 30-second quickstart

```bash
git clone https://github.com/xinnxz/hackowasp8.0.git owasp-guardrail
cd owasp-guardrail
npm install
npm run build
npm run demo:judge
```

Groq (optional):

```powershell
# Windows PowerShell
$env:GROQ_API_KEY="your_key_here"
npm run scan:demo:ai
```

```bash
# Linux / macOS
export GROQ_API_KEY="your_key_here"
npm run scan:demo:ai
```

---

## Quality & CI

- **Unit tests:** run `npm test` — **30** tests covering config merge, policy, scanner rules, SARIF rule IDs, Git-bounded config discovery, integration scans (including **single-file** scan targets), and JSON report shape.
- **Build:** `npm run build` (TypeScript → `dist/`).
- **GitHub Actions:** [.github/workflows/guardrail.yml](.github/workflows/guardrail.yml) runs install, scan, and security upload steps on pushes/PRs to `main`/`master`.

---

## Ethics & competition use

- This submission is **original team work** for HackOWASP / DoraHacks rules.
- **Do not commit API keys.** Use `.env` locally (see `.env.example`); rotate any key that was ever pasted into chat or a public log.
- AI suggestions are **assistive** — reviewers should treat them as hints, not audited patches.

---

## Core features

### Interactive dashboard

`npm run dashboard` — local SPA (default **port 4000**): score gauge, OWASP heatmap/radar, filtering, copy-friendly fix text when AI is enabled.

### AI remediation (Groq / LLaMA 3.3)

Groups similar findings to save quota, then requests short explanations and fix snippets. Requires `GROQ_API_KEY`.

### `.guardrailrc.json`

The scanner finds the **Git repository root** (ancestor with `.git`), loads every `.guardrailrc.json` from that root **down to the scan path**, and merges (**repo root first**, then deeper folders). Without Git, only the scan path is used. Deeper folders **override** scalars; `ignore.paths` / `ignore.findings` are **unioned** (deduped).

- **`policy.failOn`:** severities that fail the run (unless `--fail-on=` is set — CLI wins).
- **`policy.scoreThreshold`:** if **> 0**, the run **also fails** when the score is **below** this value.
- **`ignore.paths`:** glob patterns (`*`, `**`) — matching files are skipped.
- **`ignore.findings`:** suppress by `type:…`, `title:…`, or title substring.

**CLI overrides for one run:** `--fail-on=…`, **`--output-dir=…`** (report folder; resolved from current working directory).

```json
{
  "policy": {
    "failOn": ["high", "critical"],
    "scoreThreshold": 0
  },
  "rules": {
    "secrets": true,
    "injection": true,
    "xss": true,
    "dependencies": true
  },
  "ignore": {
    "paths": ["node_modules/**", "dist/**"],
    "findings": ["type:dependency"]
  },
  "report": {
    "formats": ["json", "html", "sarif", "markdown"],
    "outputDir": "./report"
  }
}
```

**Self-scan of this repo:** the root `.guardrailrc.json` disables some rules and ignores `src/dashboard/**` because this codebase contains intentional pattern-test strings. When scanning **application** code, keep those rules **enabled** unless you have a reason not to.

### GitHub PR workflow

On PRs, the workflow can upload **SARIF** to GitHub Security and post a **Markdown PR comment** with score and summary (see workflow file for steps).

---

## npm scripts

| Script | Purpose |
|--------|---------|
| `npm run guardrail -- scan <path>` | Scan a path |
| `npm run scan:demo` / `scan:fixed` | Demo apps without AI |
| `npm run scan:demo:ai` / `scan:fixed:ai` | Demo apps with AI |
| `npm run demo:judge` | **Judge bundle:** build + both demos + separate report folders |
| `npm run demo:judge:ai` | Same with `--with-ai` |
| `npm run dashboard` | Local dashboard |
| `npm test` | Unit tests |
| `npm run build` | Compile TypeScript |

---

## Why we built this (HackOWASP 8.0)

Security tooling should be **understandable in one demo**: show a failing app, show a fixed app, show the same tool producing **SARIF and a grade** for CI. Guardrail targets that story for Node teams and reviewers who care about **OWASP alignment** and **pipeline fit**.

---

<p align="center"><i>Made with care by xinnxz — OWASP Guardrail</i></p>
