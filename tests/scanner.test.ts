import test from "node:test";
import assert from "node:assert/strict";
import { scanSecretLine } from "../src/scanner/secrets";
import { scanRuleLine } from "../src/scanner/rules";

test("detects GitHub token secrets", () => {
  const findings = scanSecretLine("src/app.js", 10, "const token = 'ghp_1234567890abcdefghijklmnopqrstuv';");
  assert.ok(findings.some((finding) => finding.title.includes("GitHub token")));
});

test("detects SQL injection pattern", () => {
  const findings = scanRuleLine("src/app.js", 15, "const query = 'SELECT * FROM users WHERE id = ' + userId;");
  assert.ok(findings.some((finding) => finding.type === "injection"));
});

test("detects insecure http hardcoded URL", () => {
  const findings = scanRuleLine("src/client.js", 5, "const endpoint = 'http://internal-api.local';");
  assert.ok(findings.some((finding) => finding.title.includes("Insecure HTTP")));
});
