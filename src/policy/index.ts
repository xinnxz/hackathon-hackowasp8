import type { Finding, Severity } from "../types";

const SEVERITIES: Severity[] = ["low", "medium", "high", "critical"];

export function coerceSeverities(values: string[]): Severity[] {
  return values
    .map((v) => v.trim().toLowerCase())
    .filter((v): v is Severity => SEVERITIES.includes(v as Severity));
}

/**
 * CLI `--fail-on=` overrides config when present.
 */
export function mergeFailOn(cliExplicit: boolean, cliFailOn: Severity[] | undefined, configFailOn: string[]): Severity[] {
  if (cliExplicit && cliFailOn !== undefined) {
    return cliFailOn;
  }
  const fromConfig = coerceSeverities(configFailOn);
  return fromConfig.length > 0 ? fromConfig : ["high", "critical"];
}

/**
 * Remove findings matched by ignore.findings patterns.
 * Supported:
 * - `type:<findingType>` (e.g. `type:dependency`)
 * - `title:<substring>` (case-sensitive substring match on title)
 * - exact title match (no `:` prefix)
 */
export function applyFindingIgnores(findings: Finding[], patterns: string[]): Finding[] {
  if (!patterns?.length) {
    return findings;
  }

  return findings.filter((finding) => !shouldIgnoreFinding(finding, patterns));
}

function shouldIgnoreFinding(finding: Finding, patterns: string[]): boolean {
  return patterns.some((raw) => {
    const p = raw.trim();
    if (!p) {
      return false;
    }
    if (p.startsWith("type:")) {
      return finding.type === p.slice(5).trim();
    }
    if (p.startsWith("title:")) {
      return finding.title.includes(p.slice(6));
    }
    return finding.title === p;
  });
}

export type PassEvaluation = {
  passed: boolean;
  notes: string[];
};

/**
 * FAIL if any finding severity is in failOn, OR score is below threshold when threshold > 0.
 */
export function evaluatePass(
  findings: Finding[],
  failOn: Severity[],
  score: number,
  scoreThreshold: number,
): PassEvaluation {
  const notes: string[] = [];
  const severityHit = findings.some((f) => failOn.includes(f.severity));
  if (severityHit) {
    notes.push(`Blocked by severity policy (fail-on: ${failOn.join(", ")})`);
  }

  const scoreHit = scoreThreshold > 0 && score < scoreThreshold;
  if (scoreHit) {
    notes.push(`Blocked by score threshold (${score} < ${scoreThreshold})`);
  }

  return {
    passed: !severityHit && !scoreHit,
    notes,
  };
}
