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
    model: "llama-3.3-70b-versatile (Groq)",
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
    const partial = JSON.parse(raw) as Partial<GuardrailConfig>;
    const merged: GuardrailConfig = {
      policy: { ...defaultConfig.policy, ...partial.policy },
      rules: { ...defaultConfig.rules, ...partial.rules },
      ignore: { ...defaultConfig.ignore, ...partial.ignore },
      ai: { ...defaultConfig.ai, ...partial.ai },
      report: { ...defaultConfig.report, ...partial.report },
    };
    console.log(`\x1b[36m[Config] Loaded .guardrailrc.json from ${configPath}\x1b[0m`);
    return merged;
  } catch {
    return { ...defaultConfig };
  }
}
