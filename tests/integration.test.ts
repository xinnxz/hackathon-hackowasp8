import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { loadConfig } from "../src/config";
import { scanProject } from "../src/scanner";

function posix(p: string): string {
  return p.split(path.sep).join("/");
}

test("integration: loadConfig + scanProject respects ignore.paths (isolated git repo)", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "gr-int-"));
  mkdirSync(path.join(root, ".git"));
  mkdirSync(path.join(root, "src"), { recursive: true });
  mkdirSync(path.join(root, "ignored", "nested"), { recursive: true });

  writeFileSync(
    path.join(root, ".guardrailrc.json"),
    JSON.stringify({
      policy: { failOn: ["high", "critical"], scoreThreshold: 0 },
      rules: {
        secrets: true,
        injection: true,
        xss: false,
        cors: false,
        eval: false,
        ssrf: false,
        weakCrypto: false,
        pathTraversal: false,
        insecureHttp: false,
        authMiddleware: false,
        dependencies: false,
      },
      ignore: { paths: ["ignored/**"], findings: [] },
      report: { formats: ["json"], outputDir: "./report" },
      ai: { enabled: false, model: "" },
    }),
  );

  writeFileSync(
    path.join(root, "src", "app.js"),
    "const q = 'SELECT * FROM u WHERE id = ' + id;\n",
  );
  writeFileSync(
    path.join(root, "ignored", "nested", "leak.js"),
    "const x = 'ghp_1234567890abcdefghijklmnopqrstuv';\n",
  );

  const config = await loadConfig(root);
  const findings = await scanProject(root, config);

  const files = findings.map((f) => posix(f.file));
  assert.ok(files.some((f) => f.includes("src/app")), "expected finding under src/");
  assert.ok(files.every((f) => !f.includes("ignored/")), "ignored/** must not be scanned");
  assert.ok(findings.some((f) => f.type === "injection"), "expected injection finding");
});

test("integration: scanProject on a single file path (not directory)", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "gr-onefile-"));
  mkdirSync(path.join(root, ".git"));
  mkdirSync(path.join(root, "src"), { recursive: true });
  writeFileSync(
    path.join(root, ".guardrailrc.json"),
    JSON.stringify({
      policy: { failOn: [], scoreThreshold: 0 },
      rules: {
        secrets: false,
        injection: true,
        xss: false,
        cors: false,
        eval: false,
        ssrf: false,
        weakCrypto: false,
        pathTraversal: false,
        insecureHttp: false,
        authMiddleware: false,
        dependencies: false,
      },
      ignore: { paths: [], findings: [] },
      report: { formats: ["json"], outputDir: "./report" },
      ai: { enabled: false, model: "" },
    }),
  );
  const jsPath = path.join(root, "src", "one.js");
  writeFileSync(jsPath, "const q = 'SELECT * FROM t WHERE id = ' + x;\n");

  const config = await loadConfig(jsPath);
  const findings = await scanProject(jsPath, config);

  assert.ok(findings.some((f) => f.type === "injection"));
  assert.ok(findings.every((f) => f.file === "one.js" || posix(f.file) === "one.js"));
});

test("integration: single active rule — only injection when others disabled", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "gr-rule-"));
  mkdirSync(path.join(root, ".git"));
  mkdirSync(path.join(root, "src"), { recursive: true });

  writeFileSync(
    path.join(root, ".guardrailrc.json"),
    JSON.stringify({
      policy: { failOn: [], scoreThreshold: 0 },
      rules: {
        secrets: false,
        injection: true,
        xss: false,
        cors: false,
        eval: false,
        ssrf: false,
        weakCrypto: false,
        pathTraversal: false,
        insecureHttp: false,
        authMiddleware: false,
        dependencies: false,
      },
      ignore: { paths: [], findings: [] },
      report: { formats: ["json"], outputDir: "./report" },
      ai: { enabled: false, model: "" },
    }),
  );

  writeFileSync(
    path.join(root, "src", "mix.js"),
    "const q = 'SELECT * FROM t WHERE id = ' + x;\nconst token = 'ghp_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';\n",
  );

  const config = await loadConfig(root);
  const findings = await scanProject(root, config);

  assert.ok(findings.some((f) => f.type === "injection"));
  assert.equal(
    findings.filter((f) => f.type === "secret").length,
    0,
    "secrets rule off → no secret findings",
  );
});
