import { promises as fs } from "node:fs";
import type { GuardrailReport } from "../types";

export async function writeJsonReport(filePath: string, report: GuardrailReport): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(report, null, 2));
}
