import type { GuardrailReport } from "../types";

export function buildPrComment(report: GuardrailReport): string {
  const sc = report.securityScore;
  const statusEmoji = report.passed ? "✅" : "❌";
  const gradeEmoji = sc.score >= 90 ? "🟢" : sc.score >= 75 ? "🟡" : sc.score >= 50 ? "🟠" : "🔴";

  const lines: string[] = [
    `## ${statusEmoji} OWASP Guardrail Security Scan`,
    "",
    `| | |`,
    `|---|---|`,
    `| **Status** | ${report.passed ? "✅ PASS" : "❌ FAIL"} |`,
    `| **Security Score** | ${gradeEmoji} **${sc.grade}** — ${sc.score}/100 |`,
    `| **Risk Level** | ${sc.label} |`,
    `| **Total Findings** | ${report.findings.length} |`,
    "",
    "### Severity Breakdown",
    "",
    "| 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low |",
    "|---|---|---|---|",
    `| ${report.summary.critical} | ${report.summary.high} | ${report.summary.medium} | ${report.summary.low} |`,
    "",
  ];

  // Top findings (up to 5)
  const topFindings = report.findings
    .filter((f) => f.severity === "critical" || f.severity === "high")
    .slice(0, 5);

  if (topFindings.length > 0) {
    lines.push("### Top Findings", "");
    const severityIcon: Record<string, string> = { critical: "🔴", high: "🟠", medium: "🟡", low: "🟢" };
    for (const f of topFindings) {
      const icon = severityIcon[f.severity] ?? "⚪";
      lines.push(`- ${icon} **${f.title}** — \`${f.file}:${f.line}\``);
      if (f.owaspCategory) {
        lines.push(`  - OWASP: ${f.owaspCategory.id} ${f.owaspCategory.name}`);
      }
    }
    if (report.findings.length > 5) {
      lines.push(`- _...and ${report.findings.length - 5} more findings_`);
    }
    lines.push("");
  }

  // OWASP categories hit
  const owaspIds = [...new Set(report.findings.map((f) => f.owaspCategory?.id).filter(Boolean))];
  if (owaspIds.length > 0) {
    lines.push(`**OWASP Categories Affected:** ${owaspIds.join(", ")}`, "");
  }

  if (!report.passed) {
    lines.push(
      "> ⚠️ **This PR fails the security policy.** Please fix critical/high findings before merging.",
      "",
    );
  } else {
    lines.push("> ✅ All findings are within the acceptable policy threshold. Safe to merge.", "");
  }

  lines.push("---");
  lines.push("_🛡️ Powered by [OWASP Guardrail v2.0](https://github.com/xinnxz/hackowasp8) — AI-Enhanced DevSecOps Scanner_");
  return lines.join("\n");
}
