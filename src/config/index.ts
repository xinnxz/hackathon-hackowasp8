import { promises as fs } from "node:fs";
import path from "node:path";
import { mergeGuardrailConfig, type GuardrailConfig } from "./merge";

export type { GuardrailConfig };
export { mergeGuardrailConfig };

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
 * Walks from filesystem root down to `targetPath` and merges every `.guardrailrc.json`
 * found along the way. Deeper directories override scalars; `ignore.paths` / `ignore.findings`
 * are unioned (deduped) across levels.
 */
export async function loadConfig(targetPath: string): Promise<GuardrailConfig> {
  const absolute = path.resolve(targetPath);
  const chain: string[] = [];
  let cur = absolute;
  for (let i = 0; i < 40; i++) {
    chain.push(cur);
    const parent = path.dirname(cur);
    if (parent === cur) {
      break;
    }
    cur = parent;
  }

  const broadToNarrow = chain.slice().reverse();
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
