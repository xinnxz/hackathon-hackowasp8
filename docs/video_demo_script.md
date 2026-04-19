# 🎬 OWASP Guardrail — Video Demo Script (Juara 1 Strategy)

## Overview
- **Target Durasi:** 3–5 menit (ideal untuk hackathon)
- **Tone:** Profesional, percaya diri, to-the-point
- **Tools yang diperlukan:** Terminal (PowerShell/CMD), Browser (Chrome), Screen recorder (OBS/Loom/ScreenPal)

---

## 📋 Struktur Video (7 Scene)

### 🎬 SCENE 1 — Opening Hook (15 detik)
**Visual:** Tampilkan layar gelap → fade-in logo/banner OWASP Guardrail

**Narasi:**
> *"Security bugs cost companies millions. But most security scanners are too heavy, too slow, or too noisy for small teams and CI pipelines. We built OWASP Guardrail — a zero-dependency DevSecOps scanner that maps to OWASP Top 10, grades your code A+ to F, and uses AI to auto-generate fixes. Let me show you."*

> [!TIP]
> Buat opening yang impactful. Juri biasanya memutuskan dalam 30 detik pertama apakah proyek ini menarik.

---

### 🎬 SCENE 2 — The Problem (30 detik)
**Visual:** Tampilkan slide sederhana (bisa pakai PowerPoint/Canva) dengan bullet points:

**Poin yang disampaikan:**
1. ❌ Enterprise SAST tools (SonarQube, Checkmarx) → **Berat, butuh JVM, setup rumit**
2. ❌ Basic linters → **Tidak map ke OWASP, tidak ada scoring**
3. ❌ Manual code review → **Lambat, tidak scalable**
4. ✅ **OWASP Guardrail** → **Cepat, zero-JVM, OWASP-aligned, AI-powered, CI-ready**

**Narasi:**
> *"Teams need three things from security tooling: speed, clarity, and pipeline fit. Existing tools force you to choose. Guardrail delivers all three."*

---

### 🎬 SCENE 3 — Live Terminal Demo: Scanning Vulnerable App (60 detik)
**Visual:** Terminal fullscreen, font size besar (16-18px)

**Perintah yang diketik LIVE:**
```bash
# Clone dan install
npm install

# Scan aplikasi yang SENGAJA rentan
npm run scan:demo
```

**Narasi saat menunggu output:**
> *"We intentionally built a vulnerable demo app with real-world security flaws — SQL injection, hardcoded secrets, wildcard CORS, weak crypto, and more. Let's see what Guardrail finds."*

**Saat output muncul, highlight:**
- Banner ASCII art yang profesional `⛨ OWASP GUARDRAIL v2.0`
- Config auto-merge dari `.guardrailrc.json`
- Tabel severity breakdown: **2 Critical, 6 High, 2 Medium, 3 Low**
- Score: **F (0/100)**
- Result: **✖ FAIL (policy violation)**

**Narasi:**
> *"Guardrail found 13 findings across 4 severity levels. The score is F — zero out of 100. The policy engine automatically BLOCKS the build because we configured fail-on high and critical. This is exactly what you want in a CI pipeline."*

---

### 🎬 SCENE 4 — Live Terminal Demo: Scanning Fixed App (45 detik)
**Visual:** Tetap di terminal

**Perintah:**
```bash
# Sekarang scan aplikasi yang sudah diperbaiki
npm run scan:fixed
```

**Narasi saat menunggu:**
> *"Now let's scan the same app after fixing all the vulnerabilities."*

**Saat output muncul, highlight:**
- Score: **A+ (100/100)**
- Result: **✔ PASS**
- _"No findings — clean scan!"_

**Narasi:**
> *"A+ — 100 out of 100. Zero findings. The policy engine PASSES the build. This is the before-and-after story that makes security tangible for developers."*

> [!IMPORTANT]
> **Ini adalah momen klimaks video.** Pastikan transisi dari F → A+ terlihat jelas dan dramatis. Juri akan langsung paham value-nya.

---

### 🎬 SCENE 5 — HTML Report & Dashboard Showcase (60 detik)
**Visual:** Buka browser, tampilkan file HTML report

**Langkah:**
1. Buka `report-demo-vulnerable/guardrail-report.html` di browser
2. Perlihatkan:
   - **Score Gauge** (animasi lingkaran dari 0 ke skor)
   - **Severity breakdown cards** (Critical merah, High oranye, dst)
   - **OWASP Top 10 Heatmap** (tiles berwarna)
   - **Finding cards** — klik salah satu untuk expand detail
   - **AI Fix Suggestions** — scroll ke bawah, tunjukkan code snippet
3. Klik tab **Findings** → demo search/filter
4. Klik tab **OWASP** → tunjukkan distribution table
5. Klik tab **AI Fixes** → tunjukkan AI-generated remediation

**Narasi:**
> *"Every scan generates a beautiful, self-contained HTML report. No server needed — just open the file. The report includes an interactive score gauge, OWASP Top 10 heatmap, severity filtering, and — when AI mode is enabled — actual code fix suggestions powered by Groq's LLaMA 3.3."*

