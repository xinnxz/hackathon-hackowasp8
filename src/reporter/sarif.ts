import type { GuardrailReport, Severity } from "../types";
import { stableRuleId } from "../util/stableRuleId";

type SarifRule = {
  id: string;
  name: string;
  shortDescription: { text: string };
  fullDescription: { text: string };
  help: { text: string };
  properties: { tags: string[] };
};

export function buildSarif(report: GuardrailReport): object {
  const ruleMap = new Map<string, SarifRule>();

  for (const finding of report.findings) {
    const id = stableRuleId(finding);
    if (ruleMap.has(id)) {
      continue;
    }
    ruleMap.set(id, {
      id,
      name: finding.title,
      shortDescription: { text: finding.title },
      fullDescription: { text: finding.description },
      help: { text: finding.recommendation },
      properties: {
        tags: ["owasp", finding.type, finding.severity, finding.owaspCategory?.id ?? "unmapped"],
      },
    });
  }

  const rules = [...ruleMap.values()];

  return {
    version: "2.1.0",
    $schema: "https://json.schemastore.org/sarif-2.1.0.json",
    runs: [
      {
        tool: {
          driver: {
            name: "OWASP Guardrail",
            rules,
          },
        },
        results: report.findings.map((finding) => ({
          ruleId: stableRuleId(finding),
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
