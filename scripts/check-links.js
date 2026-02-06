/* eslint-disable */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const SRC_DIR = path.join(__dirname, '../src');
const TIMEOUT_MS = 5000;

// Colors
const red = (msg) => `\x1b[31m${msg}\x1b[0m`;
const green = (msg) => `\x1b[32m${msg}\x1b[0m`;
const yellow = (msg) => `\x1b[33m${msg}\x1b[0m`;

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });
    return arrayOfFiles;
}

function extractLinks(content) {
    // Exclude backslash and other common delimiters
    const urlRegex = /https?:\/\/[^\s"',`)\\\]]+/g;
    const matches = content.match(urlRegex) || [];
    return matches
        .map((raw) => raw.replace(/\$\{[^}]*$/, ''))
        .map((raw) => raw.replace(/[),.;!?]+$/, ''))
        .filter(Boolean);
}

async function checkLink(url) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        const req = client.request(url, { method: 'HEAD', timeout: TIMEOUT_MS }, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                resolve({ url, status: 'ok', code: res.statusCode });
            } else if (res.statusCode === 405 || res.statusCode === 403) {
                // Some servers block HEAD or return 403 (like GitHub sometimes), try GET
                resolve({ url, status: 'retry-get', code: res.statusCode });
            } else {
                resolve({ url, status: 'error', code: res.statusCode });
            }
        });

        req.on('error', (err) => {
            resolve({ url, status: 'error', error: err.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ url, status: 'timeout' });
        });

        req.end();
    });
}
async function checkLinkGet(url) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, { timeout: TIMEOUT_MS }, (res) => {
            // Drain data to avoid memory leaks
            res.on('data', () => { });
            if (res.statusCode >= 200 && res.statusCode < 400) {
                resolve({ url, status: 'ok', code: res.statusCode });
            } else {
                resolve({ url, status: 'error', code: res.statusCode });
            }
        });

        req.on('error', (err) => {
            resolve({ url, status: 'error', error: err.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ url, status: 'timeout' });
        });
    });
}


async function main() {
    console.log('🔍 Scanning for links in src/...');
    const files = getAllFiles(SRC_DIR);
    const links = new Set();

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const found = extractLinks(content);
        found.forEach(link => links.add(link));
    });

    console.log(`Found ${links.size} unique links.`);

    // Whitelist / Ignored domains (e.g., localhost placeholders)
    const ignored = ['http://localhost', 'https://api.github.com', 'http://www.w3.org'];
    const linksToCheck = Array.from(links).filter(l => !ignored.some(i => l.startsWith(i)));

    console.log(`Checking ${linksToCheck.length} links...`);

    let brokenCount = 0;

    for (const url of linksToCheck) {
        process.stdout.write(`Checking ${url} ... `);
        let result = await checkLink(url);

        if (result.status === 'retry-get') {
            result = await checkLinkGet(url);
        }

        if (result.status === 'ok') {
            console.log(green('OK'));
        } else {
            console.log(red(`FAIL (${result.code || result.error || result.status})`));
            brokenCount++;
        }
    }

    if (brokenCount > 0) {
        console.log(red(`\nFound ${brokenCount} broken links!`));
        process.exit(1);
    } else {
        console.log(green('\nAll links passed!'));
    }
}

main();
