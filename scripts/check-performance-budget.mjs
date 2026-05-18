import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { JSDOM } from "jsdom";

const rootDir = process.cwd();
const outDir = path.join(rootDir, "out");
const nextDir = path.join(rootDir, ".next");
const budgetStrict =
  process.argv.includes("--strict") || process.env.PERF_BUDGET_STRICT === "1";

const budgets = {
  htmlDecodedBytes: 280 * 1024,
  inlineRscBytes: 90 * 1024,
  domNodes: 1500,
  mobileDockHeight: 72,
};

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function formatBudgetResult(label, value, budget, formatter = String) {
  const status = value <= budget ? "PASS" : "WARN";
  return `${status} ${label}: ${formatter(value)} / budget ${formatter(budget)}`;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveHomepageHtmlPath() {
  const directIndex = path.join(outDir, "index.html");
  if (await fileExists(directIndex)) {
    return directIndex;
  }

  const entries = await fs.readdir(outDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const nestedIndex = path.join(outDir, entry.name, "index.html");
    if (await fileExists(nestedIndex)) {
      return nestedIndex;
    }
  }

  throw new Error('Could not find homepage HTML. Run "npm run build:pages" first.');
}

function collectCandidateAssetPaths(assetPath) {
  const normalized = assetPath.replace(/^\/+/, "");
  const decoded = decodeURIComponent(normalized);
  const variants = new Set([decoded]);
  const parts = decoded.split("/").filter(Boolean);
  const nextIndex = parts.indexOf("_next");

  if (nextIndex > 0) {
    variants.add(parts.slice(nextIndex).join("/"));
  }

  const candidates = [];
  for (const variant of variants) {
    candidates.push(path.join(outDir, variant));

    if (variant.startsWith("_next/static/")) {
      candidates.push(
        path.join(nextDir, "static", variant.slice("_next/static/".length)),
      );
    }
  }

  return candidates;
}

async function resolveAssetSize(assetPath) {
  if (!assetPath || /^https?:\/\//i.test(assetPath)) {
    return null;
  }

  for (const candidate of collectCandidateAssetPaths(assetPath)) {
    try {
      const stats = await fs.stat(candidate);
      if (stats.isFile()) {
        return stats.size;
      }
    } catch {
      // Continue with the next candidate.
    }
  }

  return null;
}

async function collectPublicAssetSizes() {
  const publicDir = path.join(rootDir, "public");
  const ogPath = path.join(publicDir, "og.png");
  const publicEntries = await fs.readdir(publicDir);
  const resumeFileName = publicEntries.find((entry) => entry.toLowerCase().endsWith(".pdf"));

  const [ogStats, resumeStats] = await Promise.all([
    fs.stat(ogPath).catch(() => null),
    resumeFileName
      ? fs.stat(path.join(publicDir, resumeFileName)).catch(() => null)
      : Promise.resolve(null),
  ]);

  return {
    ogPngBytes: ogStats?.size ?? null,
    resumePdfBytes: resumeStats?.size ?? null,
  };
}

async function main() {
  const homepageHtmlPath = await resolveHomepageHtmlPath();
  const html = await fs.readFile(homepageHtmlPath, "utf8");
  const htmlDecodedBytes = Buffer.byteLength(html, "utf8");
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const domNodes = document.querySelectorAll("*").length;
  const scripts = Array.from(document.querySelectorAll("script"));
  const stylesheets = Array.from(
    document.querySelectorAll('link[rel="stylesheet"]'),
  );
  const inlineScripts = scripts.filter((script) => !script.src);
  const inlineScriptBytes = inlineScripts.reduce(
    (total, script) => total + Buffer.byteLength(script.textContent ?? "", "utf8"),
    0,
  );
  const inlineRscScripts = inlineScripts.filter((script) =>
    (script.textContent ?? "").includes("self.__next_f.push"),
  );
  const inlineRscBytes = inlineRscScripts.reduce(
    (total, script) => total + Buffer.byteLength(script.textContent ?? "", "utf8"),
    0,
  );
  const inlineRscPushCount = inlineRscScripts.reduce((total, script) => {
    const matches = (script.textContent ?? "").match(/self\.__next_f\.push/g);
    return total + (matches?.length ?? 0);
  }, 0);

  const jsAssetSizes = (
    await Promise.all(scripts.map((script) => resolveAssetSize(script.src)))
  ).filter((value) => typeof value === "number");
  const cssAssetSizes = (
    await Promise.all(stylesheets.map((link) => resolveAssetSize(link.href)))
  ).filter((value) => typeof value === "number");

  const publicAssets = await collectPublicAssetSizes();
  const warnings = [];

  if (htmlDecodedBytes > budgets.htmlDecodedBytes) warnings.push("htmlDecodedBytes");
  if (inlineRscBytes > budgets.inlineRscBytes) warnings.push("inlineRscBytes");
  if (domNodes > budgets.domNodes) warnings.push("domNodes");

  console.log(`[budget] homepage html: ${homepageHtmlPath}`);
  console.log(formatBudgetResult("HTML decoded", htmlDecodedBytes, budgets.htmlDecodedBytes, formatBytes));
  console.log(formatBudgetResult("Inline RSC", inlineRscBytes, budgets.inlineRscBytes, formatBytes));
  console.log(formatBudgetResult("DOM nodes", domNodes, budgets.domNodes));
  console.log(`[report] script tags: ${scripts.length}`);
  console.log(`[report] inline scripts: ${inlineScripts.length} (${formatBytes(inlineScriptBytes)})`);
  console.log(`[report] inline RSC pushes: ${inlineRscPushCount}`);
  console.log(
    `[report] JS assets: ${jsAssetSizes.length} files / ${formatBytes(jsAssetSizes.reduce((sum, size) => sum + size, 0))}`,
  );
  console.log(
    `[report] CSS assets: ${cssAssetSizes.length} files / ${formatBytes(cssAssetSizes.reduce((sum, size) => sum + size, 0))}`,
  );

  if (publicAssets.ogPngBytes !== null) {
    console.log(`[report] public/og.png: ${formatBytes(publicAssets.ogPngBytes)}`);
  }
  if (publicAssets.resumePdfBytes !== null) {
    console.log(`[report] public resume pdf: ${formatBytes(publicAssets.resumePdfBytes)}`);
  }

  console.log(
    `[report] mobile dock height budget: ${budgets.mobileDockHeight}px (validated in Playwright, not static HTML)`,
  );

  if (budgetStrict && warnings.length > 0) {
    throw new Error(`Performance budgets exceeded: ${warnings.join(", ")}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
