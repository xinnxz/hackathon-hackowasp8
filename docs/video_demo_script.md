# 🎬 OWASP Guardrail — Video Demo Script (Championship Edition)

## Overview
- **Duration:** 3–4 minutes
- **Tone:** Supremely confident, zero filler words
- **Language:** English
- **Key Differentiator:** We scan REAL production projects, not just demo apps
- **Tools:** Terminal (dark theme, 16px font), Browser (Chrome fullscreen), OBS/Loom

---

## 📋 Structure (6 Scenes)

### 🎬 SCENE 1 — Opening Hook (15 seconds)

**Visual:** Dark screen → OWASP Guardrail banner fades in

**Narration:**
> *"74% of breached applications had known vulnerabilities that automated tooling could have caught. Enterprise scanners need JVMs, Docker, and paid licenses. We built OWASP Guardrail — a zero-dependency AI-powered scanner that detects, grades, and auto-fixes security flaws. And we're about to prove it on REAL production codebases — not just toy demos."*

---

### 🎬 SCENE 2 — Scan Real Project #1: AIO Wallet Generator (40 seconds)

**Visual:** Terminal fullscreen

**Type live:**
```bash
npx tsx src/cli.ts scan E:\DATA\Ngoding\aio-wallet-generator --with-ai
```

**While loading, narrate:**
> *"This is a real browser extension project — a cryptocurrency wallet generator. It handles sensitive financial data. Let's see what Guardrail finds."*

**When output appears, highlight:**
- AI connecting to Groq: `[AI] Requesting Groq (LLaMA 3.3-70B) fixes for 4 unique findings...`
- All 4 AI fixes succeeding: `[AI] ✔ Potential XSS sink detected`
- **47 HIGH, 7 MEDIUM, 4 LOW** vulnerabilities
- Score: **F (0/100)**
- Result: **✖ FAIL**

**Narration:**
> *"58 vulnerabilities across a real crypto wallet project. 47 high-severity XSS sinks — in a financial application, each one could steal user funds. Guardrail instantly flagged them, mapped them to OWASP A03 Injection, and the AI already wrote fixes for every unique vulnerability type. Score: F. This code should NEVER ship."*

---

### 🎬 SCENE 3 — Scan Real Project #2: Skiix Backend (25 seconds)

**Visual:** Same terminal, clear screen

**Type live:**
```bash
npx tsx src/cli.ts scan E:\DATA\Ngoding\skiix-backend --with-ai
```

**When output appears, highlight:**
- Score: **A+ (100/100)** — full green bar
- Zero findings
- Result: **✔ PASS**

**Narration:**
> *"Now let's scan a Go-based social media backend. A+ — 100 out of 100. Zero findings. The policy engine passes the build. This is the before-and-after contrast that makes security tangible. Two real projects. Two very different results. Guardrail tells you exactly where you stand."*

---

### 🎬 SCENE 4 — Dashboard + AI Fixes Showcase (60 seconds)

**Visual:** Switch to browser, open `http://localhost:4000`

**Preparation:** Before this scene, run the AIO wallet scan so dashboard shows the interesting data.

**Step 1 — Show Dashboard Overview:**
Point at:
- Security Score gauge (F — red)
- Severity Distribution donut chart (mostly HIGH)
- OWASP Top 10 bar chart
- Recent findings table

**Narration:**
> *"Every scan generates a premium SaaS-grade dashboard. No mock data — this is rendered dynamically from the real scan we just ran. Security score, OWASP coverage, severity breakdown — all interactive."*

**Step 2 — Click tabs:**
- Click **"Findings"** → Show list of XSS sinks with exact file paths and line numbers
- Click **"OWASP Map"** → Show which OWASP categories were violated
- Click **"AI Fixes"** → Show AI-generated code remediation

**Narration (on AI Fixes tab):**
> *"And here's the killer feature. When we scanned with --with-ai, Guardrail sent each vulnerability to Groq's LLaMA 3.3-70B model. The AI returned an explanation, the exact fixed code, and OWASP security references. Developers copy-paste the fix and move on. No other open-source Node.js scanner does this."*

