import type { GuardrailReport, OwaspMapping } from "../types";

export function buildHtmlReport(report: GuardrailReport): string {
  const sc = report.securityScore;
  const gradeLabel = sc.score >= 90 ? "Excellent — No findings" : sc.score >= 75 ? "Good — Minor issues" : sc.score >= 50 ? "Needs Improvement" : "Immediate action required";
  
  // Logic to show severity distributions
  const cr = report.summary.critical;
  const hi = report.summary.high;
  const me = report.summary.medium;
  const lo = report.summary.low;
  
  const owaspBuckets = buildOwaspBuckets(
    report.findings.map((f) => f.owaspCategory).filter(Boolean) as OwaspMapping[],
  );

  const findingsHtml = report.findings.length === 0
    ? `<tr><td colspan="4" class="py-5 font-medium text-on-surface text-center">🎉 No findings — clean scan!</td></tr>`
    : report.findings.map((f, i) => buildFindingRow(f, i)).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>OWASP Guardrail Report</title>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
          theme: {
            extend: {
              "colors": {
                      "on-tertiary-fixed-variant": "#842225",
                      "tertiary": "#a43a3a",
                      "on-error": "#ffffff",
                      "on-background": "#131e19",
                      "on-primary-container": "#00422b",
                      "surface-dim": "#d0ddd5",
                      "secondary-fixed-dim": "#9ed2b5",
                      "inverse-surface": "#27332d",
                      "surface": "#f0fdf4",
                      "primary": "#006c49",
                      "surface-container-high": "#deebe3",
                      "on-tertiary-fixed": "#410005",
                      "on-primary-fixed": "#002113",
                      "secondary": "#376850",
                      "on-surface-variant": "#3c4a42",
                      "on-tertiary": "#ffffff",
                      "surface-container-lowest": "#ffffff",
                      "outline": "#6c7a71",
                      "inverse-primary": "#4edea3",
                      "background": "#f0fdf4",
                      "surface-bright": "#f0fdf4",
                      "surface-variant": "#d9e6dd",
                      "on-primary-fixed-variant": "#005236",
                      "surface-container-highest": "#d9e6dd",
                      "on-surface": "#131e19",
                      "on-secondary-container": "#3c6c54",
                      "on-secondary-fixed-variant": "#1e4f3a",
                      "surface-tint": "#006c49",
                      "on-primary": "#ffffff",
                      "surface-container": "#e4f1e8",
                      "surface-container-low": "#eaf7ee",
                      "on-tertiary-container": "#711419",
                      "tertiary-container": "#fc7c78",
                      "on-secondary-fixed": "#002113",
                      "outline-variant": "#bbcabf",
                      "primary-fixed": "#6ffbbe",
                      "on-secondary": "#ffffff",
                      "on-error-container": "#93000a",
                      "tertiary-fixed-dim": "#ffb3af",
                      "inverse-on-surface": "#e7f4eb",
                      "secondary-fixed": "#baeed1",
                      "primary-container": "#10b981",
                      "secondary-container": "#b7ebce",
                      "error-container": "#ffdad6",
                      "primary-fixed-dim": "#4edea3",
                      "error": "#ba1a1a",
                      "tertiary-fixed": "#ffdad7"
              },
              "fontFamily": {
                      "headline": ["Inter"],
                      "body": ["Inter"],
                      "label": ["Inter"]
              }
            },
          },
        }
    </script>
