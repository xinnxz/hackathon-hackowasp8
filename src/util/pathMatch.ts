/**
 * Minimal glob for ignore.paths: supports `*` (single path segment) and `**` (cross segments).
 * Paths are normalized to POSIX-style for matching.
 */
export function normalizeScanPath(relativePath: string): string {
  return relativePath.replace(/\\/g, "/").replace(/^\.\//, "");
}

export function pathMatchesIgnore(relativePath: string, pattern: string): boolean {
  const pathNorm = normalizeScanPath(relativePath);
  const patNorm = normalizeScanPath(pattern);
  if (!patNorm) {
    return false;
  }

  if (!patNorm.includes("*")) {
    return pathNorm === patNorm
      || pathNorm.startsWith(`${patNorm}/`)
      || pathNorm.endsWith(`/${patNorm}`)
      || pathNorm.includes(`/${patNorm}/`);
  }

  const parts = patNorm.split("**").map((segment) =>
    segment
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, "[^/]*"),
  );
  const body = parts.join(".*");
  return new RegExp(`^${body}$`).test(pathNorm);
}
