/* eslint-disable */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const SRC_DIR = path.join(__dirname, '../src');
const TIMEOUT_MS = Number(process.env.LINK_CHECK_TIMEOUT_MS || 5000);
const CONCURRENCY = Number(process.env.LINK_CHECK_CONCURRENCY || 8);
const RETRIES = Number(process.env.LINK_CHECK_RETRIES || 2);
const OPTIONAL_HOSTS = new Set(
    String(process.env.LINK_CHECK_OPTIONAL_HOSTS || 'www.byted.online,106.12.154.163')
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean),
);

const red = (msg) => `\x1b[31m${msg}\x1b[0m`;
const green = (msg) => `\x1b[32m${msg}\x1b[0m`;
const yellow = (msg) => `\x1b[33m${msg}\x1b[0m`;

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
            return;
        }

        if (/\.(ts|tsx|js|jsx)$/.test(file)) {
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
}

function extractLinks(content) {
    const urlRegex = /https?:\/\/[^\s"',`)\\\]]+/g;
    const matches = content.match(urlRegex) || [];
    return matches
        .map((raw) => raw.replace(/\$\{[^}]*$/, ''))
        .map((raw) => raw.replace(/[),.;!?]+$/, ''))
        .map((raw) => raw.split('#')[0])
        .filter((raw) => !raw.includes('${'))
        .filter(Boolean);
}

function isOptionalHost(url) {
    try {
        return OPTIONAL_HOSTS.has(new URL(url).hostname.toLowerCase());
    } catch {
        return false;
    }
}

function checkLinkWithMethod(url, method) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        const req =
            method === 'HEAD'
                ? client.request(url, { method: 'HEAD', timeout: TIMEOUT_MS }, onResponse)
                : client.get(url, { timeout: TIMEOUT_MS }, onResponse);

        function onResponse(res) {
            if (method === 'GET') {
                res.on('data', () => {});
            }
            if (res.statusCode >= 200 && res.statusCode < 400) {
                resolve({ url, status: 'ok', code: res.statusCode, method });
                return;
            }
            resolve({ url, status: 'error', code: res.statusCode, method });
        }

        req.on('error', (err) => {
            resolve({ url, status: 'error', error: err.message, method });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ url, status: 'timeout', method });
        });

        if (method === 'HEAD') {
            req.end();
        }
    });
}

async function checkLink(url) {
    const transientErrorPattern = /ECONNRESET|ETIMEDOUT|EAI_AGAIN|socket disconnected|socket hang up|ENOTFOUND/i;

    for (let attempt = 0; attempt <= RETRIES; attempt++) {
        let result = await checkLinkWithMethod(url, 'HEAD');
        if (
            result.status === 'error' &&
            (
                result.code === 403 ||
                result.code === 405 ||
                result.code === 429 ||
                (typeof result.code === 'number' && result.code >= 500) ||
                /github\.com/i.test(url)
            )
        ) {
            result = await checkLinkWithMethod(url, 'GET');
        }

        const isTransientNetworkError =
            result.status === 'timeout' ||
            (typeof result.error === 'string' && transientErrorPattern.test(result.error));
        const canRetry = attempt < RETRIES && isTransientNetworkError;

        if (!canRetry) {
            const isGitHub = /github\.com/i.test(url);
            const isLikelyRemoteThrottle =
                result.status !== 'ok' &&
                (
                    result.code === 429 ||
                    (typeof result.code === 'number' && result.code >= 500) ||
                    isTransientNetworkError
                );
            if (isGitHub && isLikelyRemoteThrottle) {
                return {
                    ...result,
                    status: 'ok',
                    degraded: true,
                    retries: attempt > 0 ? attempt : undefined,
                };
            }
            if (isOptionalHost(url)) {
                return {
                    ...result,
                    status: 'ok',
                    degraded: true,
                    optional: true,
                    retries: attempt > 0 ? attempt : undefined,
                };
            }
            if (attempt > 0) {
                result.retries = attempt;
            }
            return result;
        }

        const backoff = (attempt + 1) * 300;
        await new Promise((resolve) => setTimeout(resolve, backoff));
    }

    return { url, status: 'error' };
}

async function runWithConcurrency(items, limit, worker) {
    let index = 0;
    const results = new Array(items.length);

    const runWorker = async () => {
        while (index < items.length) {
            const current = index++;
            results[current] = await worker(items[current], current);
        }
    };

    const workers = Array.from({ length: Math.min(limit, items.length) }, runWorker);
    await Promise.all(workers);
    return results;
}

async function main() {
    console.log('Scanning for links in src/ ...');
    const files = getAllFiles(SRC_DIR);
    const links = new Set();

    files.forEach((file) => {
        const content = fs.readFileSync(file, 'utf8');
        extractLinks(content).forEach((link) => links.add(link));
    });

    console.log(`Found ${links.size} unique links.`);

    const ignored = ['http://localhost', 'https://api.github.com', 'http://www.w3.org'];
    const linksToCheck = Array.from(links).filter((link) => !ignored.some((prefix) => link.startsWith(prefix)));
    console.log(`Checking ${linksToCheck.length} links with concurrency=${CONCURRENCY} ...`);

    const results = await runWithConcurrency(linksToCheck, CONCURRENCY, async (url) => {
        const result = await checkLink(url);
        const reason = result.code || result.error || result.status;
        const okLabel = result.degraded ? 'OK (degraded)' : 'OK';
        const prefix = result.status === 'ok' ? green(okLabel) : red(`FAIL (${reason})`);
        const method = result.method ? yellow(`[${result.method}]`) : '';
        const optionalInfo = result.optional ? ' (optional host)' : '';
        const retryInfo = typeof result.retries === 'number' && result.retries > 0 ? ` (retries=${result.retries})` : '';
        console.log(`${method} ${url} -> ${prefix}${optionalInfo}${retryInfo}`);
        return result;
    });

    const failed = results.filter((result) => result.status !== 'ok');
    if (failed.length > 0) {
        console.log(red(`\nFound ${failed.length} broken links.`));
        process.exit(1);
    }

    console.log(green('\nAll links passed!'));
}

main();