<style type="text/tailwindcss">
        .tick-mark {
            position: absolute;
            width: 2px;
            height: 6px;
            background: #bbcabf;
            left: 50%;
            top: 0;
            transform-origin: 50% 48px;
        }
        .ai-code-block {
            background:#080718;
            color:#c4b5fd;
            border-radius:6px;
            padding:12px;
            overflow-x:auto;
            font-size:12px;
            font-family:'Courier New',monospace;
            margin-top: 10px;
        }
        .ai-copy-btn {
            background:#3d3575;color:#c4b5fd;border-radius:4px;padding:3px 8px;font-size:10px;cursor:pointer;
        }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .tab-btn.active { color: #006c49; border-bottom-width: 2px; border-color: #006c49; font-weight: 600; }
    </style>
</head>
<body class="bg-surface text-on-surface font-body min-h-screen pt-16">
<nav class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md flex justify-between items-center px-10 h-16 shadow-[0_4px_24px_rgba(19,30,25,0.04)] font-inter text-sm font-medium tracking-wide">
<div class="flex items-center gap-8">
<div class="text-xl font-bold text-on-surface flex items-center gap-2">
<span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">shield</span>
                OWASP Guardrail
            </div>
<ul class="hidden md:flex items-center gap-6">
<li><button class="tab-btn active pb-1 transition-all duration-200" onclick="switchTab('tab-dashboard', this)">Dashboard</button></li>
<li><button class="tab-btn pb-1 text-on-surface/60 hover:text-primary transition-all duration-200" onclick="switchTab('tab-findings', this)">Findings</button></li>
<li><button class="tab-btn pb-1 text-on-surface/60 hover:text-primary transition-all duration-200" onclick="switchTab('tab-ai', this)">AI Fixes</button></li>
</ul>
</div>
<div class="flex items-center gap-4">
<span class="px-3 py-1 rounded-full text-xs font-bold ${report.passed ? 'bg-primary/20 text-primary' : 'bg-error/20 text-error'}">
  ${report.passed ? "✔ PASS" : "✖ FAIL"}
</span>
</div>
</nav>

<main class="max-w-7xl mx-auto px-6 py-12">
<header class="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
<div class="space-y-2">
<h1 class="text-on-surface font-bold text-[3.5rem] leading-tight tracking-tight">Security Overview</h1>
<p class="text-on-surface-variant font-medium text-xl">Target: ${escapeHtml(report.scannedPath)}</p>
<p class="text-sm text-outline">Generated: ${escapeHtml(report.generatedAt)}</p>
</div>
<div class="bg-gradient-to-br from-surface-container-lowest to-surface-container-low rounded-lg p-5 shadow-[0_8px_32px_rgba(19,30,25,0.03)] border border-primary/10 w-full lg:w-96">
<div class="flex items-center justify-between mb-4">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shadow-md">
<span class="material-symbols-outlined text-on-primary-container text-sm" style="font-variation-settings: 'FILL' 1;">smart_toy</span>
</div>
<div>
<h3 class="font-headline text-sm font-semibold text-on-surface">AI Assistant</h3>
<p class="text-[10px] text-primary font-medium flex items-center gap-1"><span class="w-1 h-1 rounded-full bg-primary"></span> ${report.findings.some((f) => f.aiSuggestion) ? "Active (Groq)" : "Idle"}</p>
</div>
</div>
</div>
<div class="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-3 relative shadow-sm text-sm">
<p class="text-on-surface font-medium">${report.passed ? "Great job! Your code is looking secure." : "I found vulnerabilities. Check the AI Fixes tab for automated code patches."}</p>
</div>
</div>
</header>

<!-- DASHBOARD TAB -->
<div id="tab-dashboard" class="tab-content active">
<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
<div class="bg-surface-container-lowest rounded-lg p-6 shadow-[0_8px_32px_rgba(19,30,25,0.03)] flex flex-col justify-between">
<div class="flex justify-between items-start mb-6">
<span class="font-label text-xs uppercase tracking-wider text-outline font-bold">Total Findings</span>
<span class="material-symbols-outlined text-outline-variant">bug_report</span>
</div>
<div>
<div class="font-headline text-[3.5rem] font-bold text-on-surface leading-none mb-2" id="stat-total">0</div>
<div class="h-8 w-full relative mt-4">
<svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
<path d="M0,15 Q10,10 20,18 T40,12 T60,16 T80,5 T100,8" fill="none" stroke="${report.passed ? '#10b981' : '#ba1a1a'}" stroke-linecap="round" stroke-width="2"></path>
</svg>
</div>
</div>
</div>
<div class="bg-surface-container-lowest rounded-lg p-6 shadow-[0_8px_32px_rgba(19,30,25,0.03)] flex flex-col justify-between">
<div class="flex justify-between items-start mb-6">
<span class="font-label text-xs uppercase tracking-wider text-outline font-bold">Critical Issues</span>
<span class="material-symbols-outlined text-error" style="font-variation-settings: 'FILL' 1;">warning</span>
</div>
<div>
<div class="font-headline text-[3.5rem] font-bold ${cr > 0 ? 'text-error' : 'text-primary'} leading-none mb-2" id="stat-critical">0</div>
<p class="text-sm text-outline mt-4">High priority fixes</p>
</div>
</div>
<div class="bg-surface-container-lowest rounded-lg p-6 shadow-[0_8px_32px_rgba(19,30,25,0.03)] flex flex-col justify-between">
<div class="flex justify-between items-start mb-4">
<span class="font-label text-xs uppercase tracking-wider text-outline font-bold">Security Score</span>
<span class="material-symbols-outlined text-outline-variant">speed</span>
</div>
<div class="flex items-center gap-6">
<div class="relative w-24 h-24">
<div class="w-full h-full rounded-full border-[8px] border-surface-container"></div>
<div class="absolute inset-0">
<div class="tick-mark" style="transform: rotate(0deg)"></div>
<div class="tick-mark" style="transform: rotate(30deg)"></div>
<div class="tick-mark" style="transform: rotate(60deg)"></div>
<div class="tick-mark" style="transform: rotate(90deg)"></div>
<div class="tick-mark" style="transform: rotate(120deg)"></div>
<div class="tick-mark" style="transform: rotate(150deg)"></div>
<div class="tick-mark" style="transform: rotate(180deg)"></div>
<div class="tick-mark" style="transform: rotate(210deg)"></div>
<div class="tick-mark" style="transform: rotate(240deg)"></div>
<div class="tick-mark" style="transform: rotate(270deg)"></div>
<div class="tick-mark" style="transform: rotate(300deg)"></div>
<div class="tick-mark" style="transform: rotate(330deg)"></div>
</div>
<div class="absolute inset-0 flex items-center justify-center">
<div class="font-headline text-2xl font-bold ${sc.score >= 75 ? 'text-primary' : 'text-error'} leading-none">${sc.score}<span class="text-[10px] text-outline font-medium">/100</span></div>
</div>
</div>
</div>
</div>
<div class="bg-surface-container-lowest rounded-lg p-6 shadow-[0_8px_32px_rgba(19,30,25,0.03)] ${sc.score < 50 ? 'bg-error/5 border border-error/20' : ''} flex flex-col justify-between">
<div class="flex justify-between items-start mb-4">
<span class="font-label text-xs uppercase tracking-wider ${sc.score >= 75 ? 'text-primary' : 'text-error'} font-bold">Grade</span>
<span class="material-symbols-outlined ${sc.score >= 75 ? 'text-primary' : 'text-error'}">${sc.score >= 75 ? 'verified_user' : 'assignment_late'}</span>
</div>
<div class="flex flex-col h-full justify-end">
<div class="font-headline text-[4rem] font-black ${sc.score >= 75 ? 'text-primary' : 'text-error'} leading-none mb-2">${sc.grade}</div>
<p class="text-xs font-medium ${sc.score >= 75 ? 'text-primary' : 'text-error'} flex items-start gap-1">${gradeLabel}</p>
</div>
</div>
</section>

<section class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
<div class="bg-surface-container-lowest rounded-lg p-6 shadow-[0_8px_32px_rgba(19,30,25,0.03)] flex flex-col">
<h3 class="font-headline text-sm font-semibold text-on-surface mb-6 uppercase tracking-wider">Severity Distribution</h3>
<div class="flex items-center justify-between gap-4">
<div class="relative w-32 h-32">
<div id="donut-container" class="w-full h-full rounded-full border-[12px] border-surface-container relative"></div>
<div class="absolute inset-0 flex items-center justify-center flex-col">
<span class="text-xl font-bold">${report.findings.length}</span>
</div>
</div>
<div class="flex-1 space-y-2 ml-4">
<div class="flex items-center justify-between text-xs font-medium"><span class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-error"></div> Critical</span><span>${cr}</span></div>
<div class="flex items-center justify-between text-xs font-medium"><span class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-orange-500"></div> High</span><span>${hi}</span></div>
<div class="flex items-center justify-between text-xs font-medium"><span class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-yellow-500"></div> Medium</span><span>${me}</span></div>
<div class="flex items-center justify-between text-xs font-medium"><span class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-primary"></div> Low</span><span>${lo}</span></div>
</div>
</div>
</div>

<div class="bg-surface-container-lowest rounded-lg p-6 shadow-[0_8px_32px_rgba(19,30,25,0.03)]">
<h3 class="font-headline text-sm font-semibold text-on-surface mb-6 uppercase tracking-wider">OWASP Top 10 Coverage</h3>
<div class="grid grid-cols-2 gap-4">
  ${owaspBuckets}
</div>
</div>
</section>

</div> <!-- END DASHBOARD TAB -->

<!-- FINDINGS TAB -->
<div id="tab-findings" class="tab-content">
<section class="w-full mb-12">
<div class="bg-surface-container-lowest rounded-lg p-8 shadow-[0_8px_32px_rgba(19,30,25,0.03)]">
<div class="flex justify-between items-center mb-8">
<h3 class="font-headline text-xl font-semibold text-on-surface">All Findings</h3>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="border-b-2 border-surface-variant text-outline font-label text-xs uppercase tracking-wider">
<th class="pb-4 font-bold">Vulnerability</th>
<th class="pb-4 font-bold">Severity</th>
<th class="pb-4 font-bold">File / Line</th>
<th class="pb-4 font-bold">Category</th>
</tr>
</thead>
<tbody>
${findingsHtml}
</tbody>
</table>
</div>
</div>
</section>
</div>

<!-- AI FIXES TAB -->
<div id="tab-ai" class="tab-content">
<section class="w-full mb-12">
<div class="bg-surface-container-lowest rounded-lg p-8 shadow-[0_8px_32px_rgba(19,30,25,0.03)]">
<div class="flex justify-between items-center mb-8">
<h3 class="font-headline text-xl font-semibold text-on-surface">AI Auto-Remediation</h3>
</div>
<div class="space-y-6">
${buildAiList(report)}
</div>
</div>
</section>
</div>

</main>

<script>
// Animate numbers
function countUp(id, target) {
  const el = document.getElementById(id);
  if(!el) return;
  if(target === 0) { el.textContent = 0; return; }
  let n = 0, step = Math.max(1, Math.ceil(target/25));
  const t = setInterval(() => { n = Math.min(n+step, target); el.textContent = n; if(n>=target) clearInterval(t); }, 30);
}

// Render donut chart manually using conic-gradient
function renderDonut(cr, hi, me, lo) {
  const container = document.getElementById('donut-container');
  if(!container) return;
  const total = cr + hi + me + lo;
  if(total === 0) {
    container.style.background = '#e4f1e8';
    return;
  }
  
  const pCr = (cr / total) * 100;
  const pHi = (hi / total) * 100;
  const pMe = (me / total) * 100;
  const pLo = (lo / total) * 100;
  
  let currentP = 0;
  const stops = [];
  
  if (cr > 0) { stops.push('#ba1a1a ' + currentP + '% ' + (currentP + pCr) + '%'); currentP += pCr; }
  if (hi > 0) { stops.push('#f97316 ' + currentP + '% ' + (currentP + pHi) + '%'); currentP += pHi; }
  if (me > 0) { stops.push('#eab308 ' + currentP + '% ' + (currentP + pMe) + '%'); currentP += pMe; }
  if (lo > 0) { stops.push('#006c49 ' + currentP + '% ' + (currentP + pLo) + '%'); currentP += pLo; }
  
  container.style.background = 'conic-gradient(' + stops.join(', ') + ')';
}

function switchTab(tabId, btn) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => {
    el.classList.remove('active', 'text-primary');
    el.classList.add('text-on-surface/60');
  });
  
  document.getElementById(tabId).classList.add('active');
  btn.classList.add('active', 'text-primary');
  btn.classList.remove('text-on-surface/60');
}

