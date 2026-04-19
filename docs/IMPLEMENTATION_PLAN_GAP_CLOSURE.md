# Implementation Plan — Gap Closure & Hardening

**Project:** OWASP Guardrail (HackOWASP 8.0)  
**Document version:** 1.0  
**Last updated:** 2026-04-19  
**Purpose:** Menutup celah antara dokumentasi / janji fitur dengan perilaku kode aktual, serta meningkatkan kredibilitas teknis sebelum penilaian akhir.

---

## 1. Executive summary

Audit singkat menunjukkan bahwa **konfigurasi `.guardrailrc.json` dan `policy.scoreThreshold` belum terhubung ke mesin scan dan logika PASS/FAIL**. Ini adalah risiko utama terhadap kredibilitas demo: reviewer yang menguji “mematikan rule” akan melihat perilaku yang tidak sesuai README.

Rencana ini mengutamakan **integritas perilaku (behavioral integrity)** di atas penambahan fitur visual baru. Estimasi total implementasi terfokus: **~8–14 jam** kerja untuk satu developer, dapat dipecah menjadi sprint harian.

---

## 2. Tujuan dan bukan-ruang lingkup

### 2.1 Tujuan (Goals)

| ID | Goal | Ukuran sukses |
|----|------|----------------|
| G1 | Konfigurasi proyek **mengendalikan** rule scanner yang aktif | Mati `xss: false` → tidak ada finding XSS dari rule tersebut |
| G2 | `ignore.paths` mengabaikan file/direktori dari scan | Path yang di-ignore tidak muncul di findings |
| G3 | `ignore.findings` menyaring hasil berdasarkan identitas finding yang stabil | Filter berdasarkan id/title yang terdokumentasi |
| G4 | `policy.scoreThreshold` mempengaruhi **PASS/FAIL** bersama severity `failOn` | Score di bawah threshold → FAIL meskipun tidak ada high/critical (atau sesuai kebijakan yang didokumentasikan) |
| G5 | Satu prioritas kebijakan yang jelas: **CLI override config** | Urutan merge dokumentasi + tes |
| G6 | CI menghasilkan scan **deterministik** untuk repo ini | Workflow tidak membanjiri noise dari path yang tidak relevan |

### 2.2 Non-goals (Out of scope untuk fase ini)

- Mengganti engine regex menjadi AST parser penuh (Semgrep-class).
- Menambah bahasa pemrograman baru di luar Node/JS stack yang sudah ada.
- Mengubah branding atau ulang besar dashboard kecuali diperlukan oleh perubahan data report.

---

## 3. Arsitektur target (alur data)

```
.guardrailrc.json  ──►  loadConfig(targetPath)
                              │
                              ▼
                     scanProject(targetPath, config)
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        scanFiles      scanDependencies   (filter)
        (respect        (respect
         ignore.paths)   config.rules.*)
                              │
                              ▼
                     applyIgnoreFindings(config)
                              │
                              ▼
                     mapFindingToOwasp / scoring
                              │
                              ▼
              evaluatePolicy(findings, cliFailOn, config, score)
```

---

## 4. Fase kerja

### Fase A — Kontrak konfigurasi (0.5–1 jam)

**Deliverable:** Spesifikasi perilaku tertulis di README satu halaman + contoh file.

**Tugas:**

- A1. Dokumentasikan prioritas: `CLI --fail-on` **meng-override** `config.policy.failOn` jika flag ada; jika tidak, pakai config lalu default.
- A2. Dokumentasikan semantik `scoreThreshold` (contoh: FAIL jika `securityScore.score < scoreThreshold` **atau** ada finding pada severity `failOn` — pilih satu model dan patuhi di kode).
- A3. Definisikan format `ignore.findings`: array glob string pada `title`, atau `type:severity`, atau `id` stabil (disarankan: `ruleId` stabil per jenis rule).

**Acceptance:** Review internal: tidak ada ambiguitas “PASS tapi score merah” tanpa penjelasan.

---

