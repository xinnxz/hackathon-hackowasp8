import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * First ancestor of `startPath` (including start) that contains a `.git` file or directory.
 */
export async function findGitRoot(startPath: string): Promise<string | null> {
  let cur = path.resolve(startPath);
  try {
    const st = await fs.stat(cur);
    if (st.isFile()) {
      cur = path.dirname(cur);
    }
  } catch {
    // missing path: still walk parents from resolved startPath
  }
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
/**
 * Directory used for config merge when `targetPath` may be a file (leaf = parent dir).
 */
export async function configAnchorDirectory(targetPath: string): Promise<string> {
  const absolute = path.resolve(targetPath);
  try {
    const st = await fs.stat(absolute);
    if (st.isFile()) {
      return path.dirname(absolute);
    }
  } catch {
    // treat as directory path for merge chain
  }
  return absolute;
}

export async function listConfigDirectories(targetPath: string): Promise<string[]> {
  const absolute = path.resolve(targetPath);
  const anchor = await configAnchorDirectory(targetPath);
  const gitRoot = await findGitRoot(absolute);

  if (gitRoot === null) {
    return [anchor];
  }

  const upward: string[] = [];
  let cur = anchor;
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
