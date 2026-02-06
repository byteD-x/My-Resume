/* eslint-disable */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const imageDir = path.join(__dirname, '..', 'public', 'images');
const supportedExtensions = new Set([
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.avif',
    '.gif',
]);

function countSupportedImages(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let count = 0;

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            count += countSupportedImages(fullPath);
            continue;
        }

        const ext = path.extname(entry.name).toLowerCase();
        if (supportedExtensions.has(ext)) {
            count++;
        }
    }

    return count;
}

if (!fs.existsSync(imageDir)) {
    console.log('No public/images directory found. Skipping image optimizer.');
    process.exit(0);
}

const imageCount = countSupportedImages(imageDir);
if (imageCount === 0) {
    console.log('No supported images found in public/images. Skipping image optimizer.');
    process.exit(0);
}

console.log(`Found ${imageCount} supported images. Running next-image-export-optimizer...`);
const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const result = spawnSync(npxCommand, ['next-image-export-optimizer'], {
    stdio: 'inherit',
    env: process.env,
});

if (result.error) {
    console.error(result.error.message);
    process.exit(1);
}

process.exit(result.status ?? 1);
