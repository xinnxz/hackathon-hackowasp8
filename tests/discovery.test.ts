import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { findGitRoot, listConfigDirectories } from "../src/config/discovery";
import { loadConfig } from "../src/config";

test("findGitRoot returns ancestor with .git directory", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "gr-git-"));
  mkdirSync(path.join(root, "pkg", "nested"), { recursive: true });
  mkdirSync(path.join(root, ".git"));

  const found = await findGitRoot(path.join(root, "pkg", "nested"));
  assert.equal(found, root);
});

test("listConfigDirectories lists from git root to target", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "gr-chain-"));
  const scan = path.join(root, "apps", "svc");
  mkdirSync(scan, { recursive: true });
  mkdirSync(path.join(root, ".git"));

  const dirs = await listConfigDirectories(scan);
  assert.deepEqual(dirs, [root, path.join(root, "apps"), scan]);
});

test("without .git, listConfigDirectories is only target", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "gr-nogit-"));
  const only = path.join(root, "solo");
  mkdirSync(only, { recursive: true });

  const dirs = await listConfigDirectories(only);
  assert.deepEqual(dirs, [only]);
});

test("listConfigDirectories with file target uses parent chain to git root", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "gr-filecfg-"));
  mkdirSync(path.join(root, "apps"), { recursive: true });
  const file = path.join(root, "apps", "svc.js");
  writeFileSync(file, "// noop\n");
  mkdirSync(path.join(root, ".git"));

  const dirs = await listConfigDirectories(file);
  assert.deepEqual(dirs, [root, path.join(root, "apps")]);
});

test("without .git, file target resolves to parent directory only", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "gr-fileonly-"));
  const sub = path.join(root, "pkg");
  mkdirSync(sub, { recursive: true });
  const file = path.join(sub, "a.ts");
  writeFileSync(file, "export {}\n");

  const dirs = await listConfigDirectories(file);
  assert.deepEqual(dirs, [sub]);
});

test("loadConfig merges only within git tree", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "gr-load-"));
  const leaf = path.join(root, "leaf");
  mkdirSync(leaf, { recursive: true });
  mkdirSync(path.join(root, ".git"));
  writeFileSync(
    path.join(root, ".guardrailrc.json"),
    JSON.stringify({ rules: { xss: false } }),
  );
  writeFileSync(
    path.join(leaf, ".guardrailrc.json"),
    JSON.stringify({ rules: { secrets: false } }),
  );

  const cfg = await loadConfig(leaf);
  assert.equal(cfg.rules.xss, false);
  assert.equal(cfg.rules.secrets, false);
});
