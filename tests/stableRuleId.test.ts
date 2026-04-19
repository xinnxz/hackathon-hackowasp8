import test from "node:test";
import assert from "node:assert/strict";
import { stableRuleId } from "../src/util/stableRuleId";
import type { Finding } from "../src/types";

test("stableRuleId is deterministic for same type and title", () => {
  const a: Finding = {
    type: "secret",
    title: "Possible GitHub token committed",
    severity: "critical",
    file: "a.js",
    line: 1,
    description: "x",
    recommendation: "y",
  };
  const b: Finding = { ...a, file: "b.js", line: 99 };
  assert.equal(stableRuleId(a), stableRuleId(b));
});

test("stableRuleId differs for different titles", () => {
  const a: Finding = {
    type: "secret",
    title: "A",
    severity: "high",
    file: "f",
    line: 1,
    description: "",
    recommendation: "",
  };
  const b: Finding = { ...a, title: "B" };
  assert.notEqual(stableRuleId(a), stableRuleId(b));
});
