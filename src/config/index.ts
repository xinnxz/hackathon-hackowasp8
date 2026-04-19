import { promises as fs } from "node:fs";
import path from "node:path";
import { listConfigDirectories } from "./discovery";
import { mergeGuardrailConfig, type GuardrailConfig } from "./merge";

export type { GuardrailConfig };
export { mergeGuardrailConfig };
export { configAnchorDirectory, findGitRoot, listConfigDirectories } from "./discovery";

export const defaultConfig: GuardrailConfig = {
  policy: {
    failOn: ["high", "critical"],
    scoreThreshold: 0,
  },
  rules: {
    secrets: true,
    injection: true,
    xss: true,
    cors: true,
    eval: true,
    ssrf: true,
    weakCrypto: true,
    pathTraversal: true,
    insecureHttp: true,
    authMiddleware: true,
    dependencies: true,
  },
  ignore: {
    paths: [],
    findings: [],
  },
  ai: {
    enabled: true,
    model: "llama-3.3-70b-versatile (Groq)",
  },
  report: {
    formats: ["json", "html", "sarif", "markdown"],
    outputDir: "./report",
  },
};

/**
 * Merges `.guardrailrc.json` from the Git repo root down to `targetPath` (stops at `.git`).
 * If `targetPath` is a **file**, config is merged only for directories from the repo root down to that file’s parent folder.
 * If no Git root exists, only the scan directory (or the file’s parent) is used for config lookup.
 * Deeper directories override scalars; `ignore.paths` / `ignore.findings` are unioned (deduped).
 */
export async function loadConfig(targetPath: string): Promise<GuardrailConfig> {
  const broadToNarrow = await listConfigDirectories(targetPath);
  let merged: GuardrailConfig = { ...defaultConfig };
  const loadedPaths: string[] = [];

  for (const dir of broadToNarrow) {
    const configPath = path.join(dir, ".guardrailrc.json");
    try {
      const raw = await fs.readFile(configPath, "utf8");
      const partial = JSON.parse(raw) as Partial<GuardrailConfig>;
      merged = mergeGuardrailConfig(merged, partial);
      loadedPaths.push(configPath);
    } catch {
      // unreadable or missing
    }
  }

  if (loadedPaths.length > 0) {
    console.log(`\x1b[36m[Config] Merged ${loadedPaths.length} file(s): ${loadedPaths.join(" → ")}\x1b[0m`);
  }

  return merged;
}
