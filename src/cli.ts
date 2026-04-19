import { promises as fs } from "node:fs";
import path from "node:path";
import { generateFixSuggestions } from "./ai/suggestions";
import { loadConfig } from "./config";
import { applyFindingIgnores, evaluatePass, mergeFailOn } from "./policy";
import { buildHtmlReport } from "./reporter/html";
import { writeJsonReport } from "./reporter/json";
import { buildMarkdownReport } from "./reporter/markdown";
import { buildPrComment } from "./reporter/pr-comment";
import { buildSarif } from "./reporter/sarif";
import { scanProject } from "./scanner";
import { calculateSecurityScore, formatScoreBar } from "./scoring";
import type { GuardrailReport, Severity } from "./types";

async function main(): Promise<void> {
  const [, , command = "scan", scanTarget = ".", ...rest] = process.argv;

  if (command === "dashboard") {
    const { startDashboard } = await import("./dashboard/server.js");
    await startDashboard();
    return;
  }

  if (command !== "scan") {
    printUsage();
    process.exitCode = 1;
    return;
  }

  printBanner();

  const { explicit: failOnExplicit, values: cliFailOn } = parseFailOnFromArgs(rest);
  const withAi = rest.includes("--with-ai");
  const apiKey = parseApiKey(rest);
  const outputDirOverride = parseOutputDirFromArgs(rest);
  const absoluteTarget = path.resolve(scanTarget);

  logStep(1, withAi ? 5 : 4, "Loading config");
  const config = await loadConfig(absoluteTarget);
  if (outputDirOverride) {
    config.report.outputDir = outputDirOverride;
  }
  const mergedFailOn = mergeFailOn(failOnExplicit, cliFailOn, config.policy.failOn);

  logStep(2, withAi ? 5 : 4, "Scanning files and dependencies");
  let findings = await scanProject(absoluteTarget, config);
  findings = applyFindingIgnores(findings, config.ignore.findings);

  if (withAi) {
    logStep(3, 5, "Generating AI fix suggestions (Groq / LLaMA 3.3)");
    findings = await generateFixSuggestions(findings, apiKey);
  }

  logStep(withAi ? 4 : 3, withAi ? 5 : 4, "Calculating security score");
  const securityScore = calculateSecurityScore(findings);
  const summary = summarizeFindings(findings);

  const evaluation = evaluatePass(findings, mergedFailOn, securityScore.score, config.policy.scoreThreshold);

  const report: GuardrailReport = {
    scannedPath: absoluteTarget,
    generatedAt: new Date().toISOString(),
    policy: {
      failOn: mergedFailOn,
      scoreThreshold: config.policy.scoreThreshold,
      notes: evaluation.notes,
    },
    findings,
    summary,
    securityScore,
    passed: evaluation.passed,
  };

  const outputDir = path.resolve(config.report.outputDir);
  await fs.mkdir(outputDir, { recursive: true });

  const jsonPath = path.join(outputDir, "guardrail-report.json");
  const htmlPath = path.join(outputDir, "guardrail-report.html");
  const sarifPath = path.join(outputDir, "guardrail-report.sarif");
  const mdPath = path.join(outputDir, "guardrail-report.md");
  const prCommentPath = path.join(outputDir, "pr-comment.md");

  logStep(withAi ? 5 : 4, withAi ? 5 : 4, "Writing report artifacts");
  await Promise.all([
    writeJsonReport(jsonPath, report),
    fs.writeFile(htmlPath, buildHtmlReport(report)),
    fs.writeFile(sarifPath, JSON.stringify(buildSarif(report), null, 2)),
    fs.writeFile(mdPath, buildMarkdownReport(report)),
    fs.writeFile(prCommentPath, buildPrComment(report)),
  ]);

  printSummary(report, { jsonPath, htmlPath, sarifPath, mdPath });
  if (!report.passed) process.exitCode = 1;
}

function printUsage(): void {
  console.log("Usage:");
  console.log("  npm run guardrail -- scan <path> [--fail-on=medium,high,critical] [--with-ai] [--api-key=<key>] [--output-dir=<dir>]");
  console.log("  (fail-on: CLI overrides .guardrailrc.json when --fail-on= is present)");
  console.log("  (output-dir: CLI overrides report.outputDir for this run; path is resolved from cwd)");
  console.log("  npm run guardrail -- dashboard");
}

