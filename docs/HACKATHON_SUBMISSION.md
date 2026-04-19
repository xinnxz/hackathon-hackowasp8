# 🛡️ OWASP Guardrail — Enterprise DevSecOps Scanner with AI Auto-Remediation

---

## 💥 The Problem

Most developers skip security scanning because existing tools are fundamentally broken:

- **Enterprise SAST tools** (SonarQube, Checkmarx) → Bloated, requires JVM/Docker, costs thousands, takes minutes to run
- **Basic linters** (ESLint plugins) → Surface-level only, no OWASP mapping, no scoring, no remediation
- **Manual code review** → Doesn't scale, takes days for large codebases
- **GitHub Dependabot** → Only covers dependencies, blind to injection/XSS/secrets in your own code

**74% of breached applications had known vulnerabilities that automated tooling could have caught** (Verizon DBIR 2024).

---

## 🚀 Our Solution

**OWASP Guardrail** is a zero-dependency, AI-powered Static Application Security Testing (SAST) tool for Node.js/TypeScript.

We built an **autonomous security engineer** that:

1. 🔍 **Detects** vulnerabilities across 8+ attack categories in milliseconds
2. 🗺️ **Maps** every finding to OWASP Top 10 (2021) categories
3. 📊 **Grades** your codebase from A+ to F with weighted scoring
4. 🧠 **Fixes** vulnerabilities using Groq LLaMA 3.3-70B AI auto-remediation
5. 🚫 **Blocks** unsafe code from production via CI/CD policy enforcement

**One command. Zero setup. Enterprise-grade results.**

---

## 👑 Killer Features

**⚡ Zero-Dependency Architecture**
No JVM, no Docker, no paid licenses. Runs natively on Node.js. Install under 3 seconds. Scan under 500ms.

**🎯 Full OWASP Top 10 Coverage**
Every vulnerability auto-classified: A01 Broken Access Control, A02 Cryptographic Failures, A03 Injection (SQLi/XSS), A05 Misconfiguration, A06 Vulnerable Components, A07 Auth Failures, A10 SSRF.

**🧠 AI Auto-Remediation (LLaMA 3.3-70B)**
Our killer differentiator. Guardrail doesn't just detect — it **writes the fix**. Each vulnerability is sent to Groq's LLaMA 3.3 model which returns the explanation, fixed code ready to copy-paste, and security references. No other open-source Node.js SAST tool offers this.

**📊 Executive Grading (A+ to F)**
Weighted scoring algorithm: Critical = -25pts, High = -10pts, Medium = -3pts, Low = -1pt. Transforms complex findings into one intuitive grade that executives and developers both understand instantly.

**🛡️ CI/CD Pipeline Gatekeeper**
Configurable policy engine with failOn severity levels, score thresholds, native SARIF 2.1.0 export for GitHub Security Tab, auto-generated PR comments, and exit code 1 on policy violation for automated pipeline blocking.

**🎨 Premium Visual Dashboard**
SaaS-grade interactive dashboard with animated security score gauge, OWASP Top 10 bar charts, severity donut chart, findings table, and AI fix suggestions with one-click copy. Built with Tailwind CSS and Stitch design system.

**📋 Multi-Format Reporting**
Every scan generates 5 formats simultaneously: HTML (visual dashboard), JSON (API integration), SARIF (GitHub Security), Markdown (documentation), and PR Comment (automated feedback).

---

## 🏗️ Tech Stack

- **Runtime:** Node.js 20+ (zero JVM)
- **Language:** TypeScript (strict mode)
- **AI Engine:** Groq Cloud API — LLaMA 3.3-70B
- **Dashboard:** Tailwind CSS + Stitch Design System
- **CI/CD:** GitHub Actions + SARIF 2.1.0
- **Testing:** 30 unit tests, 100% pass rate

---

## 🎮 Quick Start Demo

**Step 1 — Install:**
Clone the repo → npm install

**Step 2 — Scan vulnerable app (watch it FAIL with Grade F, 13 findings):**
npm run scan:demo

**Step 3 — Scan fixed app (watch it PASS with Grade A+, 0 findings):**
npm run scan:fixed

**Step 4 — Scan with AI auto-fix (requires GROQ_API_KEY):**
npm run scan:demo:ai

**Step 5 — Launch interactive dashboard:**
npm run dashboard → Open http://localhost:4000

**Step 6 — One-command judge demo:**
npm run demo:judge

---

## 🏆 Why We Win — Competitive Matrix

**vs SonarQube:** We are 100x lighter (no JVM), 10x faster, and free. Plus we have AI auto-fix — they don't.

**vs ESLint Security:** We have OWASP mapping, grading system, visual dashboard, SARIF output, and AI remediation — they have none of these.

**vs Dependabot:** We scan YOUR code for injection, XSS, secrets, and misconfigurations — Dependabot only checks npm packages.

**vs All competitors:** We are the ONLY open-source Node.js SAST tool that combines OWASP Top 10 mapping + AI code fix generation + executive grading + CI/CD gating + premium dashboard in a single zero-dependency package.

---

## 🔮 Future Roadmap

- Support for Python, Go, and Rust ecosystems
- VS Code Extension with inline fix suggestions
- Team dashboard with historical trend analysis
- Custom rule authoring via YAML DSL
- SBOM (Software Bill of Materials) generation

---

**Built for HackOWASP 8.0 by xinnxz** 🇮🇩

*"We didn't build another scanner. We built the one that makes all others obsolete."*
