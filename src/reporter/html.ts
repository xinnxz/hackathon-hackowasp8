import type { GuardrailReport, OwaspMapping } from "../types";

export function buildHtmlReport(report: GuardrailReport): string {
  const owaspBuckets = buildOwaspBuckets(report.findings.map((finding) => finding.owaspCategory).filter(Boolean) as OwaspMapping[]);
  const chartStyle = buildChartStyle(report.summary);
  const findingsRows = report.findings.map((finding) => {
    const refs = finding.aiSuggestion?.references?.map((ref) => `<li><a href="${escapeHtml(ref)}">${escapeHtml(ref)}</a></li>`).join("") ?? "";
    return `
      <details class="finding ${finding.severity}">
        <summary>
          <span class="sev ${finding.severity}">${finding.severity.toUpperCase()}</span>
          <span class="title">${escapeHtml(finding.title)}</span>
          <span class="meta">${escapeHtml(finding.file)}:${finding.line}</span>
        </summary>
        <div class="body">
          <p>${escapeHtml(finding.description)}</p>
          <p><strong>Recommendation:</strong> ${escapeHtml(finding.recommendation)}</p>
          <p><strong>OWASP:</strong> ${escapeHtml(finding.owaspCategory?.id ?? "Unmapped")} ${escapeHtml(finding.owaspCategory?.name ?? "")}</p>
          ${finding.aiSuggestion ? `
            <div class="ai">
              <h4>AI Fix Suggestion (${finding.aiSuggestion.source})</h4>
              <p>${escapeHtml(finding.aiSuggestion.explanation)}</p>
              <pre>${escapeHtml(finding.aiSuggestion.fixedCode)}</pre>
              <ul>${refs}</ul>
            </div>
          ` : ""}
        </div>
      </details>
    `;
  }).join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>OWASP Guardrail Report</title>
  <style>
    :root { --bg:#0b1020; --card:#131a2f; --line:#2a3555; --text:#e8edf9; --muted:#9aa7c7; --critical:#ff5a76; --high:#ff9f43; --medium:#ffd166; --low:#40c98d; --accent:#7c9cff; }
    body { margin: 0; font-family: Inter, Segoe UI, Arial, sans-serif; background: radial-gradient(circle at top right, #1b2648, var(--bg)); color: var(--text); padding: 24px; }
    .wrap { max-width: 1200px; margin: 0 auto; }
    .hero, .card { background: color-mix(in srgb, var(--card) 86%, transparent); border: 1px solid var(--line); border-radius: 14px; padding: 18px; backdrop-filter: blur(6px); }
    .hero { display: flex; justify-content: space-between; gap: 18px; margin-bottom: 16px; }
    .badge { padding: 8px 12px; border-radius: 999px; font-weight: 700; letter-spacing: .4px; }
    .pass { background: #143322; color: #99f6c0; border: 1px solid #1f7a4b; }
    .fail { background: #3a1721; color: #ff9db0; border: 1px solid #8a2d49; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; margin: 16px 0; }
    .stat { padding: 12px; border-radius: 10px; background: #0f1630; border: 1px solid var(--line); }
    .chart { width: 180px; height: 180px; border-radius: 50%; margin: 0 auto; background: ${chartStyle}; }
    .legend { display: grid; grid-template-columns: repeat(2, minmax(120px, 1fr)); gap: 6px 12px; margin-top: 10px; font-size: 14px; color: var(--muted); }
    .row { display: grid; grid-template-columns: 240px 1fr; gap: 16px; margin-top: 14px; }
    .heat { display:grid; grid-template-columns: repeat(auto-fit, minmax(180px,1fr)); gap:10px; }
    .tile { background:#0f1630; border:1px solid var(--line); border-radius:10px; padding:10px; }
    .findings { margin-top: 16px; display: grid; gap: 10px; }
    .finding { background: #0f1630; border: 1px solid var(--line); border-radius: 10px; }
    summary { list-style:none; display:grid; grid-template-columns: 130px 1fr auto; gap:10px; align-items:center; padding:12px; cursor:pointer; }
    summary::-webkit-details-marker { display:none; }
    .sev { font-weight:700; text-align:center; border-radius:999px; padding:5px 8px; }
    .sev.critical { background:#4a1d2d; color:#ffb3c2; }
    .sev.high { background:#4d2f15; color:#ffd0a1; }
    .sev.medium { background:#4c401a; color:#ffe59c; }
    .sev.low { background:#1a3c2d; color:#9de6bf; }
    .meta { color: var(--muted); font-size: 13px; }
    .body { padding: 0 12px 12px; color: var(--muted); }
    .ai { border:1px solid #35416b; padding:10px; border-radius:8px; margin-top:10px; background:#101832; }
    pre { background:#0a1124; border:1px solid #2d3a61; border-radius:8px; padding:10px; overflow:auto; }
    a { color: #9ec1ff; }
    @media (max-width: 900px) { .row { grid-template-columns: 1fr; } summary { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="wrap">
    <section class="hero">
      <div>
        <h1>OWASP Guardrail Security Report</h1>
        <p>Scan target: ${escapeHtml(report.scannedPath)}</p>
        <p>Generated: ${escapeHtml(report.generatedAt)}</p>
      </div>
      <div>
        <span class="badge ${report.passed ? "pass" : "fail"}">${report.passed ? "PASS" : "FAIL"}</span>
      </div>
    </section>

    <section class="grid">
      <div class="stat">Critical<br /><strong>${report.summary.critical}</strong></div>
      <div class="stat">High<br /><strong>${report.summary.high}</strong></div>
      <div class="stat">Medium<br /><strong>${report.summary.medium}</strong></div>
      <div class="stat">Low<br /><strong>${report.summary.low}</strong></div>
      <div class="stat">Total Findings<br /><strong>${report.findings.length}</strong></div>
    </section>

    <section class="row">
      <div class="card">
        <h3>Severity Donut</h3>
        <div class="chart"></div>
        <div class="legend">
          <span>Critical: ${report.summary.critical}</span>
          <span>High: ${report.summary.high}</span>
          <span>Medium: ${report.summary.medium}</span>
          <span>Low: ${report.summary.low}</span>
        </div>
      </div>
      <div class="card">
        <h3>OWASP Top 10 Heatmap</h3>
        <div class="heat">${owaspBuckets}</div>
      </div>
    </section>

    <section class="findings">${findingsRows || "<p>No findings.</p>"}</section>
  </div>
</body>
</html>`;
}

function buildChartStyle(summary: GuardrailReport["summary"]): string {
  const total = Math.max(1, summary.critical + summary.high + summary.medium + summary.low);
  const critical = (summary.critical / total) * 360;
  const high = (summary.high / total) * 360;
  const medium = (summary.medium / total) * 360;
  const low = 360 - critical - high - medium;
  const p1 = critical;
  const p2 = p1 + high;
  const p3 = p2 + medium;
  const p4 = p3 + low;
  return `conic-gradient(
    var(--critical) 0deg ${p1}deg,
    var(--high) ${p1}deg ${p2}deg,
    var(--medium) ${p2}deg ${p3}deg,
    var(--low) ${p3}deg ${p4}deg
  )`;
}

function buildOwaspBuckets(owaspMappings: OwaspMapping[]): string {
  const counts = new Map<string, number>();
  for (const mapping of owaspMappings) {
    counts.set(mapping.id, (counts.get(mapping.id) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => `<div class="tile"><strong>${escapeHtml(id)}</strong><br />Findings: ${count}</div>`)
    .join("") || "<div class='tile'>No mapped findings.</div>";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
