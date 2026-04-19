import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * First ancestor of `startPath` (including start) that contains a `.git` file or directory.
 */
export async function findGitRoot(startPath: string): Promise<string | null> {
  let cur = path.resolve(startPath);
  for (let i = 0; i < 64; i++) {
    const gitPath = path.join(cur, ".git");
    try {
      const st = await fs.stat(gitPath);
      if (st.isFile() || st.isDirectory()) {
        return cur;
      }
    } catch {
      // not found
    }
    const parent = path.dirname(cur);
    if (parent === cur) {
      return null;
    }
    cur = parent;
  }
  return null;
}

/**
 * Directories from repo root down to `targetPath` (inclusive), in merge order (broad → narrow).
 * If no Git root is found, returns only `[resolvedTarget]` so only that folder’s config applies.
 */
export async function listConfigDirectories(targetPath: string): Promise<string[]> {
  const absolute = path.resolve(targetPath);
  const gitRoot = await findGitRoot(absolute);

  if (gitRoot === null) {
    return [absolute];
  }

  const upward: string[] = [];
  let cur = absolute;
  while (true) {
    upward.push(cur);
    if (cur === gitRoot) {
      break;
    }
    const parent = path.dirname(cur);
    if (parent === cur) {
      break;
    }
    cur = parent;
  }

  return upward.slice().reverse();
}
