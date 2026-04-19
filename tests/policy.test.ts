import test from "node:test";
import assert from "node:assert/strict";
import { applyFindingIgnores, evaluatePass, mergeFailOn } from "../src/policy";
import type { Finding } from "../src/types";
import { pathMatchesIgnore } from "../src/util/pathMatch";

test("mergeFailOn uses config when CLI not explicit", () => {
  const merged = mergeFailOn(false, undefined, ["medium"]);
  assert.deepEqual(merged, ["medium"]);
});

test("mergeFailOn prefers CLI when explicit", () => {
  const merged = mergeFailOn(true, ["critical"], ["high", "medium"]);
  assert.deepEqual(merged, ["critical"]);
});

test("evaluatePass fails on severity in failOn", () => {
  const findings: Finding[] = [{
    type: "secret",
    title: "t",
    severity: "high",
    file: "a.js",
    line: 1,
    description: "d",
    recommendation: "r",
  }];
  const { passed, notes } = evaluatePass(findings, ["high", "critical"], 95, 0);
  assert.equal(passed, false);
  assert.ok(notes.some((n) => n.includes("severity")));
});

test("evaluatePass fails when score below threshold", () => {
  const { passed } = evaluatePass([], ["high", "critical"], 40, 50);
  assert.equal(passed, false);
});

test("applyFindingIgnores filters by type", () => {
  const findings: Finding[] = [
    { type: "dependency", title: "Dependency vulnerability: x", severity: "high", file: "p.json", line: 1, description: "", recommendation: "" },
    { type: "secret", title: "token", severity: "critical", file: "a.js", line: 2, description: "", recommendation: "" },
  ];
  const out = applyFindingIgnores(findings, ["type:dependency"]);
  assert.equal(out.length, 1);
  assert.equal(out[0]?.type, "secret");
});

test("pathMatchesIgnore supports globstar", () => {
  assert.equal(pathMatchesIgnore("demo/vulnerable-app/src/app.js", "demo/**"), true);
  assert.equal(pathMatchesIgnore("src/cli.ts", "demo/**"), false);
});