**Step 3 — Show HTML Report:**
Open `report\guardrail-report.html` in a new tab

**Narration:**
> *"We also generate self-contained HTML reports, JSON, SARIF for GitHub Security, and Markdown summaries — 5 formats from every single scan."*

---

### 🎬 SCENE 5 — CI/CD Integration (25 seconds)

**Visual:** Switch to VS Code, show `.github/workflows/guardrail.yml`

**Narration:**
> *"Guardrail plugs directly into GitHub Actions. On every push, it scans the code, uploads SARIF to GitHub's Security tab, and blocks unsafe merges automatically. If GROQ_API_KEY is configured, it generates AI fixes too. Zero configuration, zero dependencies."*

---

### 🎬 SCENE 6 — Closing (15 seconds)

**Visual:** Terminal or banner slide

**Narration:**
> *"We just scanned a crypto wallet extension — 58 vulnerabilities, all with AI-generated fixes. We scanned a social media backend — clean, A+. That's not a demo with fake data — those are real production codebases.*

> *OWASP Guardrail: 30 unit tests passing, 9 vulnerability categories, full OWASP Top 10 mapping, AI auto-remediation powered by LLaMA 3.3, and a premium dashboard — all in a single npm install with zero dependencies.*

> *We didn't build another scanner. We built the one that makes all others obsolete. Thank you."*

---

## 🎯 Pre-Recording Checklist

### Data Preparation (CRITICAL — Do This First!)
- [ ] Set `GROQ_API_KEY` in `.env` file
- [ ] Run: `npx tsx src/cli.ts scan E:\DATA\Ngoding\aio-wallet-generator --with-ai`
- [ ] Run: `npx tsx src/cli.ts scan E:\DATA\Ngoding\skiix-backend --with-ai`
- [ ] After the AIO wallet scan, run `npm run dashboard` for Scene 4
- [ ] Open `http://localhost:4000` in Chrome to verify dashboard works
- [ ] Open `report\guardrail-report.html` to verify HTML report renders

### Terminal
- [ ] Font size: **16px minimum**
- [ ] Theme: **Dark** (Windows Terminal)
- [ ] Run `cls` before each command
- [ ] Close all other terminals

### Browser
- [ ] Zoom: **110-125%**
- [ ] Close all other tabs and bookmark bars
- [ ] Fullscreen mode (F11)

### Recording
- [ ] Resolution: **1920x1080** (Full HD)
- [ ] Frame rate: **30 fps**
- [ ] Microphone: External mic preferred
- [ ] Record each scene separately, edit together later

---

## 📝 Recording Order

| # | What to Record | Duration | Notes |
|---|---|---|---|
| 1 | Terminal: AIO Wallet scan with AI | 35s | Show AI connecting + FAIL |
| 2 | Terminal: Skiix Backend scan | 20s | Show A+ PASS, let it breathe |
| 3 | Browser: Dashboard all 4 tabs | 50s | Click through each tab |
| 4 | Browser: HTML report flash | 10s | Show self-contained report |
| 5 | VS Code: guardrail.yml | 10s | Show CI/CD integration |
| 6 | Opening + Closing slides | 15s | Record last, add in editing |

**Total raw footage:** ~2.5 min. Final video: **3 minutes sharp.**

---

## 💡 Championship Tips

1. **Use REAL projects, not demos** — Judges have seen a million fake demos. Scanning your own production code proves the tool actually works.
2. **Show the AI connecting live** — The `[AI] ✔` checkmarks appearing one by one is incredibly satisfying to watch.
3. **Contrast is everything** — AIO Wallet (F) vs Skiix Backend (A+) tells a powerful visual story.
4. **Never say "um", "so basically", or "as you can see"** — These destroy credibility instantly.
5. **Pause after impact moments** — After the F score appears, let it breathe 1-2 seconds.
6. **End with a mic drop** — *"We built the one that makes all others obsolete"* should be your last sentence.

---

*"We didn't build another scanner. We built the one that makes all others obsolete."*
