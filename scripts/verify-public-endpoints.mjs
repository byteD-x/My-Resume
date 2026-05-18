import process from "node:process";

const DEFAULT_VERCEL_URL = "https://my-resume-gray-five.vercel.app";
const DEFAULT_PAGES_URL = "https://byted-x.github.io/My-Resume";
const DEFAULT_SERVER_URL = "https://www.byted.online";
const DEFAULT_SERVER_IP_URL = "http://106.12.154.163";
const REQUEST_TIMEOUT_MS = Number(
  process.env.PUBLIC_ENDPOINT_TIMEOUT_MS || 20000,
);
const INSPECTED_HEADERS = [
  "cache-control",
  "cdn-cache-control",
  "vercel-cdn-cache-control",
  "content-length",
  "content-type",
  "age",
  "x-vercel-cache",
];

function normalizeUrl(url) {
  return String(url || "")
    .trim()
    .replace(/\/+$/g, "");
}

function shouldRequireServerEndpoint() {
  const raw = String(process.env.VERIFY_SERVER_PUBLIC_URL || "")
    .trim()
    .toLowerCase();
  return (
    raw === "1" || raw === "true" || raw === "required" || raw === "strict"
  );
}

function resolvePagesUrl() {
  const explicitPagesUrl = normalizeUrl(process.env.PAGES_PUBLIC_URL);
  if (explicitPagesUrl) {
    return explicitPagesUrl;
  }

  const repository = String(process.env.GITHUB_REPOSITORY || "").trim();
  const owner =
    String(process.env.GITHUB_REPOSITORY_OWNER || "").trim() ||
    repository.split("/")[0];
  const repoName = repository.split("/")[1] || "";

  if (!owner || !repoName) {
    return DEFAULT_PAGES_URL;
  }

  if (repoName === `${owner}.github.io`) {
    return `https://${owner}.github.io`;
  }

  return `https://${owner}.github.io/${repoName}`;
}

async function requestUrl(url, method) {
  const controller = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  return fetch(url, {
    method,
    redirect: "follow",
    signal: controller,
    headers: {
      "user-agent": "portfolio-public-endpoint-verifier",
    },
  });
}

function extractHeaderSnapshot(response) {
  return Object.fromEntries(
    INSPECTED_HEADERS.map((name) => [name, response.headers.get(name) || "-"]),
  );
}

function isDocumentUrl(url) {
  return !/\.[a-z0-9]+(?:$|\?)/i.test(new URL(url).pathname);
}

function diagnoseHeaders(label, url, headers) {
  const warnings = [];
  const cacheControl = headers["cache-control"];

  if (isDocumentUrl(url) && /31536000/.test(cacheControl)) {
    warnings.push("HTML 文档命中超长缓存 TTL，可能导致首页内容长期陈旧。");
  }

  if (label === "GitHub Pages" && headers["cdn-cache-control"] !== "-") {
    warnings.push("GitHub Pages 返回了 CDN 定向缓存头，请确认是否符合预期。");
  }

  return warnings;
}

async function inspectUrl(label, url) {
  let headResponse = null;

  try {
    headResponse = await requestUrl(url, "HEAD");
  } catch {
    headResponse = null;
  }

  const response =
    headResponse && headResponse.ok ? headResponse : await requestUrl(url, "GET");

  if (!response.ok) {
    throw new Error(`${label} responded with HTTP ${response.status}`);
  }

  const headerSnapshot = extractHeaderSnapshot(response);
  console.log(
    `[headers] ${label}: ${INSPECTED_HEADERS.map((name) => `${name}=${headerSnapshot[name]}`).join(" | ")}`,
  );

  for (const warning of diagnoseHeaders(label, url, headerSnapshot)) {
    console.log(`::warning::${label}: ${warning}`);
  }
}

async function verifyRequired(endpoints) {
  for (const endpoint of endpoints) {
    console.log(
      `Checking required endpoint: ${endpoint.label} -> ${endpoint.url}`,
    );
    await inspectUrl(endpoint.label, endpoint.url);
  }
}

async function verifyOptional(endpoint) {
  console.log(
    `Checking optional endpoint: ${endpoint.label} -> ${endpoint.url}`,
  );

  try {
    await inspectUrl(endpoint.label, endpoint.url);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.log(
      `::warning::Optional endpoint check failed for ${endpoint.label}: ${reason}`,
    );
  }
}

async function main() {
  const vercelUrl =
    normalizeUrl(process.env.VERCEL_PUBLIC_URL) || DEFAULT_VERCEL_URL;
  const pagesUrl = resolvePagesUrl();
  const serverUrl =
    normalizeUrl(process.env.SERVER_PUBLIC_URL) || DEFAULT_SERVER_URL;
  const serverIpUrl =
    normalizeUrl(process.env.SERVER_IP_PUBLIC_URL) || DEFAULT_SERVER_IP_URL;
  const serverRequired = shouldRequireServerEndpoint();

  const requiredEndpoints = [
    { label: "Vercel", url: vercelUrl },
    { label: "GitHub Pages", url: pagesUrl },
    { label: "Self-hosted IP", url: serverIpUrl },
  ];

  if (serverRequired) {
    requiredEndpoints.push({ label: "Self-hosted domain", url: serverUrl });
  }

  await verifyRequired(requiredEndpoints);

  if (!serverRequired) {
    await verifyOptional({ label: "Self-hosted domain", url: serverUrl });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
