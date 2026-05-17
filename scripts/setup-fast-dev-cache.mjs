import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const linkDirName = ".next-dev-cache";
const linkPath = path.join(repoRoot, linkDirName);
const defaultTargetRoot =
  process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local");
const defaultTargetPath = path.join(
  defaultTargetRoot,
  "portfolio-dev-cache",
  path.basename(repoRoot),
  "next",
);
const requestedTarget = process.argv[2]?.trim();
const targetPath = path.resolve(requestedTarget || defaultTargetPath);

function normalizePath(value) {
  return path.normalize(value).replace(/[\\\/]+$/, "").toLowerCase();
}

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function ensureLinkParent() {
  ensureDirectory(path.dirname(linkPath));
}

function describeCurrentPath() {
  if (!fs.existsSync(linkPath)) return null;
  const stats = fs.lstatSync(linkPath);

  if (stats.isSymbolicLink()) {
    const resolved = fs.realpathSync(linkPath);
    return {
      kind: "link",
      resolved,
    };
  }

  if (stats.isDirectory()) {
    return {
      kind: "directory",
      entries: fs.readdirSync(linkPath),
    };
  }

  return {
    kind: "file",
  };
}

function ensureLinkTarget() {
  ensureDirectory(targetPath);
  ensureLinkParent();

  const current = describeCurrentPath();
  if (current?.kind === "link") {
    if (normalizePath(current.resolved) === normalizePath(targetPath)) {
      console.log(`Fast dev cache already points to: ${targetPath}`);
      return;
    }

    throw new Error(
      [
        `${linkDirName} already exists and points elsewhere.`,
        `Current: ${current.resolved}`,
        `Expected: ${targetPath}`,
        `Remove ${linkDirName} manually if you want to recreate it.`,
      ].join("\n"),
    );
  }

  if (current?.kind === "directory") {
    if (current.entries.length > 0) {
      throw new Error(
        [
          `${linkDirName} already exists as a normal directory and is not empty.`,
          `Please move or remove it manually before creating the junction.`,
        ].join("\n"),
      );
    }

    fs.rmSync(linkPath, { recursive: true, force: true });
  }

  if (current?.kind === "file") {
    throw new Error(
      `${linkDirName} already exists as a file. Remove it manually before continuing.`,
    );
  }

  fs.symlinkSync(targetPath, linkPath, process.platform === "win32" ? "junction" : "dir");
  console.log(`Created fast dev cache link: ${linkPath}`);
  console.log(`Target directory: ${targetPath}`);
}

try {
  ensureLinkTarget();
  console.log("");
  console.log("Use the external-drive friendly dev commands:");
  console.log("  npm run dev:external");
  console.log("  npm run dev:external:webpack");
  console.log("  npm run dev:external:trace");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
