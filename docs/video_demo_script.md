# 🎬 OWASP Guardrail — Video Demo Script

## Overview
- **Target Duration:** 3 minutes (sweet spot for hackathon judges)
- **Tone:** Confident, professional, zero filler words
- **Language:** English (international hackathon standard)
- **Tools:** Terminal (Windows Terminal dark theme), Browser (Chrome fullscreen), OBS/Loom

---

## 📋 Structure (5 Scenes)

### 🎬 SCENE 1 — Opening Hook (20 seconds)

**Visual:** Dark screen → fade-in OWASP Guardrail banner/logo → cut to you at terminal

**Narration:**
> *"74% of breached applications had known vulnerabilities that automated tooling could have caught. But enterprise scanners like SonarQube need JVMs, Docker, and paid licenses. We built OWASP Guardrail — a zero-dependency scanner that detects, grades, and auto-fixes security flaws using AI. Let me show you how it works in under 3 minutes."*

> [!TIP]
> Judges decide within 15 seconds if your project is worth watching. The opening stat (74%) creates immediate urgency. Speak with authority — no filler words like "um" or "so basically."

---

### 🎬 SCENE 2 — Live Scan: Vulnerable App (50 seconds)

**Visual:** Terminal fullscreen, font 16px+, dark theme

**Step 1 — Type the command live:**
```bash
npm run scan:demo
```

**While output loads (2-3 seconds), narrate:**
> *"I'm scanning a demo app intentionally packed with real-world security flaws — SQL injection, hardcoded GitHub tokens, vulnerable npm packages, and missing authorization."*

**When output appears, point at each section:**
- ⛨ OWASP GUARDRAIL v2.0 banner
- Config auto-merge: `.guardrailrc.json`
- Severity Breakdown table: **2 Critical, 6 High, 2 Medium, 3 Low**
- Findings Preview: highlight the `[CRITICAL] SQL Injection` and `[CRITICAL] GitHub token committed` lines
- Score: **F (0/100)**
- Result: **✖ FAIL (policy violation)**

**Narration:**
> *"13 findings across 4 severity levels. Score: F — zero out of 100. The policy engine automatically blocks the build because we set fail-on high and critical. In a CI/CD pipeline, this code would never reach production."*

---

### 🎬 SCENE 3 — Live Scan: Fixed App + Before/After (30 seconds)

**Visual:** Same terminal, clear screen first

**Type live:**
```bash
npm run scan:fixed
```

**When output appears, highlight:**
- Score: **A+ (100/100)** with full green progress bar
- Result: **✔ PASS**
- Zero findings

**Narration:**
> *"Same app, all vulnerabilities fixed. A+ — 100 out of 100. Zero findings. The policy engine passes the build. This before-and-after — F to A+ — is the story Guardrail tells your team every single commit."*

> [!IMPORTANT]
> This is the climax moment. The transition from Grade F → Grade A+ must feel dramatic. Pause for 1 second after "A+" to let it sink in visually.

---

### 🎬 SCENE 4 — Dashboard + AI Fixes (60 seconds)

**Visual:** Switch to browser (Chrome fullscreen, zoom 110%)

**Step 1 — Show the Live Dashboard:**
Open `http://localhost:4000` (make sure `npm run dashboard` is running in background with vulnerable app data)

Point at:
- Security Score gauge (animated)
- Grade card (F with red accent)
- OWASP Top 10 Coverage bar chart
- Severity Distribution donut chart
- Recent Findings table

**Narration:**
> *"Every scan generates a premium visual dashboard. Security score, OWASP Top 10 coverage, severity distribution — all rendered dynamically from real scan data. No mock data, no static screenshots."*

**Step 2 — Click through tabs:**
- Click **"Findings"** tab → show full findings list with file locations
- Click **"OWASP Map"** tab → show categories with progress bars
- Click **"AI Fixes"** tab → show AI-generated code remediation

**Narration:**
> *"And here's the killer feature. When you scan with the --with-ai flag, Guardrail sends each vulnerability to Groq's LLaMA 3.3 model. The AI returns an explanation, the fixed code, and security references. Developers can copy-paste the fix directly. No other open-source Node.js scanner does this."*

**Step 3 — Quick HTML report:**
Open `report/guardrail-report.html` in a new tab

**Narration:**
> *"We also generate self-contained HTML reports, JSON for APIs, SARIF for GitHub Security integration, and Markdown summaries — 5 formats from every single scan."*

---

### 🎬 SCENE 5 — CI/CD + Closing (30 seconds)

**Visual:** Switch to VS Code, show `.github/workflows/guardrail.yml`

**Narration:**
> *"Guardrail plugs directly into GitHub Actions. On every push, it scans the code, uploads SARIF to GitHub's Security tab, and posts a score summary as a PR comment. If the scan fails, the pipeline blocks the merge. Zero configuration, zero dependencies."*

**Visual:** Cut back to you or banner slide

**Closing narration:**
> *"OWASP Guardrail: 30 unit tests passing, 8 vulnerability categories, OWASP Top 10 mapping, AI auto-remediation, and a premium dashboard — all in a single npm install. We didn't build another scanner. We built the one that makes all others obsolete. Thank you."*

---

## 🎯 Pre-Recording Checklist

### Terminal
- [ ] Font size: **16px minimum**
- [ ] Theme: **Dark** (Windows Terminal or VS Code integrated terminal)
- [ ] Run `cls` before each command for clean screen
- [ ] Run `npm install` beforehand (don't waste video time on install)

### Browser
- [ ] Zoom: **110-125%** for readable dashboard
- [ ] Close all other tabs and bookmark bars
- [ ] Fullscreen mode (F11)

### Data Preparation
- [ ] Run `npm run scan:demo` first to generate vulnerable report data
- [ ] Run `npm run dashboard` in a background terminal before recording Scene 4
- [ ] Set `GROQ_API_KEY` environment variable if demoing AI fixes live
- [ ] Open HTML report once to confirm it renders perfectly

### Recording
- [ ] Resolution: **1920x1080** (Full HD)
- [ ] Frame rate: **30 fps**
- [ ] Microphone: External mic preferred (avoid built-in laptop mic)
- [ ] Record each scene separately, edit together later

---

## 📝 Recording Order (Recommended)

| # | What to Record | Duration | Notes |
|---|---|---|---|
| 1 | Terminal: `npm run scan:demo` | 30s | Show full output, pause on FAIL |
| 2 | Terminal: `npm run scan:fixed` | 20s | Show A+ PASS, let it breathe |
| 3 | Browser: Dashboard all 4 tabs | 50s | Click through Dashboard → Findings → OWASP → AI |
| 4 | Browser: HTML report quick flash | 10s | Show it's self-contained |
| 5 | VS Code: `guardrail.yml` workflow | 10s | Show CI/CD integration |
| 6 | Opening banner + closing slide | 20s | Record last, add in editing |

**Total raw footage:** ~2.5 minutes. Final edited video: **3 minutes sharp.**

---

## 💡 Pro Tips

1. **Never say "um", "so basically", or "as you can see"** — these destroy credibility instantly
2. **Use numbers:** "30 tests passing", "13 findings", "5 report formats", "under 500 milliseconds"
3. **Pause after impact moments** — after the F→A+ transition, let the visual speak for 1–2 seconds
4. **Don't explain code internals** — judges care about WHAT it does, not HOW the regex works
5. **End with confidence** — your last sentence should feel like a mic drop, not a question

---

*"We didn't build another scanner. We built the one that makes all others obsolete."*
