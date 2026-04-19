# Judge demo — ~2 minutes

Use this flow for live review, video, or reproducibility checks.

## One command (recommended)

From the repo root (after `npm install`):

```bash
npm run demo:judge
```

This will:

1. Build the TypeScript project.
2. Scan `demo/vulnerable-app` and write reports under `report-demo-vulnerable/` (expect **FAIL** and a low grade — intentional).
3. Scan `demo/fixed-app` and write reports under `report-demo-fixed/` (expect **PASS** and **A+**).

Open both HTML reports in a browser:

- `report-demo-vulnerable/guardrail-report.html`
- `report-demo-fixed/guardrail-report.html`

The script exits **0** when the fixed demo passes, even if the vulnerable demo fails policy (so CI and judges are not blocked by the intentional bad app).

## With AI fix suggestions (optional)

Requires `GROQ_API_KEY` (see main README).

```bash
npm run demo:judge:ai
```

## Dashboard

After any scan:

```bash
npm run dashboard
```

Then open the URL shown (default port **4000**) to show the interactive UI. Run a scan first so the dashboard has data to load.

## Talking points (30 seconds)

- **Problem:** Teams need OWASP-aligned feedback without standing up a heavy SAST cluster.
- **What we built:** A Node-focused scanner with grading, SARIF/HTML/JSON/Markdown, policy (`fail-on`, score threshold), Git-bounded config merge, and optional Groq-powered fixes.
- **Proof:** Two demo apps — bad vs fixed — plus unit tests and CI.

## Optional: short screen recording

Record **~90 seconds**: terminal running `npm run demo:judge` → open `report-demo-vulnerable` HTML → scroll findings → open `report-demo-fixed` → show PASS → optionally `npm run dashboard`. Upload as unlisted video or GIF for the submission portal if the hackathon allows.
