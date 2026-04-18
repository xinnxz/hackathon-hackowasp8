import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { buildDashboardHtml } from "./app";

const PORT = 4000;
const REPORT_PATH = path.resolve("report", "guardrail-report.json");

export async function startDashboard(): Promise<void> {
  let reportData: unknown = null;
  try {
    const raw = await fs.readFile(REPORT_PATH, "utf8");
    reportData = JSON.parse(raw);
  } catch {
    console.error(`\x1b[31m[Dashboard] No report found at ${REPORT_PATH}. Run a scan first.\x1b[0m`);
    console.log(`  npm run scan:demo:ai`);
    process.exitCode = 1;
    return;
  }

  const server = http.createServer((req, res) => {
    if (req.url === "/api/report") {
      res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
      res.end(JSON.stringify(reportData));
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(buildDashboardHtml());
  });

  server.listen(PORT, () => {
    console.log(`\x1b[36m╔════════════════════════════════════════════╗`);
    console.log(`║  ⛨  OWASP Guardrail Dashboard              ║`);
    console.log(`║  http://localhost:${PORT}                      ║`);
    console.log(`╚════════════════════════════════════════════╝\x1b[0m`);
    console.log(`\n\x1b[32mDashboard is running. Press Ctrl+C to stop.\x1b[0m\n`);

    // Try to open browser automatically
    const url = `http://localhost:${PORT}`;
    const opener = process.platform === "win32" ? "start" : process.platform === "darwin" ? "open" : "xdg-open";
    import("node:child_process").then(({ exec }) => exec(`${opener} ${url}`)).catch(() => {});
  });

  // Keep process alive
  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => { server.close(); resolve(); });
    process.on("SIGTERM", () => { server.close(); resolve(); });
  });
}
