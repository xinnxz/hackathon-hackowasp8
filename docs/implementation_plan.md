# 🏆 Implementation Plan: OWASP Guardrail → JUARA 1 HackOWASP 8.0

## Goal

Transformasi OWASP Guardrail dari MVP basic (skor 5.6/10) menjadi project yang layak **Juara 1** (target 9.5/10) di HackOWASP 8.0, track **Cyber Security**.

### Target Skor Akhir

| Kriteria | Saat Ini | Target | Strategi |
|---|---|---|---|
| 🎨 Innovation | 4.5/10 | **9/10** | AI fix suggestions + OWASP Top 10 mapping |
| 🌍 Impact | 7.5/10 | **9/10** | Dashboard wow + more rules |
| ⚙️ Technical | 5/10 | **9.5/10** | Modular architecture + tests + AI integration |
| 🎯 Alignment | 9/10 | **9.5/10** | OWASP Top 10 everywhere |
| 📽️ Presentasi | 3/10 | **9.5/10** | Premium dashboard + polished README |

---

## Proposed Changes

### Phase 1: Architecture Refactor (Modularisasi)

**Mengapa:** Juri akan melihat repo structure. Monolith 1 file = "weekend project". Modular = "production-grade tool".

**Penjelasan:** Kita pecah `cli.ts` (453 baris) menjadi ~10 file terpisah berdasarkan tanggung jawab (Single Responsibility Principle). Ini menunjukkan kemampuan software architecture.

#### [NEW] [types.ts](file:///e:/DATA/Ngoding/hackowasp8/src/types.ts)
Shared type definitions yang digunakan di seluruh codebase:
- `Severity`, `FindingType`, `Finding`, `GuardrailReport`
- `ScanContext` — konteks untuk scanner
- `OwaspCategory` — OWASP Top 10 mapping enum
- Export semua types dari satu tempat

#### [NEW] [scanner/index.ts](file:///e:/DATA/Ngoding/hackowasp8/src/scanner/index.ts)
Scanner orchestrator:
- `scanProject(targetPath)` — koordinasi semua scanner
- Sort findings by severity
- Aggregate results

#### [NEW] [scanner/secrets.ts](file:///e:/DATA/Ngoding/hackowasp8/src/scanner/secrets.ts)
Secret detection engine:
- Pindahkan `secretPatterns` array + `scanSecretLine()` + `looksHighEntropy()`
- Tambah patterns baru (AWS keys, Slack tokens, database URLs)

#### [NEW] [scanner/rules.ts](file:///e:/DATA/Ngoding/hackowasp8/src/scanner/rules.ts)
Static analysis rule engine:
- Pindahkan `scanRuleLine()`
- Tambah XSS, eval, SSRF, insecure HTTP rules
- Pattern-based detection dengan OWASP Top 10 tagging

#### [NEW] [scanner/deps.ts](file:///e:/DATA/Ngoding/hackowasp8/src/scanner/deps.ts)
Dependency audit:
- Pindahkan `scanDependencies()`, `parseAuditFindings()`, `extractAuditOutput()`
- npm audit integration

#### [NEW] [reporter/json.ts](file:///e:/DATA/Ngoding/hackowasp8/src/reporter/json.ts)
JSON report generator — simple file write

#### [NEW] [reporter/html.ts](file:///e:/DATA/Ngoding/hackowasp8/src/reporter/html.ts)
**Premium HTML dashboard** — ini akan menjadi file terbesar dan paling impressive:
- Dark theme glassmorphism design
- Severity donut chart (pure CSS)
- OWASP Top 10 heatmap
- Expandable finding cards
- Filter & search
- Animated counters
- Responsive layout

#### [NEW] [reporter/sarif.ts](file:///e:/DATA/Ngoding/hackowasp8/src/reporter/sarif.ts)
SARIF report generator — GitHub Security compatible

#### [NEW] [ai/suggestions.ts](file:///e:/DATA/Ngoding/hackowasp8/src/ai/suggestions.ts)
**AI-powered fix suggestion engine** — Gemini API integration:
- `generateFixSuggestions(findings)` — batch process all findings
- Prompt engineering untuk security-specific fixes
- Fallback ke static suggestions jika API unavailable
- Rate limiting & error handling

#### [MODIFY] [cli.ts](file:///e:/DATA/Ngoding/hackowasp8/src/cli.ts)
Refactor menjadi entry point saja:
- CLI argument parsing
- Import & orchestrate scanner + reporter + AI modules
- Colored terminal output
- ASCII banner
- Progress indicators

