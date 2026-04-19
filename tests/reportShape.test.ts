import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { writeJsonReport } from "../src/reporter/json";
import type { GuardrailReport } from "../src/types";

const minimalReport = (): GuardrailReport => ({
  scannedPath: "/tmp/x",
  generatedAt: "2026-01-01T00:00:00.000Z",
  policy: {
    failOn: ["high", "critical"],
    scoreThreshold: 0,
    notes: [],
  },
  findings: [],
  summary: { low: 0, medium: 0, high: 0, critical: 0 },
  securityScore: {
    score: 100,
    grade: "A+",
    label: "ok",
    color: "#fff",
    bg: "#000",
    breakdown: { low: 0, medium: 0, high: 0, critical: 0 },
  },
  passed: true,
});

test("JSON report roundtrip preserves stable top-level keys", async () => {
  const dir = mkdtempSync(path.join(tmpdir(), "gr-json-"));
  const out = path.join(dir, "out.json");
  try {
    const report = minimalReport();
    await writeJsonReport(out, report);
    const raw = readFileSync(out, "utf8");
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const keys = Object.keys(parsed).sort();
    assert.deepEqual(keys, [
      "findings",
      "generatedAt",
      "passed",
      "policy",
      "scannedPath",
      "securityScore",
      "summary",
    ]);
    assert.equal(typeof parsed["findings"], "object");
    assert.equal(typeof parsed["securityScore"], "object");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
