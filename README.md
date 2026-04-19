<div align="center">
  <h1>⛨ OWASP Guardrail V2 Enterprise</h1>
  <p><strong>Next-Gen DevSecOps Scanner with AI Remediation & Interactive Dashboard</strong></p>

  [![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
  [![Security Score](https://img.shields.io/badge/Security_Score-A%2B-4ade80.svg)](#)
  [![HackOWASP 8.0](https://img.shields.io/badge/HackOWASP-8.0-ff4d6d.svg)](#)
  [![AI Powered](https://img.shields.io/badge/AI-Groq%20LLaMA_3.3-a78bfa.svg)](#)

  <i>Built for Cyber Security Track — HackOWASP 8.0</i>
</div>

---

## 🚀 The Missing Link in DevSecOps

Traditional SAST tools generate noisy, static reports that developers ignore. **OWASP Guardrail** revolutionizes the security workflow by combining robust regex pattern matching with **ultra-fast AI remediation (powered by Groq & LLaMA 3.3)** and an **interactive, enterprise-grade web dashboard**.

We don't just tell you that your code is vulnerable. We tell you **why**, we give you the **exact code to fix it**, and we map it directly to the **OWASP Top 10**.

### 🔥 Why Guardrail Wins
1. **Interactive SPA Dashboard:** A premium `localhost` dashboard with animated charts, real-time filtering, and radar graphs for OWASP Top 10 coverage.
2. **AI Fix Suggestions in ~0.5s:** Integrated with Groq (LLaMA 3.3-70B) for lightning-fast, highly accurate code remediation—free from API rate-limiting issues.
3. **Security Scoring System (A+ to F):** Executive-friendly grading system that penalizes critical issues heavily and rewards clean code.
4. **Zero-Friction CI/CD:** Fully automated GitHub Actions workflow that uploads SARIF to GitHub Security and posts an elegant PR comment with your security score.
5. **Project-Level Configuration:** Highly customizable via `.guardrailrc.json`.

---

## 🛠️ Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/xinnxz/hackowasp8.0.git owasp-guardrail
cd owasp-guardrail

# Install dependencies and build
npm install
npm run build
```

### 2. Configure AI (Optional but Highly Recommended)
Get a free, high-limit API key from [Groq Console](https://console.groq.com).

```bash
# Set your API Key (Windows PowerShell)
$env:GROQ_API_KEY="gsk_your_api_key_here"

# (Linux/Mac)
export GROQ_API_KEY="gsk_your_api_key_here"
```

### 3. Run the Scanner

```bash
# Scan the vulnerable demo app WITH AI fixes
npm run scan:demo:ai

# Scan the fixed demo app (to see an A+ score)
npm run scan:fixed:ai
```

### 4. Launch the Interactive Dashboard

```bash
# Spin up the local SPA dashboard on port 4000
npm run dashboard
```

---

## 🎯 Core Features Breakdown

### 📊 The Interactive Dashboard
Run `npm run dashboard` after a scan to unlock a premium web interface featuring:
- **Animated SVG Score Gauge:** Instantly see your A-F Grade.
- **OWASP Heatmap & Radar Chart:** Visualize which OWASP Top 10 categories are most violated.
- **Real-Time Search & Filtering:** Find vulnerabilities by severity or finding type instantly.
- **1-Click Code Copy:** Copy AI-generated code fixes directly to your clipboard.

### 🤖 AI Remediation Engine (Groq / LLaMA 3)
Guardrail intelligently groups similar vulnerabilities (e.g., duplicate dependency flaws) to save API quota, then queries **LLaMA 3.3 70B via Groq** to generate:
- A clear explanation of the exploit.
- A drop-in code snippet to fix the vulnerability.
- Official references directly to the OWASP Cheat Sheet Series.

### ⚙️ `.guardrailrc.json` Configuration
The scanner loads **every** `.guardrailrc.json` from the **filesystem root down to `<scan-path>`** and merges them: **deeper folders override** scalar fields (`policy`, `rules`, `ai`, `report`); `ignore.paths` and `ignore.findings` are **unioned** (deduped). Use this to share org-wide defaults at the repo root and project-specific overrides in subfolders.

- **`policy.failOn`:** severities that fail the build (unless overridden by CLI `--fail-on=`).
- **`policy.scoreThreshold`:** when **greater than 0**, the run **also fails** if the security score falls **below** this value (combined with severity policy).
- **`ignore.paths`:** glob patterns (`*`, `**`) relative to the scan root — matching files are skipped.
- **`ignore.findings`:** suppress findings by `type:…`, `title:…` substring, or exact title match.

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

**CLI vs config:** if you pass `--fail-on=…`, it **overrides** `policy.failOn` from the file for that run.

**Self-scan of this repo:** the root `.guardrailrc.json` disables a few rules (`xss`, `weakCrypto`) and ignores `src/dashboard/**` because the scanner, reporter templates, and dashboard embed string literals that otherwise trigger pattern-only rules. When you scan **application** codebases, keep those rules **enabled**.

### 🤖 CI/CD Integration (GitHub PR Bot)
Guardrail is built for enterprise pipelines. The included GitHub Actions workflow automatically:
1. Runs the scan on every Pull Request.
2. Uploads `.sarif` data to the **GitHub Security tab**.
3. Posts a detailed, emoji-rich **Markdown comment directly on the PR** indicating pass/fail status, security score, and top findings.

---

## 🏆 HackOWASP 8.0 Impact Statement

We built OWASP Guardrail because security tooling shouldn't be a chore—it should be a superpower. By combining **instant AI remediation** with **executive-level scoring** and **seamless CI/CD**, we bridge the gap between security teams (who want compliance) and developers (who want to ship fast).

**This is the future of DevSecOps.**

---
<p align="center"><i>Made with ❤️ by xinnxz</i></p>
