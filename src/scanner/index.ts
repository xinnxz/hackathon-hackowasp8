import { promises as fs } from "node:fs";
import path from "node:path";
import { mapFindingToOwasp } from "../owasp/mapping";
import { scanDependencies } from "./deps";
import { scanRuleLine } from "./rules";
import { scanSecretLine } from "./secrets";
import type { Finding } from "../types";
import { severityRank } from "../types";

const supportedExtensions = new Set([".js", ".ts", ".tsx", ".jsx", ".json", ".env", ".yml", ".yaml"]);
const skipDirectories = new Set(["node_modules", ".git", "dist", "coverage", "report"]);

export async function scanProject(targetPath: string): Promise<Finding[]> {
  const fileFindings = await scanFiles(targetPath);
  const dependencyFindings = await scanDependencies(targetPath);

  return [...fileFindings, ...dependencyFindings]
    .map((finding) => ({ ...finding, owaspCategory: mapFindingToOwasp(finding) }))
    .sort((left, right) => severityRank[right.severity] - severityRank[left.severity]);
}

async function scanFiles(targetPath: string): Promise<Finding[]> {
  const filePaths = await listFiles(targetPath);
  const findings: Finding[] = [];

  for (const filePath of filePaths) {
    const relativePath = path.relative(targetPath, filePath) || path.basename(filePath);
    const content = await fs.readFile(filePath, "utf8");
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      findings.push(...scanSecretLine(relativePath, index + 1, line));
      findings.push(...scanRuleLine(relativePath, index + 1, line));
    });
  }

  return findings;
}

async function listFiles(targetPath: string): Promise<string[]> {
  const entries = await fs.readdir(targetPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (skipDirectories.has(entry.name)) {
      continue;
    }

    const entryPath = path.join(targetPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(entryPath));
      continue;
    }

    if (supportedExtensions.has(path.extname(entry.name)) || entry.name === ".env") {
      files.push(entryPath);
    }
  }

  return files;
}
