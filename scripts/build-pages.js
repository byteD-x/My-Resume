/* eslint-disable */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const appDir = path.join(rootDir, 'src', 'app');
const modalDir = path.join(appDir, '@modal');
const interceptDir = path.join(modalDir, '(.)experiences');
const stashDir = path.join(rootDir, 'src', '__app_disabled__');
const stashInterceptDir = path.join(stashDir, '(.)experiences');
const nextDir = path.join(rootDir, '.next');
const outDir = path.join(rootDir, 'out');

const argBasePath = process.argv[2];
const basePath = typeof argBasePath === 'string' ? argBasePath : process.env.NEXT_PUBLIC_BASE_PATH || '';

const env = { ...process.env, NEXT_PUBLIC_STATIC_EXPORT: 'true' };
if (basePath) {
    env.NEXT_PUBLIC_BASE_PATH = basePath;
} else {
    delete env.NEXT_PUBLIC_BASE_PATH;
}

function moveModalOut() {
    if (!fs.existsSync(interceptDir)) {
        console.log('No intercepting route directory found. Skipping removal.');
        return false;
    }
    if (fs.existsSync(stashInterceptDir)) {
        throw new Error('Stash directory already exists. Restore it before building.');
    }
    fs.mkdirSync(stashDir, { recursive: true });
    fs.renameSync(interceptDir, stashInterceptDir);
    console.log('Temporarily moved intercepting routes for export.');
    return true;
}

function restoreModal(moved) {
    if (!moved) return;
    if (fs.existsSync(stashInterceptDir)) {
        fs.renameSync(stashInterceptDir, interceptDir);
        console.log('Restored intercepting routes after export build.');
    }
    if (fs.existsSync(stashDir) && fs.readdirSync(stashDir).length === 0) {
        fs.rmdirSync(stashDir);
    }
}

function clearBuildArtifacts() {
    if (fs.existsSync(nextDir)) {
        fs.rmSync(nextDir, { recursive: true, force: true });
        console.log('Removed .next for a clean export build.');
    }
    if (fs.existsSync(outDir)) {
        fs.rmSync(outDir, { recursive: true, force: true });
        console.log('Removed out for a clean export build.');
    }
}

function runBuild() {
    const result = spawnSync('npm run build', { stdio: 'inherit', env, shell: true });
    if (result.error) {
        throw result.error;
    }
    if (typeof result.status === 'number') {
        return result.status;
    }
    return result.signal ? 1 : 0;
}

try {
    console.log(`Static export mode. basePath: ${basePath || '(none)'}`);
    const moved = moveModalOut();
    let exitCode = 0;
    try {
        clearBuildArtifacts();
        exitCode = runBuild();
    } finally {
        restoreModal(moved);
    }
    if (exitCode !== 0) {
        process.exit(exitCode);
    }
} catch (err) {
    console.error(err.message || err);
    process.exit(1);
}
