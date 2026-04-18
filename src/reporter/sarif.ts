import type { GuardrailReport, Severity } from "../types";

export function buildSarif(report: GuardrailReport): object {
  return {
    version: "2.1.0",
    $schema: "https://json.schemastore.org/sarif-2.1.0.json",
    runs: [
      {
        tool: {
          driver: {
            name: "OWASP Guardrail",
            rules: report.findings.map((finding, index) => ({
              id: `${finding.type}-${index + 1}`,
              name: finding.title,
              shortDescription: { text: finding.title },
              fullDescription: { text: finding.description },
              help: { text: finding.recommendation },
              properties: {
                tags: ["owasp", finding.type, finding.severity, finding.owaspCategory?.id ?? "unmapped"],
              },
            })),
          },
        },
        results: report.findings.map((finding, index) => ({
          ruleId: `${finding.type}-${index + 1}`,
          level: sarifLevel(finding.severity),
          message: { text: `${finding.title}: ${finding.description}` },
          locations: [
            {
              physicalLocation: {
                artifactLocation: { uri: finding.file },
                region: { startLine: finding.line },
              },
            },
          ],
        })),
      },
    ],
  };
}

function sarifLevel(severity: Severity): "note" | "warning" | "error" {
  if (severity === "critical" || severity === "high") {
    return "error";
  }
  if (severity === "medium") {
    return "warning";
  }
  return "note";
}
