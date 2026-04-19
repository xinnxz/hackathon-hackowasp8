<div align="center">

# ⛨ OWASP Guardrail — Project Overview

**DevSecOps Security Scanner for Node.js/TypeScript Projects**
*HackOWASP 8.0 — Cyber Security Track*

</div>

---

## 1. Fokus Proyek

OWASP Guardrail adalah **CLI-based DevSecOps Scanner** yang dirancang untuk mendeteksi kerentanan keamanan (vulnerability) pada proyek Node.js/TypeScript secara otomatis. Tool ini bukan web app, melainkan **command-line tool** yang menghasilkan laporan statis (HTML, JSON, SARIF, Markdown).

### Mengapa ini penting?

| Masalah | Solusi Guardrail |
|---------|-----------------|
| Tool SAST enterprise terlalu berat & mahal | Guardrail ringan, zero-JVM, satu perintah |
| Developer mengabaikan hasil scan yang berisik | Guardrail memberi **grade A+–F** yang intuitif |
| Sulit integrasi ke CI/CD | Output SARIF langsung kompatibel GitHub Security |
| Tidak tahu cara memperbaiki | **AI Remediation** otomatis via Groq LLaMA 3.3 |

### Target Pengguna
- **Developer** yang ingin feedback keamanan cepat saat coding
- **DevOps/Security Engineer** yang butuh gating otomatis di pipeline CI/CD
- **Tim Hackathon** yang butuh tool ringan tapi powerful

---

## 2. Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                    CLI Entry Point                       │
│                    (src/cli.ts)                          │
│                                                         │
│  npm run guardrail -- scan <path> [--with-ai]           │
│  npm run dashboard                                      │
└────────────┬────────────────────────────────────────────┘
             │
    ┌────────▼────────┐
    │  Config Loader   │  ← .guardrailrc.json (inheritance/merge)
    │  (src/config/)   │
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │  Scan Engine     │  ← Pattern-based rules + npm audit
    │  (src/scanner/)  │
    │  - rules.ts      │  ← Regex patterns untuk SQLi, XSS, secrets, dll
    │  - deps.ts       │  ← npm audit untuk dependency vulnerabilities
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │  OWASP Mapper    │  ← Map setiap finding ke OWASP Top 10
    │  (src/owasp/)    │
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │  Policy Engine   │  ← failOn severity + scoreThreshold
    │  (src/policy/)   │
    └────────┬────────┘
             │
    ┌────────▼────────┐     ┌──────────────────┐
    │  AI Remediation  │────▶│  Groq Cloud API  │
    │  (src/ai/)       │◀────│  LLaMA 3.3-70B   │
    │  (optional)      │     └──────────────────┘
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │  Scoring Engine  │  ← Weighted penalties → Grade A+–F
    │  (src/scoring/)  │
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │  Report Writers  │
    │  (src/reporter/) │
    │  ├── html.ts     │  → guardrail-report.html (SPA dashboard)
    │  ├── json.ts     │  → guardrail-report.json
    │  ├── sarif.ts    │  → guardrail-report.sarif (GitHub Security)
    │  ├── markdown.ts │  → guardrail-report.md
    │  └── pr-comment  │  → pr-comment.md (untuk GitHub PR bot)
    └─────────────────┘
