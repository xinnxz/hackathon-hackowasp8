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
    dependencies: boolean;
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

export function mergeGuardrailConfig(base: GuardrailConfig, partial: Partial<GuardrailConfig>): GuardrailConfig {
  return {
    policy: {
      failOn: partial.policy?.failOn ?? base.policy.failOn,
      scoreThreshold:
        partial.policy?.scoreThreshold !== undefined
          ? Number(partial.policy.scoreThreshold)
          : base.policy.scoreThreshold,
    },
    rules: { ...base.rules, ...partial.rules },
    ignore: {
      paths: [...new Set([...base.ignore.paths, ...(partial.ignore?.paths ?? [])])],
      findings: [...new Set([...base.ignore.findings, ...(partial.ignore?.findings ?? [])])],
    },
    ai: { ...base.ai, ...partial.ai },
    report: { ...base.report, ...partial.report },
  };
}
