import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import type { Finding, Severity } from "../types";

const execFileAsync = promisify(execFile);
const auditCommand = process.platform === "win32"
  ? { file: "cmd", args: ["/c", "npm", "audit", "--json"] }
  : { file: "npm", args: ["audit", "--json"] };

export async function scanDependencies(targetPath: string, runAudit = true): Promise<Finding[]> {
  if (!runAudit) {
    return [];
  }

  const packageJsonPath = path.join(targetPath, "package.json");
  try {
    await fs.access(packageJsonPath);
  } catch {
    return [];
  }

  try {
    const { stdout } = await execFileAsync(auditCommand.file, auditCommand.args, {
      cwd: targetPath,
      windowsHide: true,
      maxBuffer: 1024 * 1024 * 4,
    });
    return parseAuditFindings(stdout.toString(), targetPath);
  } catch (error) {
    const output = extractAuditOutput(error);
    if (!output) {
      return [{
        type: "dependency",
        title: "Dependency audit could not complete",
        severity: "medium",
        file: "package.json",
        line: 1,
        description: "npm audit did not return machine-readable output. Ensure dependencies are installed before scanning.",
        recommendation: "Run npm install in the target project and retry the scan.",
      }];
    }

    return parseAuditFindings(output, targetPath);
  }
}

function extractAuditOutput(error: unknown): string {
  if (typeof error === "object" && error !== null && "stdout" in error) {
    const stdout = (error as { stdout?: string | Buffer }).stdout;
    if (typeof stdout === "string") {
      return stdout;
    }
    if (Buffer.isBuffer(stdout)) {
      return stdout.toString("utf8");
    }
  }
  return "";
}

function parseAuditFindings(stdout: string, targetPath: string): Finding[] {
  let parsed: any;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    return [];
  }

  const vulnerabilities = parsed.vulnerabilities ?? {};
  return Object.entries<any>(vulnerabilities).map(([name, details]) => ({
    type: "dependency",
    title: `Dependency vulnerability: ${name}`,
    severity: normalizeSeverity(details.severity),
    file: path.relative(targetPath, path.join(targetPath, "package.json")) || "package.json",
    line: 1,
    description: `${details.via?.length ?? 0} advisory item(s) detected for ${name}. Range: ${details.range ?? "unknown"}.`,
    recommendation: details.fixAvailable
      ? `Upgrade ${name} to the patched version recommended by npm audit.`
      : `Review ${name} manually and replace it with a maintained alternative if no safe upgrade exists.`,
  }));
}

function normalizeSeverity(value: string | undefined): Severity {
  if (value === "moderate") {
    return "medium";
  }
  if (value === "critical" || value === "high" || value === "medium" || value === "low") {
    return value;
  }
  return "medium";
}