```

---

## 3. Komponen Detail

### 3.1 Config Loader (`src/config/`)

**Apa yang dilakukan:** Membaca file `.guardrailrc.json` dengan sistem *inheritance*.

**Cara kerja:**
1. Cari root Git repository (folder yang memiliki `.git`)
2. Load semua `.guardrailrc.json` dari root **ke bawah** sampai folder target scan
3. **Merge** konfigurasi: folder yang lebih dalam meng-override yang di atas
4. Array seperti `ignore.paths` di-**union** (digabung, bukan ditimpa)

**Contoh `.guardrailrc.json`:**
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

### 3.2 Scan Engine (`src/scanner/`)

**Apa yang dilakukan:** Mendeteksi kerentanan keamanan menggunakan pattern-based rules.

**File utama:**
- **`rules.ts`** — Kumpulan regex pattern untuk mendeteksi:
  - SQL Injection (`SELECT.*FROM.*\$\{`, `query(.*\+`)
  - Hardcoded Secrets (API keys, JWT secrets, passwords dalam kode)
  - XSS (`innerHTML`, `document.write`, `dangerouslySetInnerHTML`)
  - Weak Crypto (`Math.random()` untuk keamanan, `md5`, `sha1`)
  - SSRF (Server-Side Request Forgery patterns)
  - Path Traversal (`../` dalam file operations)
  - Misconfiguration (wildcard CORS, disabled CSRF)

- **`deps.ts`** — Menjalankan `npm audit --json` untuk mendeteksi dependency yang vulnerable

**Output:** Array of `Finding` objects:
```typescript
type Finding = {
  type: FindingType;      // "injection" | "secret" | "xss" | ...
  title: string;          // "SQL Injection detected"
  severity: Severity;     // "critical" | "high" | "medium" | "low"
  file: string;           // "src/db.ts"
  line: number;           // 42
  description: string;
  recommendation: string;
  owaspCategory?: OwaspMapping;
  aiSuggestion?: AiSuggestion;
};
```

### 3.3 OWASP Mapper (`src/owasp/`)

**Apa yang dilakukan:** Memetakan setiap finding ke kategori OWASP Top 10 (2021).

| Finding Type | OWASP Category |
|-------------|---------------|
| injection | A03:2021 — Injection |
| xss | A03:2021 — Injection |
| secret | A02:2021 — Cryptographic Failures |
| access-control | A01:2021 — Broken Access Control |
| misconfiguration | A05:2021 — Security Misconfiguration |
| dependency | A06:2021 — Vulnerable Components |
| crypto | A02:2021 — Cryptographic Failures |
| ssrf | A10:2021 — SSRF |
| path-traversal | A01:2021 — Broken Access Control |

### 3.4 Policy Engine (`src/policy/`)

**Apa yang dilakukan:** Menentukan apakah scan PASS atau FAIL berdasarkan kebijakan.

**Dua mekanisme gating:**
1. **`failOn`** — Daftar severity yang menyebabkan FAIL. Jika ada finding dengan severity dalam daftar ini, scan FAIL.
   - Default: `["high", "critical"]`
   - Bisa di-override via CLI: `--fail-on=medium,high,critical`

2. **`scoreThreshold`** — Skor minimum yang harus dicapai. Jika skor di bawah threshold, scan FAIL.
   - Default: `0` (tidak aktif)
   - Contoh: `"scoreThreshold": 70` → scan FAIL jika skor < 70

### 3.5 AI Remediation (`src/ai/suggestions.ts`)

**Apa yang dilakukan:** Mengirim findings ke Groq Cloud API (LLaMA 3.3-70B) untuk mendapatkan penjelasan dan kode perbaikan otomatis.

**Cara kerja:**
1. Mengelompokkan findings yang sejenis untuk menghemat API quota
2. Mengirim prompt terstruktur ke Groq dengan konteks kode
3. Menerima respons berisi `explanation`, `fixedCode`, dan `references`
4. Menyimpan hasil sebagai `AiSuggestion` di setiap finding

**Prasyarat:** Environment variable `GROQ_API_KEY` harus di-set.

```bash
# Windows PowerShell
$env:GROQ_API_KEY="gsk_xxxxx"

# Linux/macOS
export GROQ_API_KEY="gsk_xxxxx"
```

### 3.6 Scoring Engine (`src/scoring/`)

**Apa yang dilakukan:** Menghitung skor keamanan (0–100) dan grade (A+–F).

**Formula:**
```
Base Score = 100
Penalty per finding:
  - Critical: -25 poin
  - High:     -10 poin
  - Medium:    -3 poin
  - Low:       -1 poin

Final Score = max(0, 100 - total_penalty)
```

**Tabel Grade:**
| Skor | Grade | Label |
|------|-------|-------|
| 100 | A+ | Excellent — No findings |
| 90–99 | A | Very Good |
| 80–89 | B | Good — Minor issues |
| 70–79 | C | Acceptable |
| 50–69 | D | Needs Improvement |
| 0–49 | F | Critical — Immediate action required |

### 3.7 Report Writers (`src/reporter/`)

**Menghasilkan 5 format output:**

| Format | File | Kegunaan |
|--------|------|----------|
| **HTML** | `guardrail-report.html` | Dashboard visual SPA — bisa dibuka langsung di browser |
| **JSON** | `guardrail-report.json` | Machine-readable data, dipakai oleh dashboard server |
| **SARIF** | `guardrail-report.sarif` | Standard format untuk GitHub Security tab |
| **Markdown** | `guardrail-report.md` | Ringkasan teks untuk dokumentasi |
| **PR Comment** | `pr-comment.md` | Template komentar untuk GitHub PR bot |

### 3.8 Live Dashboard (`src/dashboard/`)

**Apa yang dilakukan:** Menyajikan dashboard web interaktif di `localhost:4000`.

**Arsitektur:**
- **`server.ts`** — HTTP server Node.js sederhana (tanpa Express)
  - `GET /` → Mengirim HTML dashboard (dari `app.ts`)
  - `GET /api/report` → Mengirim data JSON dari `report/guardrail-report.json`
- **`app.ts`** — Template HTML dengan Tailwind CSS (design system Stitch)
  - Fetch data dari `/api/report` saat halaman dimuat
  - Render semua metrik, chart, dan tabel secara dinamis

---

## 4. Alur Kerja (Workflow)

### 4.1 Scan Lokal (Developer)
```bash
# 1. Install dependencies
npm install

# 2. Build TypeScript
npm run build

# 3. Scan proyek (tanpa AI)
npm run guardrail -- scan ./my-project

# 4. Scan proyek (dengan AI remediation)
npm run guardrail -- scan ./my-project --with-ai

# 5. Buka laporan HTML
start report/guardrail-report.html    # Windows
open report/guardrail-report.html     # macOS

# 6. Atau jalankan dashboard interaktif
npm run dashboard
# Buka http://localhost:4000
```

### 4.2 CI/CD (GitHub Actions)
```yaml
# .github/workflows/guardrail.yml
- name: Run OWASP Guardrail
  run: npm run guardrail -- scan . --fail-on=high,critical

- name: Upload SARIF
  uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: report/guardrail-report.sarif

- name: Comment on PR
  uses: actions/github-script@v7
  with:
    script: |
      const comment = fs.readFileSync('report/pr-comment.md', 'utf8');
      github.rest.issues.createComment({...context.repo, body: comment});
```

### 4.3 Demo untuk Juri
```bash
# Satu perintah: build + scan vulnerable app + scan fixed app
npm run demo:judge

# Hasil:
# report-demo-vulnerable/ → Grade F (banyak celah)
# report-demo-fixed/      → Grade A+ (semua diperbaiki)
```

---

## 5. npm Scripts Reference

| Script | Deskripsi |
|--------|-----------|
| `npm run build` | Compile TypeScript → `dist/` |
| `npm test` | Jalankan 30 unit tests |
| `npm run guardrail -- scan <path>` | Scan folder/file target |
| `npm run scan:demo` | Scan demo vulnerable app (tanpa AI) |
| `npm run scan:fixed` | Scan demo fixed app (tanpa AI) |
| `npm run scan:demo:ai` | Scan demo vulnerable app (dengan AI) |
| `npm run scan:fixed:ai` | Scan demo fixed app (dengan AI) |
| `npm run demo:judge` | Build + scan kedua demo app |
| `npm run demo:judge:ai` | Sama tapi dengan AI remediation |
| `npm run dashboard` | Jalankan dashboard di port 4000 |

---

## 6. Struktur Folder

```
hackowasp8/
├── .github/workflows/     # GitHub Actions CI/CD workflow
├── demo/
│   ├── vulnerable-app/    # Aplikasi contoh PENUH celah keamanan
│   └── fixed-app/         # Aplikasi contoh yang SUDAH diperbaiki
├── docs/                  # Dokumentasi proyek
├── public/stitch/         # Design system assets dari Google Stitch
├── report/                # Output default dari scan
├── report-demo-vulnerable/ # Output scan vulnerable app
├── report-demo-fixed/     # Output scan fixed app
├── scripts/               # Helper scripts (judge-demo.mjs)
├── src/
│   ├── ai/                # AI remediation engine (Groq/LLaMA)
│   ├── cli.ts             # Entry point CLI
│   ├── config/            # Config loader (.guardrailrc.json)
│   ├── dashboard/         # Live dashboard server + UI
│   ├── owasp/             # OWASP Top 10 mapping
│   ├── policy/            # Policy engine (pass/fail logic)
│   ├── reporter/          # Report writers (HTML, JSON, SARIF, MD)
│   ├── scanner/           # Scan engine (rules + deps)
│   ├── scoring/           # Scoring engine (grade A+–F)
│   ├── types.ts           # TypeScript type definitions
│   └── util/              # Utility functions
├── tests/                 # Unit tests
├── .guardrailrc.json      # Root config
├── package.json           # npm scripts & dependencies
└── tsconfig.json          # TypeScript compiler config
```

---

## 7. Environment Variables

| Variable | Wajib? | Deskripsi |
|----------|--------|-----------|
| `GROQ_API_KEY` | Opsional | API key untuk Groq Cloud (LLaMA 3.3). Diperlukan hanya jika menggunakan `--with-ai` |
| `GEMINI_API_KEY` | Opsional | API key cadangan (tidak aktif digunakan saat ini) |

---

## 8. Teknologi yang Digunakan

| Teknologi | Kegunaan |
|-----------|----------|
| **Node.js v20+** | Runtime utama |
| **TypeScript** | Bahasa pemrograman (compile via `tsc`) |
| **tsx** | Development runner (jalankan .ts langsung) |
| **Groq Cloud API** | AI inference (LLaMA 3.3-70B) |
| **Tailwind CSS (CDN)** | Styling dashboard (design system Stitch) |
| **Material Symbols** | Icon library |
| **Inter (Google Fonts)** | Typography |
| **SARIF 2.1.0** | Standard output format untuk GitHub Security |

---

## 9. Keunggulan Kompetitif (untuk Juri HackOWASP)

1. **One-Command Demo** — `npm run demo:judge` langsung menghasilkan before/after comparison
2. **OWASP Top 10 Alignment** — Setiap finding dipetakan ke kategori OWASP resmi
3. **AI-Powered Remediation** — Bukan hanya mendeteksi, tapi memberikan kode perbaikan
4. **Pipeline-Ready** — Output SARIF + PR Comment langsung bisa dipakai di GitHub Actions
5. **Zero External Dependencies** — Tidak butuh Docker, JVM, atau database
6. **Premium UI** — Dashboard dengan design system profesional (Google Stitch)
7. **Configurable Policy** — Tim bisa menyesuaikan kebijakan keamanan sesuai kebutuhan
8. **30 Unit Tests** — Kualitas kode tervalidasi

---

<p align="center"><i>OWASP Guardrail — Built for HackOWASP 8.0 by xinnxz</i></p>