function parseFailOnFromArgs(args: string[]): { explicit: boolean; values?: Severity[] } {
  const flag = args.find((a) => a.startsWith("--fail-on="));
  if (!flag) {
    return { explicit: false };
  }
  const body = flag.slice("--fail-on=".length);
  if (!body.trim()) {
    return { explicit: false };
  }
  const allowed: Severity[] = ["low", "medium", "high", "critical"];
  const values = body
    .split(",")
    .map((v) => v.trim().toLowerCase() as Severity)
    .filter((v): v is Severity => allowed.includes(v));
  if (values.length === 0) {
    return { explicit: false };
  }
  return { explicit: true, values };
}

function parseApiKey(args: string[]): string | undefined {
  const flag = args.find((a) => a.startsWith("--api-key="));
  return flag ? flag.replace("--api-key=", "").trim() : undefined;
}

function parseOutputDirFromArgs(args: string[]): string | undefined {
  const flag = args.find((a) => a.startsWith("--output-dir="));
  const raw = flag?.slice("--output-dir=".length).trim();
  return raw ? raw : undefined;
}

function summarizeFindings(findings: GuardrailReport["findings"]): Record<Severity, number> {
  return findings.reduce<Record<Severity, number>>(
    (acc, f) => { acc[f.severity] += 1; return acc; },
    { low: 0, medium: 0, high: 0, critical: 0 },
  );
}

function printBanner(): void {
  console.log("\x1b[36m╔════════════════════════════════════════════════════════╗");
  console.log("║          ⛨  OWASP GUARDRAIL v2.0                     ║");
  console.log("║  Enterprise DevSecOps Scanner with AI + Scoring       ║");
  console.log("╚════════════════════════════════════════════════════════╝\x1b[0m");
}

function printSummary(
  report: GuardrailReport,
  paths: { jsonPath: string; htmlPath: string; sarifPath: string; mdPath: string },
): void {
  const sc = report.securityScore;
  const gradeColor = sc.score >= 75 ? "\x1b[32m" : sc.score >= 50 ? "\x1b[33m" : "\x1b[31m";

  console.log("\n\x1b[1mSecurity Score\x1b[0m");
  console.log(`  ${gradeColor}${sc.grade}  ${formatScoreBar(sc.score)}  ${sc.score}/100\x1b[0m`);
  console.log(`  ${sc.label}\n`);

  console.log("\x1b[1mSeverity Breakdown\x1b[0m");
  console.log("┌──────────┬───────┐");
  console.log(`│ CRITICAL │ ${pad(report.summary.critical)} │`);
  console.log(`│ HIGH     │ ${pad(report.summary.high)} │`);
  console.log(`│ MEDIUM   │ ${pad(report.summary.medium)} │`);
  console.log(`│ LOW      │ ${pad(report.summary.low)} │`);
  console.log("└──────────┴───────┘");

  console.log(`\nTarget:  ${report.scannedPath}`);
  console.log(`Policy:  fail-on [${report.policy.failOn.join(", ")}]`);
  if (report.policy.scoreThreshold > 0) {
    console.log(`         score threshold: ${report.policy.scoreThreshold} (FAIL if score below)`);
  }
  if (report.policy.notes?.length) {
    console.log(`Notes:   ${report.policy.notes.join(" | ")}`);
  }
  console.log(`Reports: ${paths.htmlPath}`);
  console.log(`         ${paths.jsonPath}`);
  console.log(`         ${paths.sarifPath}`);
  console.log(`         ${paths.mdPath}`);

  if (report.passed) {
    console.log("\n\x1b[32m✔  Result: PASS\x1b[0m");
  } else {
    console.log("\n\x1b[31m✖  Result: FAIL  (policy violation)\x1b[0m");
  }
}

function logStep(index: number, total: number, label: string): void {
  console.log(`\x1b[35m[${index}/${total}] ${label}...\x1b[0m`);
}

function pad(value: number): string {
  return `  ${String(value).padStart(2, " ")}   `;
}

void main();
