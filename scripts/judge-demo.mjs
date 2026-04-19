/**
 * Runs vulnerable-app then fixed-app scans without stopping if the first fails (policy FAIL).
 * Writes reports to separate folders so judges can open both HTML files.
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const withAi = process.argv.includes("--with-ai");
const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";

function runScan(target, outputDir) {
  const args = ["tsx", "src/cli.ts", "scan", target, `--output-dir=${outputDir}`];
  if (withAi) args.push("--with-ai");
  try {
    execFileSync(npxCmd, args, { stdio: "inherit", cwd: root, env: process.env });
    console.log(`\n--- done: ${target} → ${outputDir} (exit 0) ---\n`);
    return 0;
  } catch (err) {
    const code = err.status ?? 1;
    console.log(`\n--- done: ${target} → ${outputDir} (exit ${code}) ---\n`);
    return code;
  }
}

runScan("demo/vulnerable-app", "./report-demo-vulnerable");
const codeFixed = runScan("demo/fixed-app", "./report-demo-fixed");
// Exit 0 if the fixed demo passes (expected). Vulnerable demo often exits 1 due to fail-on policy.
process.exitCode = codeFixed !== 0 ? codeFixed : 0;
