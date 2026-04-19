export function buildDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>OWASP Guardrail - Live Dashboard</title>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script>
tailwind.config={darkMode:"class",theme:{extend:{colors:{"on-tertiary-fixed-variant":"#842225",tertiary:"#a43a3a","on-error":"#ffffff","on-background":"#131e19","on-primary-container":"#00422b","surface-dim":"#d0ddd5","secondary-fixed-dim":"#9ed2b5","inverse-surface":"#27332d",surface:"#f0fdf4",primary:"#006c49","surface-container-high":"#deebe3","on-tertiary-fixed":"#410005","on-primary-fixed":"#002113",secondary:"#376850","on-surface-variant":"#3c4a42","on-tertiary":"#ffffff","surface-container-lowest":"#ffffff",outline:"#6c7a71","inverse-primary":"#4edea3",background:"#f0fdf4","surface-bright":"#f0fdf4","surface-variant":"#d9e6dd","on-primary-fixed-variant":"#005236","surface-container-highest":"#d9e6dd","on-surface":"#131e19","on-secondary-container":"#3c6c54","on-secondary-fixed-variant":"#1e4f3a","surface-tint":"#006c49","on-primary":"#ffffff","surface-container":"#e4f1e8","surface-container-low":"#eaf7ee","on-tertiary-container":"#711419","tertiary-container":"#fc7c78","on-secondary-fixed":"#002113","outline-variant":"#bbcabf","primary-fixed":"#6ffbbe","on-secondary":"#ffffff","on-error-container":"#93000a","tertiary-fixed-dim":"#ffb3af","inverse-on-surface":"#e7f4eb","secondary-fixed":"#baeed1","primary-container":"#10b981","secondary-container":"#b7ebce","error-container":"#ffdad6","primary-fixed-dim":"#4edea3",error:"#ba1a1a","tertiary-fixed":"#ffdad7"},fontFamily:{headline:["Inter"],body:["Inter"],label:["Inter"]}}}}
</script>
<style type="text/tailwindcss">
.tick-mark{position:absolute;width:2px;height:6px;background:#bbcabf;left:50%;top:0;transform-origin:50% 48px;}
.tab-content { display: none; }
.tab-content.active { display: block; }
.ai-code-block { background:#080718; color:#c4b5fd; border-radius:6px; padding:12px; overflow-x:auto; font-size:12px; font-family:'Courier New',monospace; margin-top:10px; }
.ai-copy-btn { background:#3d3575; color:#c4b5fd; border-radius:4px; padding:3px 8px; font-size:10px; cursor:pointer; }
</style>
</head>
<body class="bg-surface text-on-surface font-body min-h-screen pt-16">

<!-- NAV -->
<nav class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md flex justify-between items-center px-10 h-16 shadow-[0_4px_24px_rgba(19,30,25,0.04)] text-sm font-medium tracking-wide">
<div class="flex items-center gap-8">
<div class="text-xl font-bold text-on-surface flex items-center gap-2">
<span class="material-symbols-outlined text-primary" style="font-variation-settings:'FILL' 1;">shield</span> OWASP Guardrail
</div>
<ul class="hidden md:flex items-center gap-6" id="nav-tabs">
<li><button class="tab-btn active text-primary border-b-2 border-primary pb-1 font-semibold" onclick="switchTab('tab-dashboard', 0)">Dashboard</button></li>
<li><button class="tab-btn text-on-surface/60 hover:text-primary transition-all duration-200" onclick="switchTab('tab-findings', 1)">Findings</button></li>
<li><button class="tab-btn text-on-surface/60 hover:text-primary transition-all duration-200" onclick="switchTab('tab-owasp', 2)">OWASP Map</button></li>
<li><button class="tab-btn text-on-surface/60 hover:text-primary transition-all duration-200" onclick="switchTab('tab-ai', 3)">AI Fixes</button></li>
</ul>
</div>
<div class="flex items-center gap-4">
<span id="status-badge" class="px-3 py-1 rounded-full text-xs font-bold bg-surface-container-high text-on-surface">Loading...</span>
</div>
</nav>

<main class="max-w-7xl mx-auto px-6 py-12">
<!-- HEADER -->
<header class="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
<div class="space-y-2">
<h1 class="text-on-surface font-bold text-[3.5rem] leading-tight tracking-tight">Security Overview</h1>
<p class="text-on-surface-variant font-medium text-xl" id="scan-target">Loading target...</p>
</div>
<!-- AI ASSISTANT CARD -->
<div class="bg-gradient-to-br from-surface-container-lowest to-surface-container-low rounded-lg p-5 shadow-[0_8px_32px_rgba(19,30,25,0.03)] border border-primary/10 w-full lg:w-96">
<div class="flex items-center justify-between mb-4">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shadow-md">
<span class="material-symbols-outlined text-on-primary-container text-sm" style="font-variation-settings:'FILL' 1;">smart_toy</span>
</div>
<div>
<h3 class="font-headline text-sm font-semibold text-on-surface">AI Fix Assistant</h3>
<p class="text-[10px] text-primary font-medium flex items-center gap-1" id="ai-status"><span class="w-1 h-1 rounded-full bg-primary"></span> Idle</p>
</div>
</div>
<div class="flex gap-2">
<button onclick="switchTab('tab-ai', 3)" class="p-1.5 text-xs bg-primary-container hover:brightness-105 transition-all text-on-primary-container rounded-md font-medium flex items-center gap-1">
<span class="material-symbols-outlined text-sm">build</span> Fix Critical
</button>
</div>
</div>
<div class="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-3 relative shadow-sm text-sm">
<p class="text-on-surface font-medium" id="ai-msg">How can I help secure your code?</p>
</div>
<div class="flex gap-2 mt-3">
<button onclick="alert('Generated report exported to /report directory')" class="flex-1 py-1.5 px-2 bg-transparent border border-outline-variant/30 hover:bg-surface-container-high transition-colors text-on-surface rounded-md font-medium text-[11px] flex items-center justify-center gap-1">
<span class="material-symbols-outlined text-[14px]">description</span> Report
</button>
<button onclick="switchTab('tab-findings', 1)" class="flex-1 py-1.5 px-2 bg-transparent border border-outline-variant/30 hover:bg-surface-container-high transition-colors text-on-surface rounded-md font-medium text-[11px] flex items-center justify-center gap-1">
<span class="material-symbols-outlined text-[14px]">policy</span> Audit
</button>
</div>
</div>
</header>

<!-- TAB 1: DASHBOARD -->
<div id="tab-dashboard" class="tab-content active">
<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
<!-- Total Findings -->
<div class="bg-surface-container-lowest rounded-lg p-6 shadow-[0_8px_32px_rgba(19,30,25,0.03)] flex flex-col justify-between">
<div class="flex justify-between items-start mb-6">
<span class="font-label text-xs uppercase tracking-wider text-outline font-bold">Total Findings</span>
<span class="material-symbols-outlined text-outline-variant">bug_report</span>
</div>
<div>
<div class="font-headline text-[3.5rem] font-bold text-on-surface leading-none mb-2" id="total-num">—</div>
<div class="h-8 w-full relative mt-4">
<svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
<path id="sparkline" d="M0,15 Q10,10 20,18 T40,12 T60,16 T80,5 T100,8" fill="none" stroke="#ba1a1a" stroke-linecap="round" stroke-width="2"></path>
</svg>
</div>
</div>
</div>
<!-- Critical Issues -->
<div class="bg-surface-container-lowest rounded-lg p-6 shadow-[0_8px_32px_rgba(19,30,25,0.03)] flex flex-col justify-between">
<div class="flex justify-between items-start mb-6">
<span class="font-label text-xs uppercase tracking-wider text-outline font-bold">Critical Issues</span>
<span class="material-symbols-outlined text-error" style="font-variation-settings:'FILL' 1;">warning</span>
</div>
<div>
<div class="font-headline text-[3.5rem] font-bold leading-none mb-2" id="crit-num">—</div>
<p class="text-sm text-outline flex items-center gap-1 mt-4" id="crit-sub"></p>
</div>
</div>
<!-- Security Score -->
<div class="bg-surface-container-lowest rounded-lg p-6 shadow-[0_8px_32px_rgba(19,30,25,0.03)] flex flex-col justify-between">
<div class="flex justify-between items-start mb-4">
<span class="font-label text-xs uppercase tracking-wider text-outline font-bold">Security Score</span>
<span class="material-symbols-outlined text-outline-variant">speed</span>
</div>
<div class="flex items-center gap-6">
<div class="relative w-24 h-24">
<div class="w-full h-full rounded-full border-[8px] border-surface-container"></div>
<div class="absolute inset-0">${Array.from({length:12},(_,i)=>`<div class="tick-mark" style="transform:rotate(${i*30}deg)"></div>`).join('')}</div>
<div class="absolute inset-0 flex items-center justify-center">
<div class="font-headline text-2xl font-bold leading-none" id="score-display">—<span class="text-xs text-outline font-medium">/100</span></div>
</div>
</div>
<div class="flex-1"><p class="text-xs text-outline leading-tight" id="score-desc">Loading...</p></div>
</div>
</div>
<!-- Grade -->
<div id="grade-card" class="bg-surface-container-lowest rounded-lg p-6 shadow-[0_8px_32px_rgba(19,30,25,0.03)] flex flex-col justify-between">
<div class="flex justify-between items-start mb-4">
<span class="font-label text-xs uppercase tracking-wider font-bold" id="grade-lbl">Grade</span>
<span class="material-symbols-outlined" id="grade-icon">assignment_late</span>
</div>
<div class="flex flex-col h-full justify-end">
<div class="font-headline text-[4rem] font-black leading-none mb-2" id="grade-val">—</div>
<p class="text-sm font-medium flex items-start gap-1" id="grade-msg"></p>
</div>
</div>
<!-- OWASP Top 10 Coverage -->
<div class="bg-surface-container-lowest rounded-lg p-6 shadow-[0_8px_32px_rgba(19,30,25,0.03)]">
<h3 class="font-headline text-sm font-semibold text-on-surface mb-6 uppercase tracking-wider">OWASP Top 10 Coverage</h3>
<div class="h-32 flex items-end justify-between gap-1" id="owasp-bars"></div>
<div class="flex justify-between mt-2">
<span class="text-[10px] text-outline">A01</span>
<span class="text-[10px] font-bold text-primary" id="owasp-peak">—</span>
<span class="text-[10px] text-outline">A10</span>
</div>
</div>
<!-- Severity Distribution -->
<div class="bg-surface-container-lowest rounded-lg p-6 shadow-[0_8px_32px_rgba(19,30,25,0.03)] flex flex-col">
<h3 class="font-headline text-sm font-semibold text-on-surface mb-6 uppercase tracking-wider">Severity Distribution</h3>
<div class="flex items-center justify-between gap-4">
<div class="relative w-24 h-24">
<div id="donut" class="w-full h-full rounded-full border-[10px] border-surface-container relative"></div>
<div class="absolute inset-0 flex items-center justify-center flex-col">
<span class="text-lg font-bold" id="donut-center">—</span>
</div>
</div>
<div class="flex-1 space-y-1">
<div class="flex items-center justify-between text-[11px] font-medium"><span class="flex items-center gap-1"><div class="w-1.5 h-1.5 rounded-full bg-error"></div> Crit</span><span id="sev-cr">—</span></div>
<div class="flex items-center justify-between text-[11px] font-medium"><span class="flex items-center gap-1"><div class="w-1.5 h-1.5 rounded-full bg-orange-500"></div> High</span><span id="sev-hi">—</span></div>
<div class="flex items-center justify-between text-[11px] font-medium"><span class="flex items-center gap-1"><div class="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Med</span><span id="sev-me">—</span></div>
<div class="flex items-center justify-between text-[11px] font-medium"><span class="flex items-center gap-1"><div class="w-1.5 h-1.5 rounded-full bg-primary"></div> Low</span><span id="sev-lo">—</span></div>
</div>
</div>
</div>
</section>

<!-- RECENT FINDINGS (Preview in Dashboard) -->
<section class="w-full mb-12">
<div class="bg-surface-container-lowest rounded-lg p-8 shadow-[0_8px_32px_rgba(19,30,25,0.03)]">
<div class="flex justify-between items-center mb-8">
<h3 class="font-headline text-xl font-semibold text-on-surface">Recent Findings</h3>
<button class="text-sm text-primary font-medium hover:text-primary-container transition-colors" onclick="switchTab('tab-findings', 1)">View All</button>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="border-b-2 border-surface-variant text-outline font-label text-xs uppercase tracking-wider">
<th class="pb-4 font-bold">Vulnerability</th>
<th class="pb-4 font-bold">Severity</th>
<th class="pb-4 font-bold">Status</th>
<th class="pb-4 font-bold text-right">Action</th>
</tr>
</thead>
<tbody id="dash-findings-tbody"></tbody>
</table>
</div>
</div>
</section>
</div>

<!-- TAB 2: FINDINGS FULL LIST -->
<div id="tab-findings" class="tab-content">
<section class="w-full mb-12">
<div class="bg-surface-container-lowest rounded-lg p-8 shadow-[0_8px_32px_rgba(19,30,25,0.03)]">
<div class="flex justify-between items-center mb-8">
<h3 class="font-headline text-xl font-semibold text-on-surface">All Security Findings</h3>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="border-b-2 border-surface-variant text-outline font-label text-xs uppercase tracking-wider">
<th class="pb-4 font-bold">Vulnerability</th>
<th class="pb-4 font-bold">Severity</th>
<th class="pb-4 font-bold">File Location</th>
<th class="pb-4 font-bold">Category</th>
</tr>
</thead>
<tbody id="all-findings-tbody"></tbody>
</table>
</div>
</div>
</section>
</div>

<!-- TAB 3: OWASP MAP DETAILED -->
<div id="tab-owasp" class="tab-content">
<section class="w-full mb-12">
<div class="bg-surface-container-lowest rounded-lg p-8 shadow-[0_8px_32px_rgba(19,30,25,0.03)]">
<h3 class="font-headline text-xl font-semibold text-on-surface mb-8">OWASP Top 10 Detailed Coverage</h3>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="owasp-full-list">
</div>
</div>
</section>
</div>

<!-- TAB 4: AI FIXES -->
<div id="tab-ai" class="tab-content">
<section class="w-full mb-12">
<div class="bg-surface-container-lowest rounded-lg p-8 shadow-[0_8px_32px_rgba(19,30,25,0.03)]">
<div class="flex justify-between items-center mb-8">
<h3 class="font-headline text-xl font-semibold text-on-surface">AI Auto-Remediation (Groq LLaMA 3.3)</h3>
</div>
<div class="space-y-6" id="ai-full-list">
</div>
</div>
</section>
</div>

</main>

<script>
let gData = null;

function switchTab(tabId, index) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  
  const btns = document.querySelectorAll('.tab-btn');
  btns.forEach(btn => {
    btn.className = 'tab-btn text-on-surface/60 hover:text-primary transition-all duration-200';
  });
  
  if (btns[index]) {
    btns[index].className = 'tab-btn active text-primary border-b-2 border-primary pb-1 font-semibold';
  }
}

async function init(){
  try{
    const res=await fetch('/api/report');
    gData=await res.json();
    render(gData);
  }catch(e){
    document.querySelector('main').innerHTML='<div style="text-align:center;padding:60px;color:#6c7a71;"><h2>No report found</h2><p>Run a scan first: npm run scan:demo</p></div>';
  }
}

function render(r){
  const sc=r.securityScore;
  const cr=r.summary.critical, hi=r.summary.high, me=r.summary.medium, lo=r.summary.low;
  const total=r.findings.length;
  const isBad=sc.score<50;

  // Header Target
  document.getElementById('scan-target').textContent = 'Target: ' + r.scannedPath;

  // Status Badge
  const badge = document.getElementById('status-badge');
  badge.textContent = r.passed ? '✔ PASS' : '✖ FAIL';
  badge.className = r.passed ? 'px-3 py-1 rounded-full text-xs font-bold bg-primary-container/20 text-primary-container' : 'px-3 py-1 rounded-full text-xs font-bold bg-error/20 text-error';

  // Total
  anim('total-num',total);
  document.getElementById('sparkline').setAttribute('stroke',total===0?'#10b981':'#ba1a1a');

  // Critical
  anim('crit-num',cr);
  const critEl=document.getElementById('crit-num');
  critEl.className=cr>0?'font-headline text-[3.5rem] font-bold text-error leading-none mb-2':'font-headline text-[3.5rem] font-bold text-primary-container leading-none mb-2';
  document.getElementById('crit-sub').innerHTML=cr>0?'<span class="material-symbols-outlined text-xs text-error">priority_high</span> Requires immediate attention':'<span class="material-symbols-outlined text-xs text-primary-container">check_circle</span> No critical issues';

  // Score
  const scoreEl=document.getElementById('score-display');
  const brightGreen = 'text-[#10b981]'; // Tailwind emerald-500
  scoreEl.className='font-headline text-2xl font-bold leading-none '+(sc.score >= 75 ? brightGreen : (sc.score >= 50 ? 'text-yellow-600' : 'text-error'));
  scoreEl.innerHTML=sc.score+'<span class="text-xs text-outline font-medium">/100</span>';
  document.getElementById('score-desc').textContent=sc.label;

  // Grade
  const gradeColor=sc.score >= 75 ? brightGreen : (sc.score >= 50 ? 'text-yellow-600' : 'text-error');
  document.getElementById('grade-val').textContent=sc.grade;
  document.getElementById('grade-val').className='font-headline text-[4rem] font-black leading-none mb-2 '+gradeColor;
  document.getElementById('grade-lbl').className='font-label text-xs uppercase tracking-wider font-bold '+gradeColor;
  document.getElementById('grade-icon').className='material-symbols-outlined '+gradeColor;
  document.getElementById('grade-icon').textContent=sc.score >= 75 ? 'verified_user' : 'assignment_late';
  const gradeMsg=sc.score>=90?'Excellent — No critical findings':sc.score>=75?'Good — Minor issues only':sc.score>=50?'Needs improvement':'Immediate action required';
  document.getElementById('grade-msg').innerHTML=(sc.score<75?'<span class="material-symbols-outlined text-sm mt-0.5">priority_high</span> ':'')+gradeMsg;
  document.getElementById('grade-msg').className='text-sm font-medium flex items-start gap-1 '+gradeColor;
  
  const gc=document.getElementById('grade-card');
  gc.className=isBad?'bg-surface-container-lowest rounded-lg p-6 shadow-[0_8px_32px_rgba(19,30,25,0.03)] bg-error/5 border border-error/20 flex flex-col justify-between':'bg-surface-container-lowest rounded-lg p-6 shadow-[0_8px_32px_rgba(19,30,25,0.03)] flex flex-col justify-between';

  // Severity Distribution
  document.getElementById('sev-cr').textContent=cr;
  document.getElementById('sev-hi').textContent=hi;
  document.getElementById('sev-me').textContent=me;
  document.getElementById('sev-lo').textContent=lo;
  document.getElementById('donut-center').textContent=total;
  renderDonut(cr,hi,me,lo);

  // OWASP bars
  renderOwaspBars(r.findings);
  renderOwaspDetailed(r.findings);

  // AI status
  const hasAi=r.findings.some(f=>f.aiSuggestion&&f.aiSuggestion.source==='groq');
  if(hasAi) document.getElementById('ai-status').innerHTML='<span class="w-1 h-1 rounded-full bg-primary-container"></span> Groq LLaMA 3.3';
  document.getElementById('ai-msg').textContent=r.passed?'Great job! Your code is looking secure.':'I found '+total+' vulnerabilities. Click Fix Critical to auto-remediate.';
  renderAiDetailed(r.findings);

  // Findings table
  renderFindings(r.findings);
}

function anim(id,target){
  const el=document.getElementById(id);
  if(target===0){el.textContent='0';return;}
  let n=0;const step=Math.max(1,Math.ceil(target/25));
  const t=setInterval(()=>{n=Math.min(n+step,target);el.textContent=n;if(n>=target)clearInterval(t);},30);
}

function renderDonut(cr,hi,me,lo){
  const el=document.getElementById('donut');
  const total=cr+hi+me+lo;
  if(!total){el.style.borderColor='#10b981';return;} // Hijau terang kalau clean
  const stops=[];let cur=0;
  if(cr){const p=(cr/total)*100;stops.push('#ba1a1a '+cur+'% '+(cur+p)+'%');cur+=p;}
  if(hi){const p=(hi/total)*100;stops.push('#f97316 '+cur+'% '+(cur+p)+'%');cur+=p;}
  if(me){const p=(me/total)*100;stops.push('#eab308 '+cur+'% '+(cur+p)+'%');cur+=p;}
  if(lo){const p=(lo/total)*100;stops.push('#006c49 '+cur+'% '+(cur+p)+'%');cur+=p;}
  el.style.background='conic-gradient('+stops.join(',')+')';
  el.style.borderColor='transparent';
}

function renderOwaspBars(findings){
  const ids=['A01:2021','A02:2021','A03:2021','A04:2021','A05:2021','A06:2021','A07:2021','A08:2021','A09:2021','A10:2021'];
  const counts={};let max=0;let peakId='';
  
  if (findings.length === 0) {
     document.getElementById('owasp-bars').innerHTML = '<div class="w-full text-center text-xs text-outline w-full py-10">No vulnerabilities found</div>';
     document.getElementById('owasp-peak').textContent='—';
     return;
  }

  findings.forEach(f=>{if(f.owaspCategory){const id=f.owaspCategory.id;counts[id]=(counts[id]||0)+1;if(counts[id]>max){max=counts[id];peakId=id;}}});
  const container=document.getElementById('owasp-bars');
  container.innerHTML=ids.map(id=>{
    const c=counts[id]||0;
    const pct=max?Math.max(5,(c/max)*100):5;
    const isMax=id===peakId&&c>0;
    return '<div class="w-full '+(isMax?'bg-primary':'bg-primary/20')+' rounded-t-sm" style="height:'+pct+'%"></div>';
  }).join('');
  document.getElementById('owasp-peak').textContent=peakId?peakId.replace(':2021',''):'—';
}

function renderOwaspDetailed(findings) {
  const mappings = findings.map(f => f.owaspCategory).filter(Boolean);
  const counts = new Map();
  for (const m of mappings) {
    const cur = counts.get(m.id) ?? { count: 0, name: m.name };
    cur.count++;
    counts.set(m.id, cur);
  }
  
  const container = document.getElementById('owasp-full-list');
  if (!counts.size) { 
    container.innerHTML = '<div class="col-span-3 text-sm text-outline">No mapped vulnerabilities found. Excellent!</div>'; 
    return; 
  }
  
  const max = Math.max(...[...counts.values()].map((v) => v.count));
  container.innerHTML = [...counts.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .map(([id, { count, name }]) => \`<div class="border border-outline-variant/30 p-4 rounded-md">
      <div class="flex justify-between items-center mb-2">
        <strong class="text-xs text-on-surface">\${esc(id)}</strong>
        <span class="text-[10px] bg-surface-container-high px-2 py-0.5 rounded text-on-surface">\${count} finding\${count > 1 ? "s" : ""}</span>
      </div>
      <div class="text-[11px] text-outline truncate mb-3" title="\${esc(name)}">\${esc(name)}</div>
      <div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
        <div class="bg-primary h-full rounded-full" style="width:\${(count / max * 100).toFixed(0)}%"></div>
      </div>
    </div>\`).join("");
}

function renderFindings(findings){
  const dash=document.getElementById('dash-findings-tbody');
  const all=document.getElementById('all-findings-tbody');
  
  if(!findings.length){
    const msg = '<tr><td colspan="4" class="py-8 text-center text-primary-container font-bold">🎉 Clean Scan — No vulnerabilities detected!</td></tr>';
    dash.innerHTML=msg;
    all.innerHTML=msg;
    return;
  }
  const sevClass={critical:'bg-error/10 text-error',high:'bg-orange-500/10 text-orange-600',medium:'bg-yellow-500/10 text-yellow-600',low:'bg-primary-container/10 text-primary-container'};
  
  // Dashboard preview (max 3)
  dash.innerHTML=findings.slice(0,3).map(f=>'<tr class="border-b border-surface-variant/50 hover:bg-surface-container-low/30 transition-colors">'
    +'<td class="py-5 font-medium text-on-surface">'+esc(f.title)+'</td>'
    +'<td class="py-5"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold '+(sevClass[f.severity]||'')+'">'+(f.severity.charAt(0).toUpperCase()+f.severity.slice(1))+'</span></td>'
    +'<td class="py-5"><span class="text-sm text-outline">Open</span></td>'
    +'<td class="py-5 text-right"><button onclick="switchTab(\\'tab-findings\\', 1)" class="text-primary hover:text-primary-container"><span class="material-symbols-outlined text-lg">chevron_right</span></button></td>'
    +'</tr>').join('');
    
  // All findings tab
  all.innerHTML=findings.map(f=>'<tr class="border-b border-surface-variant/50 hover:bg-surface-container-low/30 transition-colors">'
    +'<td class="py-5 font-medium text-on-surface">'+esc(f.title)+'<div class="text-xs text-outline mt-1 font-normal max-w-md">'+esc(f.description)+'</div></td>'
    +'<td class="py-5"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold '+(sevClass[f.severity]||'')+'">'+(f.severity.charAt(0).toUpperCase()+f.severity.slice(1))+'</span></td>'
    +'<td class="py-5"><span class="text-sm text-outline font-mono text-[11px]">'+esc(f.file)+':'+f.line+'</span></td>'
    +'<td class="py-5">'+(f.owaspCategory?'<span class="text-xs font-medium text-primary">'+esc(f.owaspCategory.id)+'</span>':'<span class="text-xs text-outline">Unmapped</span>')+'</td>'
    +'</tr>').join('');
}

function renderAiDetailed(findings) {
  const withAi = findings.filter((f) => f.aiSuggestion);
  const container = document.getElementById('ai-full-list');
  
  if (!withAi.length) { 
    container.innerHTML = '<div class="py-10 text-center text-outline">No AI suggestions generated for this scan. Run with <code>--with-ai</code> flag if there are vulnerabilities.</div>'; 
    return; 
  }
  
  const sevClass={critical:'bg-error/10 text-error',high:'bg-orange-500/10 text-orange-600',medium:'bg-yellow-500/10 text-yellow-600',low:'bg-primary-container/10 text-primary-container'};
  
  container.innerHTML = withAi.map((f, i) => {
    const ai = f.aiSuggestion;
    return \`
    <div class="border border-outline-variant/30 rounded-lg p-5 mb-4">
      <div class="flex justify-between items-start mb-4">
        <div>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold \${sevClass[f.severity]||''} uppercase tracking-wider mb-2">\${f.severity}</span>
          <h4 class="font-bold text-on-surface text-base">\${esc(f.title)}</h4>
          <p class="text-xs text-outline font-mono mt-1">\${esc(f.file)}:\${f.line}</p>
        </div>
        <div class="bg-primary-container/10 text-primary-container px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">auto_awesome</span> \${esc(ai.source)}
        </div>
      </div>
      <div class="text-sm text-on-surface-variant mb-4">\${esc(ai.explanation)}</div>
      <div class="relative">
        <button class="ai-copy-btn absolute top-2 right-2" onclick="copyCode('code-\${i}', this)">Copy</button>
        <pre id="code-\${i}" class="ai-code-block">\${esc(ai.fixedCode)}</pre>
      </div>
    </div>
    \`;
  }).join("");
}

window.copyCode = function(id, btn) {
  const pre = document.getElementById(id);
  navigator.clipboard.writeText(pre.textContent||'').then(()=>{
    btn.textContent='Copied!';setTimeout(()=>btn.textContent='Copy',1500);
  });
}

function esc(s){return s?String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'):'';}

init();
</script>
</body></html>`;
}
