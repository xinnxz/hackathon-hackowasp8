# Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         OWASP Guardrail v2.0                        │
│                    Enterprise DevSecOps Scanner                      │
└─────────────────────────────────────────────────────────────────────┘

   ┌──────────────┐
   │   CLI Entry   │  src/cli.ts
   │  (Commander)  │  Parses --fail-on, --with-ai, --output-dir, --api-key
   └──────┬───────┘
          │
   ┌──────▼───────┐
   │    Config     │  src/config/index.ts
   │   Loader      │  Finds Git root → merges .guardrailrc.json chain
   └──────┬───────┘
          │
   ┌──────▼───────┐     ┌───────────────┐     ┌───────────────────┐
   │   Scanner     │────▶│  Rules Engine  │────▶│  Secret Detector  │
   │  Orchestrator │     │  src/scanner/  │     │  (regex patterns) │
   │               │     │  rules.ts      │     │  secrets.ts       │
   └──────┬───────┘     └───────────────┘     └───────────────────┘
          │
          │  Findings[]
          │
   ┌──────▼───────┐
   │    OWASP      │  src/owasp/mapping.ts
   │   Mapper      │  Maps each finding → A01:2021 – A10:2021
   └──────┬───────┘
          │
   ┌──────▼───────┐
   │    Policy     │  src/policy/index.ts
   │   Engine      │  ignore.paths, ignore.findings, scoreThreshold
   └──────┬───────┘
          │
   ┌──────▼───────┐     ┌────────────────────────────────┐
   │  AI Engine    │────▶│  Groq API (LLaMA 3.3 70B)     │
   │  (Optional)   │     │  Sequential + dedup + retry    │
   │  suggestions  │     │  JSON response_format          │
   └──────┬───────┘     └────────────────────────────────┘
          │
   ┌──────▼───────┐
   │   Scoring     │  src/scoring/index.ts
   │  Engine       │  Penalty weights → Score 0-100 → Grade A+ to F
   └──────┬───────┘
          │
          ├──────────────┬──────────────┬──────────────┬──────────────┐
          │              │              │              │              │
   ┌──────▼──────┐┌─────▼─────┐┌──────▼──────┐┌─────▼─────┐┌──────▼──────┐
   │  HTML Report ││   JSON    ││    SARIF    ││  Markdown ││ PR Comment  │
   │  (SPA + SVG) ││  Report   ││  (GitHub   ││  Report   ││ (CI/CD Bot) │
   │  Animated    ││           ││  Security) ││           ││             │
   └─────────────┘└───────────┘└────────────┘└───────────┘└─────────────┘

          │
   ┌──────▼───────┐
   │  Dashboard    │  src/dashboard/server.ts + app.ts
   │  (localhost   │  node:http → SPA with gauge, donut,
   │   port 4000)  │  radar, tabs, search, copy buttons
   └──────────────┘


   ┌──────────────────────────────────────────────────────────────────┐
   │                       CI/CD Pipeline                              │
   │  .github/workflows/guardrail.yml                                  │
   │                                                                   │
   │  Push/PR → Install → Scan → Upload SARIF → PR Comment → Artifacts│
   └──────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
Source Code ──▶ Pattern Matching ──▶ Findings[] ──▶ OWASP Mapping
                                                        │
                                                        ▼
                                          ┌─── Policy Filter (ignore)
                                          │
                                          ▼
                                   AI Remediation (Groq)
                                          │
                                          ▼
                                    Security Score
                                          │
                                          ▼
                              ┌───────────┼───────────┐
                              ▼           ▼           ▼
                            HTML        SARIF       PR Bot
                          Report      (GitHub)    (Comment)
```

## Module Responsibilities

| Module | Path | Purpose |
|--------|------|---------|
| CLI | `src/cli.ts` | Entry point, arg parsing, orchestration |
| Config | `src/config/` | `.guardrailrc.json` discovery and merge |
| Scanner | `src/scanner/` | File walking, rule matching, `npm audit` |
| OWASP | `src/owasp/` | Finding → OWASP Top 10 category mapping |
| Policy | `src/policy/` | Ignore filters, pass/fail evaluation |
| AI | `src/ai/` | Groq API integration, dedup, retry |
| Scoring | `src/scoring/` | Penalty calculation, A+–F grading |
| Reporter | `src/reporter/` | HTML, JSON, SARIF, Markdown, PR comment |
| Dashboard | `src/dashboard/` | Local HTTP SPA server |
