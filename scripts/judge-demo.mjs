/**
 * Runs vulnerable-app then fixed-app scans without stopping if the first fails (policy FAIL).
 * Writes reports to separate folders so judges can open both HTML files.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const withAi = process.argv.includes("--with-ai");

function runScan(target, outputDir) {
  const args = ["tsx", "src/cli.ts", "scan", target, `--output-dir=${outputDir}`];
  if (withAi) args.push("--with-ai");
  const r = spawnSync("npx", args, {
    stdio: "inherit",
    cwd: root,
    shell: true,
    env: { ...process.env, NODE_NO_WARNINGS: "1" },
  });
  if (r.error) throw r.error;
  console.log(`\n--- done: ${target} → ${outputDir} (exit ${r.status ?? 0}) ---\n`);
  return r.status ?? 0;
}

runScan("demo/vulnerable-app", "./report-demo-vulnerable");
const codeFixed = runScan("demo/fixed-app", "./report-demo-fixed");
process.exitCode = codeFixed !== 0 ? codeFixed : 0;
