import { promises as fs } from "node:fs";
import path from "node:path";
import { generateFixSuggestions } from "./ai/suggestions";
import { buildHtmlReport } from "./reporter/html";
import { writeJsonReport } from "./reporter/json";
import { buildSarif } from "./reporter/sarif";
import { scanProject } from "./scanner";
import { defaultFailOn, type GuardrailReport, type Severity } from "./types";

async function main(): Promise<void> {
  const [, , command = "scan", scanTarget = ".", ...rest] = process.argv;
  if (command !== "scan") {
    printUsage();
    process.exitCode = 1;
    return;
  }

  printBanner();
  const failOn = parseFailOn(rest);
  const withAi = rest.includes("--with-ai");
  const absoluteTarget = path.resolve(scanTarget);
  logStep(1, 4, "Scanning files and dependencies");
  let findings = await scanProject(absoluteTarget);
  if (withAi) {
    logStep(2, 4, "Generating AI fix suggestions");
    findings = await generateFixSuggestions(findings);
  }
  logStep(3, 4, "Summarizing results");
  const summary = summarizeFindings(findings);
  const report: GuardrailReport = {
    scannedPath: absoluteTarget,
    generatedAt: new Date().toISOString(),
    policy: { failOn },
    findings,
    summary,
    passed: !findings.some((finding) => failOn.includes(finding.severity)),
  };

  await fs.mkdir(path.resolve("report"), { recursive: true });
  const jsonPath = path.resolve("report", "guardrail-report.json");
  const htmlPath = path.resolve("report", "guardrail-report.html");
  const sarifPath = path.resolve("report", "guardrail-report.sarif");
  logStep(4, 4, "Writing report artifacts");
  await Promise.all([
    writeJsonReport(jsonPath, report),
    fs.writeFile(htmlPath, buildHtmlReport(report)),
    fs.writeFile(sarifPath, JSON.stringify(buildSarif(report), null, 2)),
  ]);

  printSummary(report, jsonPath, htmlPath, sarifPath);
  if (!report.passed) {
    process.exitCode = 1;
  }
}

function printUsage(): void {
  console.log("Usage: npm run guardrail -- scan <path> [--fail-on=medium,high,critical] [--with-ai]");
}

function parseFailOn(args: string[]): Severity[] {
  const flag = args.find((arg) => arg.startsWith("--fail-on="));
  if (!flag) {
    return defaultFailOn;
  }

  const values = flag.replace("--fail-on=", "").split(",").map((value) => value.trim().toLowerCase()) as Severity[];
  const allowed: Severity[] = ["low", "medium", "high", "critical"];
  return values.filter((value): value is Severity => allowed.includes(value));
}

function summarizeFindings(findings: GuardrailReport["findings"]): Record<Severity, number> {
  return findings.reduce<Record<Severity, number>>((accumulator, finding) => {
    accumulator[finding.severity] += 1;
    return accumulator;
  }, { low: 0, medium: 0, high: 0, critical: 0 });
}

function printBanner(): void {
  console.log("\x1b[36m╔════════════════════════════════════════════════════╗");
  console.log("║         OWASP GUARDRAIL v1.1                      ║");
  console.log("║  DevSecOps Scanner with OWASP + AI Suggestions    ║");
  console.log("╚════════════════════════════════════════════════════╝\x1b[0m");
}

function printSummary(report: GuardrailReport, jsonPath: string, htmlPath: string, sarifPath: string): void {
  console.log("\nSeverity summary");
  console.log("┌──────────┬───────┐");
  console.log(`│ CRITICAL │ ${pad(report.summary.critical)} │`);
  console.log(`│ HIGH     │ ${pad(report.summary.high)} │`);
  console.log(`│ MEDIUM   │ ${pad(report.summary.medium)} │`);
  console.log(`│ LOW      │ ${pad(report.summary.low)} │`);
  console.log("└──────────┴───────┘");
  console.log(`Target: ${report.scannedPath}`);
  console.log(`Policy fail-on: ${report.policy.failOn.join(", ")}`);
  console.log(`JSON report: ${jsonPath}`);
  console.log(`HTML report: ${htmlPath}`);
  console.log(`SARIF report: ${sarifPath}`);
  if (report.passed) {
    console.log("\x1b[32mResult: PASS\x1b[0m");
  } else {
    console.log("\x1b[31mResult: FAIL\x1b[0m");
  }
}

function logStep(index: number, total: number, label: string): void {
  console.log(`\x1b[35m[${index}/${total}] ${label}\x1b[0m`);
}

function pad(value: number): string {
  return `  ${String(value).padStart(2, " ")}   `;
}

void main();