---

### 🎬 SCENE 6 — CI/CD Integration & SARIF (45 detik)
**Visual:** Tampilkan GitHub Actions workflow + GitHub Security tab (screenshot jika perlu)

**Langkah:**
1. Buka file `.github/workflows/guardrail.yml` di editor — tunjukkan workflow
2. Tampilkan screenshot/video dari GitHub Actions run yang sukses
3. Tampilkan tab **Security** di GitHub repo (SARIF findings muncul di sana)
4. Tampilkan **PR Comment** yang otomatis ditempelkan oleh bot

**Narasi:**
> *"Guardrail integrates directly into GitHub Actions. On every push or pull request, it runs the scan, uploads SARIF to GitHub Security for native vulnerability tracking, and posts a Markdown summary as a PR comment. Developers get instant feedback without leaving their workflow."*

**Poin kunci:**
- SARIF upload ke GitHub Security Center
- PR comment otomatis dengan score + severity table
- Artifact upload (HTML + JSON reports)

---

### 🎬 SCENE 7 — Closing & Architecture (30 detik)
**Visual:** Tampilkan diagram arsitektur sederhana (dari `docs/ARCHITECTURE.md` atau buat slide)

**Narasi:**
> *"OWASP Guardrail is built with TypeScript, zero runtime dependencies, and a modular architecture. The scanner runs pattern-based rules mapped to OWASP Top 10, produces industry-standard SARIF, and optionally calls Groq AI for remediation. It's designed to be fast, honest, and developer-friendly."*

> *"We built this because security tooling should be understandable in one demo — and we hope we just proved that. Thank you."*

---

## 🎯 Checklist Sebelum Rekam Video

### Persiapan Terminal
- [ ] Font size terminal: **16px minimum** (agar terbaca di video)
- [ ] Warna terminal: **Dark theme** (PowerShell/Windows Terminal dark)
- [ ] Clear terminal sebelum setiap perintah (`cls` atau `clear`)
- [ ] Pastikan `npm install` sudah selesai sebelumnya (jangan buang waktu install di video)

### Persiapan Browser
- [ ] Zoom browser: **110-125%** (agar UI dashboard terbaca)
- [ ] Tutup semua tab lain (bersihkan bookmark bar jika perlu)
- [ ] Mode fullscreen (F11)

### Persiapan Rekaman
- [ ] Resolusi: **1920x1080** (Full HD minimum)
- [ ] Frame rate: **30 fps**
- [ ] Audio: Gunakan mikrofon yang jernih (hindari mic laptop built-in jika bisa)
- [ ] Cursor highlight: Aktifkan cursor highlighting jika ada

### Persiapan Konten
- [ ] Jalankan `npm run demo:judge` sekali sebelumnya agar folder `report-demo-vulnerable/` dan `report-demo-fixed/` sudah ada
- [ ] Set `GROQ_API_KEY` di environment jika ingin demo AI live
- [ ] Buka report HTML di browser sebelumnya untuk memastikan tampil sempurna

---

## 💡 Tips Pro untuk Memenangkan Hackathon

### 1. Gunakan "Before & After" Storytelling
Juri sangat menyukai narasi **transformasi**. Tunjukkan app yang rentan (skor F) → perbaiki → scan lagi (skor A+). Ini visual dan mudah dipahami.

### 2. Jangan Terlalu Teknis
Hindari menjelaskan implementasi regex atau internal TypeScript. Fokus pada **dampak**: "Tool ini mendeteksi X jenis kerentanan dan otomatis menyarankan perbaikan."

### 3. Tunjukkan "Real-World Readiness"
CI/CD integration dan SARIF output adalah bukti bahwa ini bukan toy project. Tekankan bahwa tool ini bisa langsung dipasang di pipeline produksi.

### 4. Sebutkan Angka Spesifik
- "27 unit tests, all passing"
- "13 security rules mapped to 7 OWASP Top 10 categories"
- "5 report formats: JSON, HTML, SARIF, Markdown, PR Comment"
- "AI fixes powered by LLaMA 3.3-70B via Groq"

### 5. Akhiri dengan Confidence
> *"We didn't just build a scanner. We built a complete DevSecOps pipeline tool that any team can adopt in under 5 minutes."*

---

## 📝 Urutan Rekaman yang Disarankan

| No | Apa yang direkam | Durasi | Tool |
|----|------------------|--------|------|
| 1 | Terminal: `npm run scan:demo` (vulnerable) | 30s | Screen recorder |
| 2 | Terminal: `npm run scan:fixed` (fixed) | 20s | Screen recorder |
| 3 | Browser: HTML Report vulnerable (semua tab) | 60s | Screen recorder |
| 4 | Browser: HTML Report fixed (A+ clean) | 15s | Screen recorder |
| 5 | Browser: Dashboard live (`npm run dashboard`) | 30s | Screen recorder |
| 6 | Editor: GitHub Actions workflow file | 15s | Screen recorder |
| 7 | Terminal: `npm test` (27 tests passing) | 15s | Screen recorder |

Total raw footage: ~3-4 menit. Edit menjadi video akhir 3-5 menit.
