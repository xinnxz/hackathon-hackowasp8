/**
 * Minimal glob for ignore.paths: supports `*`, `**`, and `/` separators.
 * Paths are normalized to POSIX-style for matching.
 */
export function normalizeScanPath(relativePath: string): string {
  return relativePath.replace(/\\/g, "/").replace(/^\.\//, "");
}

export function pathMatchesIgnore(relativePath: string, pattern: string): boolean {
  const pathNorm = normalizeScanPath(relativePath);
  const patNorm = pattern.replace(/\\/g, "/").trim();
  if (!patNorm) {
    return false;
  }

  if (!patNorm.includes("*")) {
    return pathNorm === patNorm
      || pathNorm.startsWith(`${patNorm}/`)
      || pathNorm.endsWith(`/${patNorm}`)
      || pathNorm.includes(`/${patNorm}/`);
  }

  const regexBody = patNorm
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*\//g, "(?:.*/)?")
    .replace(/\*\*/g, ".*")
    .replace(/\*/g, "[^/]*");
  const regex = new RegExp(`^${regexBody}$`);
  return regex.test(pathNorm);
}
