import { promises as fs } from "node:fs";
import path from "node:path";

export interface GuardrailConfig {
  policy: {
    failOn: string[];
    scoreThreshold: number;
  };
  rules: {
    secrets: boolean;
    injection: boolean;
    xss: boolean;
    cors: boolean;
    eval: boolean;
    ssrf: boolean;
    weakCrypto: boolean;
    pathTraversal: boolean;
    insecureHttp: boolean;
    authMiddleware: boolean;
  };
  ignore: {
    paths: string[];
    findings: string[];
  };
  ai: {
    enabled: boolean;
    model: string;
  };
  report: {
    formats: string[];
    outputDir: string;
  };
}

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
  },
  ignore: {
    paths: [],
    findings: [],
  },
  ai: {
    enabled: true,
    model: "gemini-2.0-flash",
  },
  report: {
    formats: ["json", "html", "sarif", "markdown"],
    outputDir: "./report",
  },
};

export async function loadConfig(targetPath: string): Promise<GuardrailConfig> {
  const configPath = path.join(targetPath, ".guardrailrc.json");
  try {
    const raw = await fs.readFile(configPath, "utf8");
    const parsed = JSON.parse(raw) as Partial<GuardrailConfig>;
    const merged = deepMerge(defaultConfig, parsed);
    console.log(`\x1b[36m[Config] Loaded .guardrailrc.json from ${configPath}\x1b[0m`);
    return merged;
  } catch {
    // No config file found — use defaults silently
    return { ...defaultConfig };
  }
}

function deepMerge<T extends Record<string, unknown>>(base: T, override: Partial<T>): T {
  const result = { ...base };
  for (const key of Object.keys(override) as Array<keyof T>) {
    const baseVal = base[key];
    const overVal = override[key];
    if (
      overVal !== undefined &&
      typeof baseVal === "object" &&
      baseVal !== null &&
      !Array.isArray(baseVal) &&
      typeof overVal === "object" &&
      overVal !== null &&
      !Array.isArray(overVal)
    ) {
      result[key] = deepMerge(baseVal as Record<string, unknown>, overVal as Record<string, unknown>) as T[keyof T];
    } else if (overVal !== undefined) {
      result[key] = overVal as T[keyof T];
    }
  }
  return result;
}