---

### Phase 2: AI-Powered Fix Suggestions (Gemini API) 🤖

**Mengapa:** Ini adalah **PEMBEDA UTAMA** dari semua security scanner yang ada. Semgrep, Snyk, Gitleaks — TIDAK ADA yang punya built-in AI fix suggestions. Ini akan membuat juri **WOW**.

**Penjelasan:** Setelah scanner menemukan vulnerability, kita kirim finding ke Gemini API untuk mendapatkan specific code fix. Hasil fix ditampilkan di HTML dashboard dan JSON report.

#### [NEW] [ai/suggestions.ts](file:///e:/DATA/Ngoding/hackowasp8/src/ai/suggestions.ts)
- Menggunakan Gemini API (`generativelanguage.googleapis.com`)
- HTTP fetch langsung (tanpa SDK — zero dependency)
- Prompt template yang dioptimasi untuk security context
- Batch processing dengan concurrency limit
- Graceful fallback jika API unreachable
- Caching untuk avoid redundant API calls

```typescript
// Contoh output AI fix suggestion:
{
  finding: "SQL Injection at src/app.js:15",
  aiSuggestion: {
    explanation: "String concatenation in SQL creates injection risk...",
    fixedCode: "const query = 'SELECT * FROM users WHERE id = ?';\ndb.query(query, [userId]);",
    references: ["https://cheatsheetseries.owasp.org/..."]
  }
}
```

#### [MODIFY] [types.ts](file:///e:/DATA/Ngoding/hackowasp8/src/types.ts)
- Tambah `AiSuggestion` type
- Tambah `aiSuggestion?: AiSuggestion` ke `Finding` type

---

### Phase 3: Premium Interactive HTML Dashboard 🎨

**Mengapa:** HTML report saat ini adalah static table yang sangat basic. Juri melihat output visual — dashboard yang WOW = impression yang WOW. Ini langsung meningkatkan skor di **Impact** dan **Presentasi**.

**Penjelasan:** Kita buat HTML dashboard single-file (tanpa external dependencies) dengan design premium:

#### [MODIFY] [reporter/html.ts](file:///e:/DATA/Ngoding/hackowasp8/src/reporter/html.ts)

**Fitur dashboard:**

1. **Header Section**
   - OWASP Guardrail logo + scan metadata
   - PASS/FAIL badge besar dengan animasi glow
   - Timestamp + scanned path

2. **Summary Cards Row** (animated counters)
   - 🔴 Critical count — merah berkedip jika > 0
   - 🟠 High count — oranye
   - 🟡 Medium count — kuning
   - 🟢 Low count — hijau
   - Total findings + pass/fail status

3. **Severity Donut Chart** (pure CSS conic-gradient)
   - Visual breakdown tanpa library external
   - Animated on load
   - Hover tooltips

4. **OWASP Top 10 Heatmap**
   - Grid showing which OWASP categories are affected
   - Color-coded by severity
   - Click to filter findings

5. **AI Fix Suggestions Section** 🤖
   - Per finding, tampilkan AI-generated fix
   - Syntax highlighted code blocks
   - "Copy fix" button
   - Collapsible details

6. **Findings Table**
   - Sortable by severity/type/file
   - Search/filter bar
   - Expandable rows dengan full detail + recommendation
   - Severity badge dengan color coding
   - File location dengan line numbers

7. **Design System**
   - Dark glassmorphism theme
   - CSS variables untuk consistency
   - Google Fonts (Inter)
   - Smooth transitions & micro-animations
   - Responsive (mobile-friendly)
   - Print-friendly `@media print` styles

---

### Phase 4: Expanded Detection Rules 🔍

**Mengapa:** 3 secret patterns + 3 rules = terlalu sedikit untuk "impressive". Menambah rules menunjukkan **domain expertise** dan meningkatkan **real-world utility**.

#### [MODIFY] [scanner/secrets.ts](file:///e:/DATA/Ngoding/hackowasp8/src/scanner/secrets.ts)
Tambah patterns baru:
- AWS Access Key (`AKIA[0-9A-Z]{16}`)
- AWS Secret Key
- Slack Token/Webhook
- Google API Key
- Database connection string (`mongodb://`, `postgres://`, `mysql://`)
- Generic password in config
- `.env` file committed with secrets