window.addEventListener('DOMContentLoaded', () => {
  countUp('stat-total', ${report.findings.length});
  countUp('stat-critical', ${cr});
  renderDonut(${cr}, ${hi}, ${me}, ${lo});
});

function copyCode(id, btn) {
  const pre = document.getElementById(id);
  navigator.clipboard.writeText(pre.textContent||'').then(()=>{
    btn.textContent='Copied!';setTimeout(()=>btn.textContent='Copy',1500);
  });
}
</script>
</body>
</html>`;
}

function buildFindingRow(f: any, i: number): string {
  let badgeColor = "bg-primary/10 text-primary";
  if (f.severity === "critical") badgeColor = "bg-error/10 text-error";
  if (f.severity === "high") badgeColor = "bg-orange-500/10 text-orange-600";
  if (f.severity === "medium") badgeColor = "bg-yellow-500/10 text-yellow-600";

  return `<tr class="border-b border-surface-variant/50 hover:bg-surface-container-low/30 transition-colors">
<td class="py-5 font-medium text-on-surface">
  ${escapeHtml(f.title)}
  <div class="text-xs text-outline mt-1 font-normal max-w-md">${escapeHtml(f.description)}</div>
</td>
<td class="py-5">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeColor} uppercase tracking-wider">${f.severity}</span>
</td>
<td class="py-5"><span class="text-sm text-outline font-mono text-[11px]">${escapeHtml(f.file)}:${f.line}</span></td>
<td class="py-5">
  ${f.owaspCategory ? `<span class="text-xs font-medium text-primary">${escapeHtml(f.owaspCategory.id)}</span>` : `<span class="text-xs text-outline">Unmapped</span>`}
