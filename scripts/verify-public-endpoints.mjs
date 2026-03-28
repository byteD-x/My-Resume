import process from "node:process";

const DEFAULT_VERCEL_URL = "https://my-resume-gray-five.vercel.app";
const DEFAULT_PAGES_URL = "https://byted-x.github.io/My-Resume";
const DEFAULT_SERVER_URL = "https://www.byted.online";
const DEFAULT_SERVER_IP_URL = "https://106.12.154.163";
const REQUEST_TIMEOUT_MS = Number(process.env.PUBLIC_ENDPOINT_TIMEOUT_MS || 20000);

function normalizeUrl(url) {
    return String(url || "").trim().replace(/\/+$/g, "");
}

function shouldRequireServerEndpoint() {
    const raw = String(process.env.VERIFY_SERVER_PUBLIC_URL || "").trim().toLowerCase();
    return raw === "1" || raw === "true" || raw === "required" || raw === "strict";
}

function resolvePagesUrl() {
    const explicitPagesUrl = normalizeUrl(process.env.PAGES_PUBLIC_URL);
    if (explicitPagesUrl) {
        return explicitPagesUrl;
    }

    const repository = String(process.env.GITHUB_REPOSITORY || "").trim();
    const owner = String(process.env.GITHUB_REPOSITORY_OWNER || "").trim() || repository.split("/")[0];
    const repoName = repository.split("/")[1] || "";

    if (!owner || !repoName) {
        return DEFAULT_PAGES_URL;
    }

    if (repoName === `${owner}.github.io`) {
        return `https://${owner}.github.io`;
    }

    return `https://${owner}.github.io/${repoName}`;
}

async function checkUrl(label, url) {
    const controller = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
    const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller,
        headers: {
            "user-agent": "portfolio-public-endpoint-verifier",
        },
    });

    if (!response.ok) {
        throw new Error(`${label} responded with HTTP ${response.status}`);
    }
}

async function verifyRequired(endpoints) {
    for (const endpoint of endpoints) {
        console.log(`Checking required endpoint: ${endpoint.label} -> ${endpoint.url}`);
        await checkUrl(endpoint.label, endpoint.url);
    }
}

async function verifyOptional(endpoint) {
    console.log(`Checking optional endpoint: ${endpoint.label} -> ${endpoint.url}`);

    try {
        await checkUrl(endpoint.label, endpoint.url);
    } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        console.log(`::warning::Optional endpoint check failed for ${endpoint.label}: ${reason}`);
    }
}

async function main() {
    const vercelUrl = normalizeUrl(process.env.VERCEL_PUBLIC_URL) || DEFAULT_VERCEL_URL;
    const pagesUrl = resolvePagesUrl();
    const serverUrl = normalizeUrl(process.env.SERVER_PUBLIC_URL) || DEFAULT_SERVER_URL;
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