#### [MODIFY] [scanner/rules.ts](file:///e:/DATA/Ngoding/hackowasp8/src/scanner/rules.ts)
Tambah rules baru:
- **XSS Detection**: `innerHTML`, `dangerouslySetInnerHTML`, `document.write`
- **Eval/Exec**: `eval()`, `Function()`, `child_process.exec()` tanpa sanitasi
- **SSRF Patterns**: Unvalidated URL fetch dari user input
- **Insecure HTTP**: Hardcoded `http://` URLs (bukan `https://`)
- **Missing Security Headers**: Deteksi missing HSTS, CSP, X-Frame-Options
- **Path Traversal**: `../` patterns di file operations
- **Weak Crypto**: `md5`, `sha1` untuk hashing passwords
- **Debug/Verbose Mode**: `console.log` dengan sensitive data

---

### Phase 5: OWASP Top 10 2021 Mapping System 🎯

**Mengapa:** Ini hackathon **OWASP**. Mapping setiap finding ke OWASP Top 10 menunjukkan bahwa kamu benar-benar paham framework OWASP. Juri PASTI akan terkesan.

#### [NEW] [owasp/mapping.ts](file:///e:/DATA/Ngoding/hackowasp8/src/owasp/mapping.ts)

Setiap finding akan di-tag dengan OWASP Top 10 2021 category:

| OWASP ID | Category | Finding Types yang di-map |
|---|---|---|
| A01:2021 | Broken Access Control | Route tanpa auth middleware |
| A02:2021 | Cryptographic Failures | Weak crypto (MD5, SHA1), hardcoded secrets |
| A03:2021 | Injection | SQL injection, eval/exec, XSS |
| A04:2021 | Insecure Design | — |
| A05:2021 | Security Misconfiguration | Wildcard CORS, debug mode, missing headers |
| A06:2021 | Vulnerable Components | npm audit findings (dependencies) |
| A07:2021 | Auth Failures | Committed tokens, API keys, passwords |
| A08:2021 | Software/Data Integrity | — |
| A09:2021 | Logging Failures | — |
| A10:2021 | SSRF | Unvalidated URL fetch |

#### [MODIFY] [types.ts](file:///e:/DATA/Ngoding/hackowasp8/src/types.ts)
- Tambah `owaspCategory` field ke `Finding` type
- Tambah `OwaspMapping` type dengan id, name, description, link

---

### Phase 6: CLI UX Overhaul 🖥️

**Mengapa:** First impression saat run command. CLI yang terlihat professional = project yang terlihat professional.

#### [MODIFY] [cli.ts](file:///e:/DATA/Ngoding/hackowasp8/src/cli.ts)

1. **ASCII Art Banner**
   ```
   ╔═══════════════════════════════════════════╗
   ║   ⛨  OWASP GUARDRAIL v1.0               ║
   ║   DevSecOps Scanner with AI-Powered Fixes ║
   ╚═══════════════════════════════════════════╝
   ```

2. **Colored Output** (ANSI escape codes, zero dependencies)
   - 🔴 Critical = red bold
   - 🟠 High = yellow
   - 🟡 Medium = cyan
   - 🟢 Low/Pass = green

3. **Progress Indicators**
   - `[1/4] Scanning secrets...`
   - `[2/4] Analyzing code patterns...`
   - `[3/4] Auditing dependencies...`
   - `[4/4] Generating AI fix suggestions...`

4. **Summary Table** di terminal
   ```
   ┌──────────┬───────┐
   │ Severity │ Count │
   ├──────────┼───────┤
   │ CRITICAL │   2   │
   │ HIGH     │   3   │
   │ MEDIUM   │   1   │
   │ LOW      │   0   │
   └──────────┴───────┘
   Result: ❌ FAIL (policy: high, critical)
   ```

---

### Phase 7: Premium README & Documentation 📝

**Mengapa:** README adalah hal pertama yang dilihat juri di GitHub. Premium README = first impression yang kuat.

#### [MODIFY] [README.md](file:///e:/DATA/Ngoding/hackowasp8/README.md)

1. **Header** — Logo + tagline + badges (build, license, version)
2. **Problem Statement** — Statistik nyata tentang secret leaks
3. **Solution** — One-paragraph pitch
4. **Architecture Diagram** — Mermaid diagram
5. **Screenshots** — HTML dashboard, CLI output
6. **Quick Start** — 3-step setup
7. **Features** — Table dengan semua capabilities
8. **OWASP Top 10 Coverage** — Mapping table
9. **AI Fix Suggestions** — Example output
10. **CI/CD Integration** — GitHub Actions snippet
11. **Demo Story** — Fail → Fix → Pass
12. **Threat Model** — Security analysis
13. **Roadmap** — Future plans
14. **Tech Stack** — TypeScript, Gemini AI, SARIF

