import test from "node:test";
import assert from "node:assert/strict";
import { defaultConfig, mergeGuardrailConfig } from "../src/config";

test("mergeGuardrailConfig unions ignore paths", () => {
  const merged = mergeGuardrailConfig(defaultConfig, {
    ignore: { paths: ["a/**", "b/**"], findings: [] },
  });
  const merged2 = mergeGuardrailConfig(merged, {
    ignore: { paths: ["c/**"], findings: [] },
  });
  assert.ok(merged2.ignore.paths.includes("a/**"));
  assert.ok(merged2.ignore.paths.includes("c/**"));
});

test("mergeGuardrailConfig later rules override", () => {
  const merged = mergeGuardrailConfig(defaultConfig, { rules: { xss: false } });
  assert.equal(merged.rules.xss, false);
  assert.equal(merged.rules.secrets, true);
});
