export function buildDashboardHtml(): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>OWASP Guardrail — Live Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <style>
    :root{--bg:#070d1a;--card:#0f1729;--border:#1e2d4a;--text:#e2e8f8;--muted:#6b7fa3;--critical:#ff4d6d;--high:#ff9f43;--medium:#ffd166;--low:#40c98d;--accent:#6d8eff;--ai:#a78bfa;}
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;padding:24px;}
    .wrap{max-width:1280px;margin:0 auto;}

    /* NAV TABS */
    .tabs{display:flex;gap:4px;margin-bottom:20px;background:#0a1020;border-radius:12px;padding:4px;width:fit-content;}
    .tab{padding:8px 20px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;color:var(--muted);border:none;background:transparent;transition:.2s;}
    .tab.active{background:var(--card);color:var(--text);}

    /* HEADER */
    .header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;gap:16px;flex-wrap:wrap;}
    .logo{font-size:22px;font-weight:700;color:var(--accent);}
    .badge{padding:6px 14px;border-radius:999px;font-weight:700;font-size:14px;}
    .badge.pass{background:#0d2e1d;color:#4ade80;border:1px solid #15803d;}
    .badge.fail{background:#2d0d1a;color:#f87171;border:1px solid #b91c1c;}

    /* SCORE GAUGE */
    .score-wrap{display:flex;align-items:center;gap:32px;background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;margin-bottom:16px;}
    .gauge-svg{flex-shrink:0;}
    .score-info h2{font-size:48px;font-weight:700;line-height:1;}
    .score-info .grade{font-size:64px;font-weight:800;line-height:1;}
    .score-info .label{color:var(--muted);font-size:15px;margin-top:6px;}
    .score-info .sublabel{font-size:13px;color:var(--muted);margin-top:4px;}

    /* STAT CARDS */
    .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:16px;}
    .stat{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;text-align:center;}
    .stat .num{font-size:36px;font-weight:700;line-height:1.1;}
    .stat .lbl{font-size:12px;color:var(--muted);margin-top:4px;text-transform:uppercase;letter-spacing:.5px;}
    .stat.critical .num{color:var(--critical);}
    .stat.high .num{color:var(--high);}
    .stat.medium .num{color:var(--medium);}
    .stat.low .num{color:var(--low);}

    /* CHARTS ROW */
    .charts-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;}
    .chart-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px;}
    .chart-card h3{font-size:14px;color:var(--muted);margin-bottom:14px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;}

    /* SEARCH */
    .search-row{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;}
    .search-row input{flex:1;min-width:200px;background:#0a1020;border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:var(--text);font-size:14px;}
    .search-row select{background:#0a1020;border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:var(--text);font-size:14px;}

    /* FINDINGS */
    .finding{background:var(--card);border:1px solid var(--border);border-radius:12px;margin-bottom:8px;overflow:hidden;}
    .finding summary{display:grid;grid-template-columns:120px 1fr auto;gap:12px;align-items:center;padding:14px;cursor:pointer;list-style:none;}
    .finding summary::-webkit-details-marker{display:none;}
    .finding summary:hover{background:#1a2540;}
    .sev{font-size:12px;font-weight:700;text-align:center;border-radius:6px;padding:4px 8px;text-transform:uppercase;}
    .sev.critical{background:#3d0e1e;color:#ffa3b4;}
    .sev.high{background:#3d2200;color:#ffd0a1;}
    .sev.medium{background:#3d3200;color:#ffe99a;}
    .sev.low{background:#0d2e1d;color:#a3e8c4;}
    .finding-meta{font-size:12px;color:var(--muted);}
    .finding-body{padding:0 14px 14px;border-top:1px solid var(--border);}
    .finding-body p{font-size:14px;color:var(--muted);margin-top:10px;line-height:1.6;}
    .owasp-tag{display:inline-block;background:#1a2240;color:var(--accent);border-radius:4px;padding:2px 8px;font-size:12px;margin-top:6px;}
    .ai-box{background:#12102b;border:1px solid #3d3575;border-radius:8px;padding:12px;margin-top:12px;}
    .ai-box .ai-header{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--ai);margin-bottom:8px;}
    .ai-box pre{background:#0a0818;border:1px solid #2d2560;border-radius:6px;padding:10px;overflow:auto;font-size:13px;color:#c4b5fd;position:relative;}
    .copy-btn{position:absolute;top:6px;right:6px;background:#3d3575;border:none;color:#c4b5fd;border-radius:4px;padding:3px 8px;font-size:11px;cursor:pointer;}
    .copy-btn:hover{background:#4d45a5;}
    .ai-refs{margin-top:8px;font-size:12px;}
    .ai-refs a{color:#7c9cff;}

    /* RADAR */
    .radar-wrap{display:flex;justify-content:center;}

    /* OWASP TABLE */
    .owasp-table{width:100%;border-collapse:collapse;font-size:13px;}
    .owasp-table th,.owasp-table td{padding:8px 12px;text-align:left;border-bottom:1px solid var(--border);}
    .owasp-table th{color:var(--muted);font-weight:600;}
    .owasp-bar{height:8px;background:#1e2d4a;border-radius:4px;overflow:hidden;}
    .owasp-bar-fill{height:100%;background:var(--accent);border-radius:4px;transition:width .6s ease;}

    /* EMPTY */
    .empty{text-align:center;padding:48px;color:var(--muted);}
    .section{display:none;}.section.active{display:block;}

    @media(max-width:700px){.charts-row{grid-template-columns:1fr;}.score-wrap{flex-direction:column;}}
  </style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="logo">⛨ OWASP Guardrail</div>
    <div id="status-badge" class="badge">Loading...</div>
  </div>

  <div class="tabs">
    <button class="tab active" onclick="showTab('overview')">Overview</button>
    <button class="tab" onclick="showTab('findings')">Findings</button>
    <button class="tab" onclick="showTab('owasp')">OWASP</button>
    <button class="tab" onclick="showTab('ai')">AI Suggestions</button>
  </div>

  <!-- OVERVIEW TAB -->
  <div id="tab-overview" class="section active">
    <div class="score-wrap">
      <svg class="gauge-svg" width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="64" fill="none" stroke="#1e2d4a" stroke-width="16"/>
        <circle id="gauge-arc" cx="80" cy="80" r="64" fill="none" stroke="#6d8eff" stroke-width="16"
          stroke-linecap="round" stroke-dasharray="0 402" stroke-dashoffset="100"
          style="transition:stroke-dasharray 1.2s ease;transform:rotate(-90deg);transform-origin:80px 80px"/>
        <text id="gauge-num" x="80" y="76" text-anchor="middle" font-size="28" font-weight="700" fill="#e2e8f8">—</text>
        <text id="gauge-grade" x="80" y="104" text-anchor="middle" font-size="20" font-weight="800" fill="#6d8eff">—</text>
      </svg>
      <div class="score-info">
        <div class="grade" id="score-grade" style="color:#6d8eff">—</div>
        <div class="label" id="score-label">Loading...</div>
        <div class="sublabel" id="score-sublabel"></div>
      </div>
    </div>
    <div class="stats">
      <div class="stat critical"><div class="num" id="cnt-critical">—</div><div class="lbl">Critical</div></div>
      <div class="stat high"><div class="num" id="cnt-high">—</div><div class="lbl">High</div></div>
      <div class="stat medium"><div class="num" id="cnt-medium">—</div><div class="lbl">Medium</div></div>
      <div class="stat low"><div class="num" id="cnt-low">—</div><div class="lbl">Low</div></div>
      <div class="stat"><div class="num" id="cnt-total">—</div><div class="lbl">Total</div></div>
    </div>
    <div class="charts-row">
      <div class="chart-card">
        <h3>Severity Distribution</h3>
        <svg id="donut" width="180" height="180" viewBox="0 0 180 180" style="display:block;margin:0 auto">
          <circle cx="90" cy="90" r="64" fill="none" stroke="#1e2d4a" stroke-width="24"/>
        </svg>
      </div>
      <div class="chart-card">
        <h3>Scan Info</h3>
        <p id="scan-info" style="font-size:13px;color:var(--muted);line-height:1.8;"></p>
      </div>
    </div>
  </div>

  <!-- FINDINGS TAB -->
  <div id="tab-findings" class="section">
    <div class="search-row">
      <input type="text" id="search-input" placeholder="Search findings..." oninput="filterFindings()"/>
      <select id="sev-filter" onchange="filterFindings()">
        <option value="">All severities</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select id="type-filter" onchange="filterFindings()">
        <option value="">All types</option>
        <option value="secret">Secret</option>
        <option value="injection">Injection</option>
        <option value="xss">XSS</option>
        <option value="misconfiguration">Misconfiguration</option>
        <option value="dependency">Dependency</option>
        <option value="access-control">Access Control</option>
        <option value="crypto">Crypto</option>
        <option value="ssrf">SSRF</option>
      </select>
    </div>
    <div id="findings-list"></div>
  </div>

  <!-- OWASP TAB -->
  <div id="tab-owasp" class="section">
    <div class="chart-card" style="margin-bottom:16px;">
      <h3>OWASP Top 10 Coverage</h3>
      <table class="owasp-table" id="owasp-table">
        <thead><tr><th>Category</th><th>Name</th><th>Findings</th><th>Distribution</th></tr></thead>
        <tbody id="owasp-tbody"></tbody>
      </table>
    </div>
    <div class="chart-card">
      <h3>Radar Chart</h3>
      <div class="radar-wrap"><svg id="radar-svg" width="280" height="280" viewBox="0 0 280 280"></svg></div>
    </div>
  </div>

  <!-- AI TAB -->
  <div id="tab-ai" class="section">
    <div id="ai-list"></div>
  </div>
</div>

<script>
let reportData = null;

async function init() {
  try {
    const res = await fetch('/api/report');
    reportData = await res.json();
    render();
  } catch(e) {
    document.body.innerHTML = '<div class="empty"><h2>Failed to load report</h2><p>Make sure the dashboard server is running</p></div>';
  }
}

function render() {
  const r = reportData;
  const sc = r.securityScore;

  // Status badge
  const badge = document.getElementById('status-badge');
  badge.textContent = r.passed ? '✔ PASS' : '✖ FAIL';
  badge.className = 'badge ' + (r.passed ? 'pass' : 'fail');

  // Score gauge
  const circumference = 2 * Math.PI * 64;
  const arc = (sc.score / 100) * circumference;
  setTimeout(() => {
    document.getElementById('gauge-arc').setAttribute('stroke-dasharray', arc + ' ' + (circumference - arc));
    document.getElementById('gauge-arc').setAttribute('stroke', sc.color || '#6d8eff');
  }, 100);
  document.getElementById('gauge-num').textContent = sc.score;
  document.getElementById('gauge-grade').textContent = sc.grade;
  document.getElementById('score-grade').textContent = sc.grade;
  document.getElementById('score-grade').style.color = sc.color || '#6d8eff';
  document.getElementById('score-label').textContent = sc.label;
  document.getElementById('score-sublabel').textContent = 'Score: ' + sc.score + '/100';

  // Counters with animation
  animateCount('cnt-critical', r.summary.critical);
  animateCount('cnt-high', r.summary.high);
  animateCount('cnt-medium', r.summary.medium);
  animateCount('cnt-low', r.summary.low);
  animateCount('cnt-total', r.findings.length);

  // Donut chart
  renderDonut(r.summary);

  // Scan info
  document.getElementById('scan-info').innerHTML = [
    '<b>Target:</b> ' + r.scannedPath,
    '<b>Generated:</b> ' + new Date(r.generatedAt).toLocaleString(),
    '<b>Policy:</b> Fail on [' + r.policy.failOn.join(', ') + ']',
    '<b>AI Mode:</b> ' + (r.findings.some(f => f.aiSuggestion?.source === 'groq') ? '🤖 LLaMA 3.3 (Groq)' : '📋 Fallback'),
  ].join('<br/>');

  // Findings
  renderFindings(r.findings);

  // OWASP
  renderOwasp(r.findings);

  // AI tab
  renderAiTab(r.findings);
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  let cur = 0;
  const step = Math.max(1, Math.ceil(target / 30));
  const timer = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur;
    if (cur >= target) clearInterval(timer);
  }, 30);
}

function renderDonut(summary) {
  const colors = { critical: '#ff4d6d', high: '#ff9f43', medium: '#ffd166', low: '#40c98d' };
  const total = Math.max(1, summary.critical + summary.high + summary.medium + summary.low);
  const cx = 90, cy = 90, r = 64, sw = 24;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  let svgParts = '<circle cx="90" cy="90" r="64" fill="none" stroke="#1e2d4a" stroke-width="24"/>';
  for (const [key, color] of Object.entries(colors)) {
    const count = summary[key];
    if (!count) continue;
    const dash = (count / total) * circ;
    const gap = circ - dash;
    svgParts += \`<circle cx="\${cx}" cy="\${cy}" r="\${r}" fill="none" stroke="\${color}" stroke-width="\${sw}"
      stroke-dasharray="0 \${circ}" stroke-dashoffset="\${circ * 0.25 - offset}"
      style="transform:rotate(-90deg);transform-origin:\${cx}px \${cy}px;transition:stroke-dasharray 1s \${0.2}s ease"
      data-dash="\${dash}" data-gap="\${gap}"/>\`;
    offset += dash;
  }
  document.getElementById('donut').innerHTML = svgParts;
  // Animate donut segments
  setTimeout(() => {
    document.querySelectorAll('#donut circle[data-dash]').forEach(el => {
      const d = el.getAttribute('data-dash'), g = el.getAttribute('data-gap');
      el.setAttribute('stroke-dasharray', d + ' ' + g);
    });
  }, 200);
}

function renderFindings(findings) {
  const container = document.getElementById('findings-list');
  if (!findings.length) { container.innerHTML = '<div class="empty">🎉 No findings — clean scan!</div>'; return; }
  container.innerHTML = findings.map((f, i) => buildFindingCard(f, i, 'fd')).join('');
  addCopyListeners('fd');
}

function buildFindingCard(f, i, prefix) {
  const ai = f.aiSuggestion;
  const aiHtml = ai ? \`<div class="ai-box">
    <div class="ai-header">🤖 AI Fix Suggestion <span style="font-size:11px;opacity:.7;margin-left:6px">(\${ai.source})</span></div>
    <p style="font-size:13px;color:#a78bfa;margin-bottom:8px">\${esc(ai.explanation)}</p>
    <div style="position:relative"><pre id="\${prefix}-pre-\${i}">\${esc(ai.fixedCode)}</pre><button class="copy-btn" data-target="\${prefix}-pre-\${i}">Copy</button></div>
    \${ai.references.map(r => \`<div class="ai-refs"><a href="\${r}" target="_blank">\${r}</a></div>\`).join('')}
  </div>\` : '';
  return \`<details class="finding" data-sev="\${f.severity}" data-type="\${f.type}" data-text="\${esc(f.title + f.file + f.description).toLowerCase()}">
    <summary>
      <span class="sev \${f.severity}">\${f.severity.toUpperCase()}</span>
      <div><div style="font-size:14px;font-weight:500">\${esc(f.title)}</div><div class="finding-meta">\${esc(f.file)}:\${f.line}</div></div>
      <span style="font-size:18px;color:var(--muted)">›</span>
    </summary>
    <div class="finding-body">
      <p>\${esc(f.description)}</p>
      <p><strong>Recommendation:</strong> \${esc(f.recommendation)}</p>
      \${f.owaspCategory ? \`<span class="owasp-tag">\${f.owaspCategory.id} \${f.owaspCategory.name}</span>\` : ''}
      \${aiHtml}
    </div>
  </details>\`;
}

function filterFindings() {
  const q = document.getElementById('search-input').value.toLowerCase();
  const sev = document.getElementById('sev-filter').value;
  const type = document.getElementById('type-filter').value;
  document.querySelectorAll('#findings-list details').forEach(el => {
    const matchQ = !q || el.dataset.text.includes(q);
    const matchS = !sev || el.dataset.sev === sev;
    const matchT = !type || el.dataset.type === type;
    el.style.display = matchQ && matchS && matchT ? '' : 'none';
  });
}

function renderOwasp(findings) {
  const counts = {};
  const names = {};
  const links = {};
  for (const f of findings) {
    if (f.owaspCategory) {
      counts[f.owaspCategory.id] = (counts[f.owaspCategory.id] || 0) + 1;
      names[f.owaspCategory.id] = f.owaspCategory.name;
      links[f.owaspCategory.id] = f.owaspCategory.link;
    }
  }
  const max = Math.max(1, ...Object.values(counts));
  const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
  document.getElementById('owasp-tbody').innerHTML = sorted.map(([id, cnt]) =>
    \`<tr>
      <td><a href="\${links[id]}" target="_blank" style="color:var(--accent)">\${id}</a></td>
      <td>\${names[id] || ''}</td>
      <td><strong>\${cnt}</strong></td>
      <td style="width:200px"><div class="owasp-bar"><div class="owasp-bar-fill" style="width:\${(cnt/max*100).toFixed(1)}%"></div></div></td>
    </tr>\`
  ).join('') || '<tr><td colspan="4" style="color:var(--muted)">No OWASP mappings found.</td></tr>';
  renderRadar(counts, names);
}

function renderRadar(counts, names) {
  const ids = Object.keys(counts);
  if (!ids.length) return;
  const max = Math.max(...Object.values(counts), 1);
  const cx = 140, cy = 140, r = 100, n = ids.length;
  const colors = ['#6d8eff','#ff4d6d','#ff9f43','#ffd166','#40c98d','#a78bfa','#34d399'];
  let svg = '';
  // Grid circles
  for (let l = 1; l <= 4; l++) svg += \`<circle cx="\${cx}" cy="\${cy}" r="\${r * l/4}" fill="none" stroke="#1e2d4a" stroke-width="1"/>\`;
  // Axes and labels
  ids.forEach((id, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const x2 = cx + r * Math.cos(angle), y2 = cy + r * Math.sin(angle);
    const lx = cx + (r + 18) * Math.cos(angle), ly = cy + (r + 18) * Math.sin(angle);
    svg += \`<line x1="\${cx}" y1="\${cy}" x2="\${x2}" y2="\${y2}" stroke="#1e2d4a"/>\`;
    svg += \`<text x="\${lx}" y="\${ly}" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="#6b7fa3">\${id.replace(':2021','')}</text>\`;
  });
  // Data polygon
  const pts = ids.map((id, i) => {
    const val = (counts[id] || 0) / max;
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return (cx + r * val * Math.cos(angle)) + ',' + (cy + r * val * Math.sin(angle));
  });
  svg += \`<polygon points="\${pts.join(' ')}" fill="rgba(109,142,255,.15)" stroke="#6d8eff" stroke-width="2"/>\`;
  ids.forEach((id, i) => {
    const val = (counts[id] || 0) / max;
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    svg += \`<circle cx="\${cx + r * val * Math.cos(angle)}" cy="\${cy + r * val * Math.sin(angle)}" r="5" fill="#6d8eff"/>\`;
  });
  document.getElementById('radar-svg').innerHTML = svg;
}

function renderAiTab(findings) {
  const withAi = findings.filter(f => f.aiSuggestion);
  const container = document.getElementById('ai-list');
  if (!withAi.length) { container.innerHTML = '<div class="empty">No AI suggestions. Run with --with-ai flag.</div>'; return; }
  container.innerHTML = withAi.map((f, i) => buildFindingCard(f, i, 'ai')).join('');
  addCopyListeners('ai');
}

function addCopyListeners(prefix) {
  document.querySelectorAll(\`.copy-btn[data-target^="\${prefix}"]\`).forEach(btn => {
    btn.addEventListener('click', () => {
      const pre = document.getElementById(btn.dataset.target);
      navigator.clipboard.writeText(pre.textContent || '').then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
      });
    });
  });
}

function showTab(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  event.target.classList.add('active');
}

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

init();
</script>
</body>
</html>`;
}
