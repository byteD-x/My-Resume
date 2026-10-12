/* eslint-disable */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const nextDir = path.join(rootDir, '.next');
const outDir = path.join(rootDir, 'out');

const argBasePath = process.argv[2];
const basePath = typeof argBasePath === 'string' ? argBasePath : process.env.NEXT_PUBLIC_BASE_PATH || '';

const env = {
    ...process.env,
    NEXT_PUBLIC_STATIC_EXPORT: 'true',
    NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'zh',
};
if (basePath) {
    env.NEXT_PUBLIC_BASE_PATH = basePath;
} else {
    delete env.NEXT_PUBLIC_BASE_PATH;
}

function clearBuildArtifacts() {
    if (fs.existsSync(nextDir)) {
        try {
            fs.rmSync(nextDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 150 });
        } catch (error) {
            const code = error && error.code;
            if (code === 'ENOTEMPTY' || code === 'EPERM' || code === 'EBUSY') {
                throw new Error(
                    `Failed to remove ".next" (${code}). ` +
                        'Make sure no `next dev` server is running (e.g. stop `npm run dev` / Playwright webServer) and retry.',
                );
            }
            throw error;
        }
        console.log('Removed .next for a clean export build.');
    }
    if (fs.existsSync(outDir)) {
        try {
            fs.rmSync(outDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 150 });
        } catch (error) {
            const code = error && error.code;
            if (code === 'ENOTEMPTY' || code === 'EPERM' || code === 'EBUSY') {
                throw new Error(
                    `Failed to remove "out" (${code}). Close any file watchers locking the folder and retry.`,
                );
            }
            throw error;
        }
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

function runImageOptimizer() {
    const result = spawnSync('npm run optimize:images', { stdio: 'inherit', env, shell: true });
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
    clearBuildArtifacts();
    let exitCode = runBuild();
    if (exitCode === 0) {
        // Keep image optimization in static export while regular build stays fast.
        exitCode = runImageOptimizer();
    }
    if (exitCode !== 0) {
        process.exit(exitCode);
    }
} catch (err) {
    console.error(err.message || err);
    process.exit(1);
}