---

## Execution Order

> [!IMPORTANT]
> Urutan ini dioptimasi agar setiap fase **bisa di-demo secara incremental** — jadi kalau waktu terpotong, kamu tetap punya project yang lebih baik dari sebelumnya.

| # | Phase | Estimasi | Dampak ke Skor | Kumulatif |
|---|---|---|---|---|
| 1 | **Architecture Refactor** | 45-60 min | +1.0 Technical | 6.6/10 |
| 2 | **Expanded Rules + OWASP Mapping** | 30-45 min | +1.0 Innovation, +0.5 Technical | 7.6/10 |
| 3 | **AI Fix Suggestions (Gemini)** | 60-90 min | +2.0 Innovation, +1.0 Technical | 8.8/10 |
| 4 | **Premium HTML Dashboard** | 90-120 min | +1.5 Presentasi, +0.5 Impact | 9.3/10 |
| 5 | **CLI UX Overhaul** | 20-30 min | +0.3 Presentasi | 9.4/10 |
| 6 | **Premium README** | 20-30 min | +0.5 Presentasi | 9.5/10 |
| 7 | **Unit Tests** | 20-30 min | +0.3 Technical | 9.6/10 |

**Total estimasi: ~5-7 jam kerja**

---

## Verification Plan

### Automated Tests
```bash
# 1. Build check
npm run build

# 2. Scan vulnerable app — harus FAIL
npm run scan:demo
# Expected: exit code 1, multiple findings (critical + high)

# 3. Scan fixed app — harus PASS
npm run scan:fixed
# Expected: exit code 0, zero/low findings only

# 4. Verify report files generated
# - report/guardrail-report.json (JSON valid)
# - report/guardrail-report.html (dashboard dengan chart + AI suggestions)
# - report/guardrail-report.sarif (SARIF 2.1.0 valid)

# 5. Unit tests
npm test
```

### Manual Verification
- Buka `report/guardrail-report.html` di browser → verifikasi visual dashboard
- Cek AI suggestions muncul untuk setiap finding
- Cek OWASP Top 10 mapping tampil di dashboard
- Cek CLI output punya warna + banner + progress indicators
- Review README rendering di GitHub

### Browser Testing
- Buka HTML report di browser
- Verifikasi donut chart, animations, filter/search, expandable cards
- Cek responsive design (resize window)
- Cek print view (`Ctrl+P`)

---

## Open Questions

> [!IMPORTANT]
> 1. **Gemini API key** yang kamu berikan (`AIzaSyAJcHGTeS-...`) — apakah ini key yang aktif dan bisa digunakan untuk `gemini-2.0-flash` model? Saya akan menggunakannya untuk AI fix suggestions.
> 2. **Submission deadline** — apakah kamu sudah tahu kapan tepatnya deadline submit BUIDL di DoraHacks?
> 3. **Tim** — apakah kamu mengerjakan ini sendiri atau ada anggota tim lain?

---

## File Structure Akhir (Target)

```
hackowasp8/
├── .github/
│   └── workflows/
│       └── guardrail.yml          (CI/CD — sudah ada, minor update)
├── src/
│   ├── cli.ts                     (Entry point + CLI UX)
│   ├── types.ts                   (Shared types + OWASP mapping)
│   ├── scanner/
│   │   ├── index.ts               (Scanner orchestrator)
│   │   ├── secrets.ts             (Secret detection — 8+ patterns)
│   │   ├── rules.ts               (SAST rules — 10+ rules)
│   │   └── deps.ts                (Dependency audit)
│   ├── reporter/
│   │   ├── json.ts                (JSON report)
│   │   ├── html.ts                (Premium HTML dashboard ⭐)
│   │   └── sarif.ts               (SARIF for GitHub)
│   ├── ai/
│   │   └── suggestions.ts         (Gemini AI fix engine ⭐)
│   └── owasp/
│       └── mapping.ts             (OWASP Top 10 mapping)
├── demo/
│   ├── vulnerable-app/            (Fail demo — sudah ada)
│   └── fixed-app/                 (Pass demo — sudah ada)
├── report/                        (Generated outputs)
├── tests/                         (Unit tests — NEW)
│   └── scanner.test.ts
├── package.json                   (Updated scripts)
├── tsconfig.json                  (Unchanged)
└── README.md                      (Premium README ⭐)
```