</td>
</tr>`;
}

function buildAiList(report: GuardrailReport): string {
  const withAi = report.findings.filter((f) => f.aiSuggestion);
  if (!withAi.length) return `<div class="py-10 text-center text-outline">Run with <code>--with-ai</code> flag to generate AI fix suggestions.</div>`;
  
  return withAi.map((f, i) => {
    const ai = f.aiSuggestion!;
    let badgeColor = "bg-primary/10 text-primary";
    if (f.severity === "critical") badgeColor = "bg-error/10 text-error";
    if (f.severity === "high") badgeColor = "bg-orange-500/10 text-orange-600";

    return `
    <div class="border border-outline-variant/30 rounded-lg p-5">
      <div class="flex justify-between items-start mb-4">
        <div>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeColor} uppercase tracking-wider mb-2">${f.severity}</span>
          <h4 class="font-bold text-on-surface text-base">${escapeHtml(f.title)}</h4>
          <p class="text-xs text-outline font-mono mt-1">${escapeHtml(f.file)}:${f.line}</p>
        </div>
        <div class="bg-primary/10 text-primary px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">auto_awesome</span> ${escapeHtml(ai.source)}
        </div>
      </div>
      <div class="text-sm text-on-surface-variant mb-4">${escapeHtml(ai.explanation)}</div>
      <div class="relative">
        <button class="ai-copy-btn absolute top-2 right-2" onclick="copyCode('code-${i}', this)">Copy</button>
        <pre id="code-${i}" class="ai-code-block">${escapeHtml(ai.fixedCode)}</pre>
      </div>
    </div>
    `;
  }).join("");
}

function buildOwaspBuckets(mappings: OwaspMapping[]): string {
  const counts = new Map<string, { count: number; name: string; link: string }>();
  for (const m of mappings) {
    const cur = counts.get(m.id) ?? { count: 0, name: m.name, link: m.link };
    cur.count++;
    counts.set(m.id, cur);
  }
  if (!counts.size) return `<div class="col-span-2 text-sm text-outline">No mapped findings. Clean scan!</div>`;
  const max = Math.max(...[...counts.values()].map((v) => v.count));
  return [...counts.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .map(([id, { count, name }]) => `<div class="border border-outline-variant/30 p-3 rounded-md">
      <div class="flex justify-between items-center mb-2">
        <strong class="text-xs text-on-surface">${escapeHtml(id)}</strong>
        <span class="text-[10px] bg-surface-container-high px-2 py-0.5 rounded">${count} finding${count > 1 ? "s" : ""}</span>
      </div>
      <div class="text-[10px] text-outline truncate mb-2" title="${escapeHtml(name)}">${escapeHtml(name)}</div>
      <div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
        <div class="bg-primary h-full rounded-full" style="width:${(count / max * 100).toFixed(0)}%"></div>
      </div>
    </div>`).join("");
}

function escapeHtml(value: string): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
