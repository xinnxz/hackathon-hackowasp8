import { createHash } from "node:crypto";
import type { Finding } from "../types";

/**
 * Stable id for the same logical rule (type + title) across runs and result order.
 * Safe for SARIF ruleId (alphanumeric + hyphen).
 */
export function stableRuleId(finding: Finding): string {
  const key = `${finding.type}\0${finding.title}`;
  const h = createHash("sha256").update(key, "utf8").digest("hex").slice(0, 12);
  const typeSlug = finding.type.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "rule";
  return `GR-${typeSlug}-${h}`;
}