### Fase B — Wire config ke scanner (2–4 jam)

**Deliverable:** `scanProject(targetPath, config)` dan pemanggil di `cli.ts` menyalurkan config hasil `loadConfig`.

**Tugas:**

- B1. Ubah signature `scanProject` (dan `scanFiles` / `listFiles`) untuk menerima `GuardrailConfig`.
- B2. Di `listFiles`, skip subtree yang cocok `ignore.paths` (glob atau prefix sederhana — dokumentasikan subset yang didukung).
- B3. Refactor `scanRuleLine` / `scanSecretLine` menjadi **dispatcher** yang memeriksa `config.rules.*` sebelum menjalankan blok deteksi:
  - `secrets`, `injection`, `xss`, `cors`, `eval`, `ssrf`, `weakCrypto`, `pathTraversal`, `insecureHttp`, `authMiddleware`.
- B4. `scanDependencies`: optional flag di config (mis. `rules.dependencies` jika belum ada — tambahkan ke schema) agar audit npm bisa dimatikan per proyek.

**Acceptance:**

- Unit test: config dengan semua `rules` false kecuali satu → hanya finding dari rule yang aktif.
- Unit test: `ignore.paths` menghilangkan file dari hasil.

---

### Fase C — Filter `ignore.findings` (1–2 jam)

**Deliverable:** Post-processing setelah scan, sebelum scoring.

**Tugas:**

- C1. Implementasikan matcher untuk entri `ignore.findings` (minimal: substring `title`, atau `type:severity`).
- C2. Pastikan summary dan SARIF memakai findings **setelah** filter (atau dokumentasikan “pre-filter” jika ingin transparansi — disarankan setelah filter).

**Acceptance:** Tes dengan fixture finding palsu yang di-ignore tidak muncul di JSON report.

---

### Fase D — Policy engine terpadu (1–2 jam)

**Deliverable:** Satu fungsi `evaluatePassFail(report, mergedPolicy)`.

**Tugas:**

- D1. Merge `failOn` dari CLI vs config (sesuai Fase A).
- D2. Terapkan `scoreThreshold` sesuai semantik yang dipilih.
- D3. Set `report.passed` hanya dari fungsi ini; CLI cukup memanggil sekali.

**Acceptance:** Tes: findings kosong tapi score rendah (fixture) → FAIL jika threshold memaksa; atau sebaliknya sesuai dokumen.

---

### Fase E — CI dan determinisme (0.5–1.5 jam)

**Deliverable:** Workflow yang konsisten dengan struktur repo.

**Tugas:**

- E1. Ubah `guardrail.yml` agar memindai target eksplisit (mis. `demo/vulnerable-app` untuk job demo) **atau** tambahkan `.guardrailrc.json` di root dengan `ignore.paths` untuk `docs/`, `report/`, dll.
- E2. Pastikan `npm ci` tetap valid (lockfile ada).
- E3. Dokumentasikan secret `GROQ_API_KEY` di README untuk fork pribadi.

**Acceptance:** PR uji coba lokal / `act` (opsional) menghasilkan SARIF + comment tanpa error permission yang tidak tertangani.

---

### Fase F — Pengujian dan regresi (1.5–3 jam)

**Deliverable:** Cakupan tes minimal untuk perilaku baru.

**Tugas:**

- F1. Tes integrasi ringan: `loadConfig` + `scanProject` pada fixture kecil di `tests/fixtures/`.
- F2. Tes `evaluatePassFail` dengan matrix kasus (pass severity, fail severity, threshold).
- F3. Snapshot ringan untuk JSON report (opsional, jangan rapuh terhadap timestamp — strip field dinamis).

**Acceptance:** `npm test` hijau di CI; `npm run build` hijau.

---

### Fase G — Dokumentasi akhir (0.5–1 jam)

**Tugas:**

- G1. README: section “Configuration semantics” + contoh `.guardrailrc.json` di `demo/vulnerable-app/`.
- G2. Hapus atau perbaiki klaim yang masih mengandaikan fitur belum ter-wire (self-audit README vs kode).

