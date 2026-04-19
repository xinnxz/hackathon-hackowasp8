import type { GuardrailReport, OwaspMapping } from "../types";

export function buildHtmlReport(report: GuardrailReport): string {
  const sc = report.securityScore;
  const gaugeColor = sc.score >= 90 ? "#4ade80" : sc.score >= 75 ? "#86efac" : sc.score >= 50 ? "#fb923c" : sc.score >= 25 ? "#f87171" : "#ff4d6d";
  const circumference = 2 * Math.PI * 52;
  const arcLen = (sc.score / 100) * circumference;

  const owaspBuckets = buildOwaspBuckets(
    report.findings.map((f) => f.owaspCategory).filter(Boolean) as OwaspMapping[],
  );

  const findingsHtml = report.findings.length === 0
    ? `<div class="empty">🎉 No findings — clean scan!</div>`
    : report.findings.map((f, i) => buildFindingCard(f, i)).join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>OWASP Guardrail Report — ${report.passed ? "PASS" : "FAIL"}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>
:root{--bg:#070d1a;--card:#0f1729;--border:#1e2d4a;--t:#e2e8f8;--mu:#6b7fa3;--cr:#ff4d6d;--hi:#ff9f43;--me:#ffd166;--lo:#4ade80;--ac:#6d8eff;--ai:#a78bfa;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;background:radial-gradient(ellipse at top,#0d1535,var(--bg) 60%);color:var(--t);min-height:100vh;padding:28px 20px;}
.wrap{max-width:1180px;margin:0 auto;}
header{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;gap:12px;flex-wrap:wrap;}
.logo{font-size:20px;font-weight:800;color:var(--ac);letter-spacing:-.3px;}
.logo span{color:var(--t);font-weight:400;}
.badge{padding:7px 18px;border-radius:999px;font-weight:700;font-size:14px;letter-spacing:.4px;}
.pass{background:#0d2e1d;color:#4ade80;border:1px solid #166534;}
.fail{background:#2d0d1a;color:#f87171;border:1px solid #b91c1c;}
.tabs{display:flex;gap:3px;background:#0a1020;border-radius:10px;padding:4px;margin-bottom:20px;width:fit-content;}
.tab{padding:7px 18px;border-radius:7px;cursor:pointer;font-size:13px;font-weight:500;color:var(--mu);border:none;background:transparent;transition:.2s;}
.tab.on{background:var(--card);color:var(--t);box-shadow:0 1px 4px #0005;}
.sec{display:none;}.sec.on{display:block;}
.hero{display:grid;grid-template-columns:auto 1fr;gap:24px;background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;margin-bottom:16px;align-items:center;}
.gauge-wrap{display:flex;flex-direction:column;align-items:center;gap:8px;}
.grade{font-size:52px;font-weight:800;line-height:1;}
.grade-label{font-size:13px;color:var(--mu);text-align:center;}
.score-details{display:flex;flex-direction:column;gap:8px;}
.score-details h1{font-size:22px;font-weight:700;}
.score-details p{font-size:14px;color:var(--mu);line-height:1.6;}
.meta-grid{display:flex;flex-direction:column;gap:4px;margin-top:4px;font-size:13px;color:var(--mu);}
.meta-grid b{color:var(--t);}
.stats{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:16px;}
.stat{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;text-align:center;}
.stat .n{font-size:32px;font-weight:700;line-height:1.1;}
.stat .l{font-size:11px;color:var(--mu);margin-top:3px;text-transform:uppercase;letter-spacing:.5px;}
.stat.cr .n{color:var(--cr);}
.stat.hi .n{color:var(--hi);}
.stat.me .n{color:var(--me);}
.stat.lo .n{color:var(--lo);}
.row2{display:grid;grid-template-columns:200px 1fr;gap:12px;margin-bottom:16px;}
.card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:18px;}
.card h3{font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:var(--mu);margin-bottom:14px;font-weight:600;}
.donut{display:block;margin:0 auto;}
.legend{display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;margin-top:10px;font-size:12px;color:var(--mu);}
.heat{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;}
.tile{background:#0a1020;border:1px solid var(--border);border-radius:8px;padding:10px;font-size:13px;}
.tile strong{display:block;color:var(--ac);font-size:12px;}
.tile .tbar{height:4px;background:var(--border);border-radius:2px;margin-top:6px;}
.tile .tfill{height:4px;border-radius:2px;background:var(--ac);}
.search-row{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;}
.search-row input,.search-row select{background:#0a1020;border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:var(--t);font-size:13px;outline:none;}
.search-row input{flex:1;min-width:180px;}
.search-row input:focus,.search-row select:focus{border-color:var(--ac);}
details.finding{background:var(--card);border:1px solid var(--border);border-radius:10px;margin-bottom:8px;overflow:hidden;}
details.finding[open]{border-color:var(--ac);}
details.finding summary{display:grid;grid-template-columns:110px 1fr auto;gap:10px;align-items:center;padding:13px;cursor:pointer;list-style:none;user-select:none;}
details.finding summary::-webkit-details-marker{display:none;}
details.finding summary:hover{background:#ffffff08;}
.sev{font-size:11px;font-weight:700;text-align:center;border-radius:5px;padding:4px 0;text-transform:uppercase;}
.sev.critical{background:#3d0e1e;color:#ffa3b4;}
.sev.high{background:#3d2200;color:#ffd0a1;}
.sev.medium{background:#3d3200;color:#ffe99a;}
.sev.low{background:#0d2e1d;color:#a3e8c4;}
.ftitle{font-size:14px;font-weight:500;}
.fmeta{font-size:12px;color:var(--mu);}
.chevron{font-size:16px;color:var(--mu);transition:.2s;}
details[open] .chevron{transform:rotate(90deg);}
.fbody{padding:0 13px 13px;border-top:1px solid var(--border);}
.fbody p{font-size:13px;color:var(--mu);margin-top:10px;line-height:1.65;}
.fbody strong{color:var(--t);}
.owasp-tag{display:inline-flex;align-items:center;gap:4px;background:#1a2240;color:var(--ac);border-radius:4px;padding:3px 8px;font-size:11px;margin-top:8px;font-weight:500;}
.ai-box{background:#100f28;border:1px solid #3d3575;border-radius:8px;padding:12px;margin-top:12px;}
.ai-hd{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:var(--ai);margin-bottom:8px;}
.ai-src{font-size:10px;background:#2d2560;border-radius:3px;padding:1px 5px;}
.ai-exp{font-size:13px;color:#c4b5fd;margin-bottom:8px;line-height:1.6;}
.pre-wrap{position:relative;}
pre{background:#080718;border:1px solid #2d2560;border-radius:6px;padding:12px;overflow-x:auto;font-size:12px;color:#c4b5fd;line-height:1.6;font-family:'Fira Code','Courier New',monospace;}
.copy{position:absolute;top:6px;right:6px;background:#3d3575;border:none;color:#c4b5fd;border-radius:4px;padding:3px 8px;font-size:10px;cursor:pointer;font-family:inherit;}
.copy:hover{background:#4d45a5;}
.refs{margin-top:8px;font-size:11px;}
.refs a{color:#7c9cff;}
.empty{text-align:center;padding:40px;color:var(--mu);font-size:15px;}
@media(max-width:760px){.hero{grid-template-columns:1fr;}.stats{grid-template-columns:repeat(2,1fr);}.row2{grid-template-columns:1fr;}}
</style>
</head>
<body>
<div class="wrap">
<header>
  <div class="logo">⛨ OWASP Guardrail <span>v2.0</span></div>
  <span class="badge ${report.passed ? "pass" : "fail"}">${report.passed ? "✔ PASS" : "✖ FAIL"}</span>
</header>

<div class="tabs">
  <button class="tab on" onclick="tab('ov',this)">Overview</button>
  <button class="tab" onclick="tab('fi',this)">Findings <span id="fc"></span></button>
  <button class="tab" onclick="tab('ow',this)">OWASP Top 10</button>
  <button class="tab" onclick="tab('ai',this)">AI Fixes</button>
</div>

<!-- OVERVIEW -->
<div id="ov" class="sec on">
  <div class="hero">
    <div class="gauge-wrap">
      <svg width="120" height="120" viewBox="0 0 120 120" class="donut">
        <circle cx="60" cy="60" r="52" fill="none" stroke="#1e2d4a" stroke-width="12"/>
        <circle id="gauge-arc" cx="60" cy="60" r="52" fill="none" stroke="${gaugeColor}" stroke-width="12"
          stroke-linecap="round" stroke-dasharray="0 ${circumference.toFixed(1)}"
          style="transform:rotate(-90deg);transform-origin:60px 60px;transition:stroke-dasharray 1.1s ease .2s"/>
      </svg>
      <div class="grade" style="color:${gaugeColor}">${sc.grade}</div>
      <div class="grade-label">${sc.score}/100</div>
    </div>
    <div class="score-details">
      <h1>Security Report</h1>
      <p>${escapeHtml(sc.label)}</p>
      <div class="meta-grid">
        <div><b>Target:</b> ${escapeHtml(report.scannedPath)}</div>
        <div><b>Generated:</b> ${escapeHtml(report.generatedAt)}</div>
        <div><b>Policy:</b> fail-on [${report.policy.failOn.join(", ")}]</div>
        <div><b>AI Mode:</b> ${report.findings.some((f) => f.aiSuggestion?.source === "gemini") ? "🤖 LLaMA 3.3-70B (Groq)" : "📋 Fallback"}</div>
      </div>
    </div>
  </div>
  <div class="stats">
    <div class="stat cr"><div class="n" id="c0">0</div><div class="l">Critical</div></div>
    <div class="stat hi"><div class="n" id="c1">0</div><div class="l">High</div></div>
    <div class="stat me"><div class="n" id="c2">0</div><div class="l">Medium</div></div>
    <div class="stat lo"><div class="n" id="c3">0</div><div class="l">Low</div></div>
    <div class="stat"><div class="n" id="c4">0</div><div class="l">Total</div></div>
  </div>
  <div class="row2">
    <div class="card">
      <h3>Severity Donut</h3>
      <svg id="donut" width="160" height="160" viewBox="0 0 160 160" class="donut">
        <circle cx="80" cy="80" r="56" fill="none" stroke="#1e2d4a" stroke-width="20"/>
      </svg>
      <div class="legend">
        <span style="color:var(--cr)">■ Critical: ${report.summary.critical}</span>
        <span style="color:var(--hi)">■ High: ${report.summary.high}</span>
        <span style="color:var(--me)">■ Medium: ${report.summary.medium}</span>
        <span style="color:var(--lo)">■ Low: ${report.summary.low}</span>
      </div>
    </div>
    <div class="card">
      <h3>OWASP Top 10 Heatmap</h3>
      <div class="heat">${owaspBuckets}</div>
    </div>
  </div>
</div>

<!-- FINDINGS -->
<div id="fi" class="sec">
  <div class="search-row">
    <input type="text" id="q" placeholder="🔍 Search findings..." oninput="filt()"/>
    <select id="fs" onchange="filt()">
      <option value="">All severities</option>
      <option>critical</option><option>high</option><option>medium</option><option>low</option>
    </select>
    <select id="ft" onchange="filt()">
      <option value="">All types</option>
      <option>secret</option><option>injection</option><option>xss</option>
      <option>misconfiguration</option><option>dependency</option><option>access-control</option>
      <option>crypto</option><option>ssrf</option>
    </select>
  </div>
  <div id="flist">${findingsHtml}</div>
</div>

<!-- OWASP -->
<div id="ow" class="sec">
  <div class="card">
    <h3>OWASP Top 10 — Finding Distribution</h3>
    <div class="heat" style="margin-top:8px">${owaspBuckets}</div>
  </div>
</div>

<!-- AI FIXES -->
<div id="ai" class="sec">
  <div id="ailist">${buildAiList(report)}</div>
</div>
</div>

<script>
const TARGET_SCORE=${sc.score};
const COUNTS=[${report.summary.critical},${report.summary.high},${report.summary.medium},${report.summary.low},${report.findings.length}];
const CIRC=${circumference.toFixed(1)};
const ARC=${arcLen.toFixed(1)};

window.addEventListener('DOMContentLoaded',()=>{
  setTimeout(()=>{
    document.getElementById('gauge-arc').setAttribute('stroke-dasharray',ARC+' '+(CIRC-ARC));
  },100);
  COUNTS.forEach((v,i)=>countUp('c'+i,v));
  renderDonut(${report.summary.critical},${report.summary.high},${report.summary.medium},${report.summary.low});
  document.getElementById('fc').textContent='(${report.findings.length})';
});

function countUp(id,target){
  const el=document.getElementById(id);
  if(!el||target===0){if(el)el.textContent=0;return;}
  let n=0,step=Math.max(1,Math.ceil(target/25));
  const t=setInterval(()=>{n=Math.min(n+step,target);el.textContent=n;if(n>=target)clearInterval(t);},30);
}

function renderDonut(cr,hi,me,lo){
  const total=Math.max(1,cr+hi+me+lo);
  const colors=['#ff4d6d','#ff9f43','#ffd166','#4ade80'];
  const vals=[cr,hi,me,lo];
  const circ=2*Math.PI*56;
  let offset=circ*0.25,svg='<circle cx="80" cy="80" r="56" fill="none" stroke="#1e2d4a" stroke-width="20"/>';
  vals.forEach((v,i)=>{
    if(!v)return;
    const dash=(v/total)*circ,gap=circ-dash;
    svg+=\`<circle cx="80" cy="80" r="56" fill="none" stroke="\${colors[i]}" stroke-width="20"
      stroke-dasharray="0 \${circ}" stroke-dashoffset="\${-offset+circ}"
      data-d="\${dash}" data-g="\${gap}"
      style="transform:rotate(-90deg);transform-origin:80px 80px;transition:stroke-dasharray .9s \${.1+i*.15}s ease"/>\`;
    offset+=dash;
  });
  document.getElementById('donut').innerHTML=svg;
  setTimeout(()=>{
    document.querySelectorAll('#donut circle[data-d]').forEach(el=>{
      el.setAttribute('stroke-dasharray',el.dataset.d+' '+el.dataset.g);
    });
  },200);
}

function tab(id,btn){
  document.querySelectorAll('.sec').forEach(s=>s.classList.remove('on'));
  document.querySelectorAll('.tab').forEach(b=>b.classList.remove('on'));
  document.getElementById(id).classList.add('on');
  btn.classList.add('on');
}

function filt(){
  const q=document.getElementById('q').value.toLowerCase();
  const sev=document.getElementById('fs').value;
  const typ=document.getElementById('ft').value;
  document.querySelectorAll('#flist details').forEach(el=>{
    const txt=(el.dataset.t||'').toLowerCase();
    const ok=(!q||txt.includes(q))&&(!sev||el.dataset.s===sev)&&(!typ||el.dataset.y===typ);
    el.style.display=ok?'':'none';
  });
}

document.querySelectorAll('.copy').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const pre=document.getElementById(btn.dataset.p);
    navigator.clipboard.writeText(pre.textContent||'').then(()=>{
      btn.textContent='Copied!';setTimeout(()=>btn.textContent='Copy',1500);
    });
  });
});
</script>
</body>
</html>`;
}

function buildFindingCard(f: ReturnType<typeof Object.values>[0] & { type: string; title: string; severity: string; file: string; line: number; description: string; recommendation: string; owaspCategory?: OwaspMapping; aiSuggestion?: { source: string; explanation: string; fixedCode: string; references: string[] } }, i: number): string {
  const ai = f.aiSuggestion;
  const refs = ai?.references?.map((r: string) => `<a href="${escapeHtml(r)}" target="_blank">${escapeHtml(r)}</a>`).join("<br/>") ?? "";
  const aiHtml = ai ? `
    <div class="ai-box">
      <div class="ai-hd">🤖 AI Fix Suggestion <span class="ai-src">${escapeHtml(ai.source)}</span></div>
      <div class="ai-exp">${escapeHtml(ai.explanation)}</div>
      <div class="pre-wrap"><pre id="p${i}">${escapeHtml(ai.fixedCode)}</pre><button class="copy" data-p="p${i}">Copy</button></div>
      ${refs ? `<div class="refs">${refs}</div>` : ""}
    </div>` : "";

  return `<details class="finding" data-s="${f.severity}" data-y="${f.type}" data-t="${escapeHtml(f.title + " " + f.file + " " + f.description).toLowerCase()}">
  <summary>
    <span class="sev ${f.severity}">${f.severity.toUpperCase()}</span>
    <div><div class="ftitle">${escapeHtml(f.title)}</div><div class="fmeta">${escapeHtml(f.file)}:${f.line}</div></div>
    <span class="chevron">›</span>
  </summary>
  <div class="fbody">
    <p>${escapeHtml(f.description)}</p>
    <p><strong>Recommendation:</strong> ${escapeHtml(f.recommendation)}</p>
    ${f.owaspCategory ? `<span class="owasp-tag">🛡 ${escapeHtml(f.owaspCategory.id)} — ${escapeHtml(f.owaspCategory.name)}</span>` : ""}
    ${aiHtml}
  </div>
</details>`;
}

function buildAiList(report: GuardrailReport): string {
  const withAi = report.findings.filter((f) => f.aiSuggestion);
  if (!withAi.length) return `<div class="empty">Run with --with-ai flag to generate AI fix suggestions.</div>`;
  return withAi.map((f, i) => buildFindingCard(f as Parameters<typeof buildFindingCard>[0], i + 1000)).join("");
}

function buildOwaspBuckets(mappings: OwaspMapping[]): string {
  const counts = new Map<string, { count: number; name: string; link: string }>();
  for (const m of mappings) {
    const cur = counts.get(m.id) ?? { count: 0, name: m.name, link: m.link };
    cur.count++;
    counts.set(m.id, cur);
  }
  if (!counts.size) return `<div class="tile"><strong>No mapped findings</strong>Clean scan!</div>`;
  const max = Math.max(...[...counts.values()].map((v) => v.count));
  return [...counts.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .map(([id, { count, name }]) => `<div class="tile">
      <strong>${escapeHtml(id)}</strong>
      ${escapeHtml(name)}<br/>
      <small style="color:var(--mu)">${count} finding${count > 1 ? "s" : ""}</small>
      <div class="tbar"><div class="tfill" style="width:${(count / max * 100).toFixed(0)}%"></div></div>
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
