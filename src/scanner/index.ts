import { promises as fs } from "node:fs";
import path from "node:path";
import type { GuardrailConfig } from "../config";
import { mapFindingToOwasp } from "../owasp/mapping";
import { normalizeScanPath, pathMatchesIgnore } from "../util/pathMatch";
import { scanDependencies } from "./deps";
import { scanRuleLine } from "./rules";
import { scanSecretLine } from "./secrets";
import type { Finding } from "../types";
import { severityRank } from "../types";

const supportedExtensions = new Set([".js", ".ts", ".tsx", ".jsx", ".json", ".env", ".yml", ".yaml"]);
const skipDirectories = new Set(["node_modules", ".git", "dist", "coverage"]);

export async function scanProject(targetPath: string, config: GuardrailConfig): Promise<Finding[]> {
  const fileFindings = await scanFiles(targetPath, config);
  const dependencyFindings = await scanDependencies(targetPath, config.rules.dependencies);

  return [...fileFindings, ...dependencyFindings]
    .map((finding) => ({ ...finding, owaspCategory: mapFindingToOwasp(finding) }))
    .sort((left, right) => severityRank[right.severity] - severityRank[left.severity]);
}

async function scanFiles(targetPath: string, config: GuardrailConfig): Promise<Finding[]> {
  const filePaths = await listFiles(targetPath, targetPath, config);
  const findings: Finding[] = [];

  for (const filePath of filePaths) {
    const relativePath = path.relative(targetPath, filePath) || path.basename(filePath);
    const content = await fs.readFile(filePath, "utf8");
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      findings.push(...scanSecretLine(relativePath, index + 1, line, config.rules));
      findings.push(...scanRuleLine(relativePath, index + 1, line, config.rules));
    });
  }

  return findings;
}

async function listFiles(currentDir: string, scanRoot: string, config: GuardrailConfig): Promise<string[]> {
  const ignorePatterns = config.ignore?.paths ?? [];
  const entries = await fs.readdir(currentDir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (skipDirectories.has(entry.name)) {
      continue;
    }

    const entryPath = path.join(currentDir, entry.name);
    const relativePath = normalizeScanPath(path.relative(scanRoot, entryPath));

    if (ignorePatterns.some((p) => pathMatchesIgnore(relativePath, p))) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...await listFiles(entryPath, scanRoot, config));
      continue;
    }

    if (supportedExtensions.has(path.extname(entry.name)) || entry.name === ".env") {
      files.push(entryPath);
    }
  }

  return files;
}