**Acceptance:** Checklist self-review: setiap bullet fitur utama di README punya perilaku yang dapat direproduksi dengan perintah di bawahnya.

---

## 5. Jadwal indikatif

| Fase | Durasi (jam) | Ketergantungan |
|------|----------------|----------------|
| A | 0.5–1 | — |
| B | 2–4 | A |
| C | 1–2 | B |
| D | 1–2 | B, A |
| E | 0.5–1.5 | D (untuk perilaku final) |
| F | 1.5–3 | B, C, D |
| G | 0.5–1 | F |

**Total:** ~8–14 jam.

---

## 6. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| Glob `ignore.paths` terlalu kompleks | Bug edge case Windows vs POSIX | Fase 1: dukung hanya prefix + `*` sederhana; dokumentasikan |
| Perubahan signature `scanProject` | Pecah impor lain | Cari semua pemanggil (`cli`, tes, skrip) |
| Perubahan semantik PASS/FAIL | Demo hackathon berubah | Update demo script + `demo/` `.guardrailrc` |

---

## 7. Daftar file yang diperkirakan berubah

- `src/cli.ts` — pass config ke scan; panggil policy evaluator.
- `src/scanner/index.ts` — signature + ignore paths + wire rules.
- `src/scanner/rules.ts` / `src/scanner/secrets.ts` — guard per rule atau parameter `RuleContext`.
- `src/config/index.ts` — optional field baru (`rules.dependencies`), validasi ringan.
- `src/types.ts` — jika perlu tipe helper policy / `ScanOptions`.
- `tests/**/*.test.ts` — fixture baru.
- `.github/workflows/guardrail.yml` — target scan / ignore.
- `README.md` — semantik konfigurasi.
- `demo/*/.guardrailrc.json` — contoh nyata (baru).

---

## 8. Definisi selesai (Definition of Done)

- [ ] `.guardrailrc.json` mengubah perilaku scan yang dapat ditunjukkan dalam demo 60 detik.
- [ ] `scoreThreshold` mempengaruhi `passed` sesuai dokumentasi.
- [ ] CLI vs config: prioritas terdokumentasi dan teruji.
- [ ] CI scan tidak menghasilkan noise yang memalukan pada repo default.
- [ ] `npm test` + `npm run build` lulus.
- [ ] README tidak mengklaim fitur yang tidak ada di kode.

---

## 9. Catatan etika kompetisi

Semua perubahan harus merupakan **karya tim sendiri** dan mematuhi aturan HackOWASP / DoraHacks. Dokumen ini hanya panduan engineering; tidak menggantikan rubrik resmi penyelenggara.

---

## 10. Status implementasi (baseline gap closure)

Per **2026-04-19**, inti rencana Fase B–D berikut telah diintegrasikan ke codebase:

- `scanProject(targetPath, config)` memakai `GuardrailConfig` untuk rule toggles dan audit dependency opsional.
- `ignore.paths` (glob sederhana `*` / `**`) dan `ignore.findings` diterapkan.
- `mergeFailOn` + `evaluatePass` (severity + `scoreThreshold`) mengatur `report.passed` dan `policy.notes`.
- Contoh repo root: `.guardrailrc.json` untuk CI `scan .` yang mengabaikan `demo/`, `docs/`, `tests/`, dll.

Item lanjutan opsional: perluasan glob `ignore.paths`, tes edge case tambahan (`loadConfig` pada file vs folder), dan polish laporan.

### 10.1 Update lanjutan (2026-04-19)

- **SARIF rule id stabil:** `src/util/stableRuleId.ts` — hash SHA-256 dari `type` + `title`; `rules` di SARIF deduplikasi per id (tidak lagi `type-index`).
- **Parent config (Git-bounded):** `src/config/discovery.ts` — `listConfigDirectories` hanya dari **root Git** ke target; tanpa `.git`, hanya folder target. `loadConfig()` menggabungkan berkas dalam urutan itu (lihat log `Merged N file(s): …`).
