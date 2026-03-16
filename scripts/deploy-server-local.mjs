import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sshNullConfig = process.platform === "win32" ? "NUL" : "/dev/null";
const npmExecPath = process.env.npm_execpath;

const config = {
    serverHost: process.env.SERVER_HOST || "106.12.154.163",
    serverUser: process.env.SERVER_USER || "root",
    serverPort: process.env.SERVER_PORT || "22",
    serverAppDir: process.env.SERVER_APP_DIR || "/var/www/portfolio",
    serverServiceName: process.env.SERVER_SERVICE_NAME || "portfolio.service",
    serverNodeBin:
        process.env.SERVER_NODE_BIN ||
        "/root/.local/share/mise/installs/node/22.22.1/bin/node",
    serverBindHost: process.env.SERVER_BIND_HOST || "127.0.0.1",
    serverAppPort: process.env.SERVER_APP_PORT || "3000",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://106.12.154.163",
    keepReleases: process.env.KEEP_RELEASES || "5",
    skipBuild: process.env.SKIP_BUILD === "1",
};

function run(command, args, options = {}) {
    const result = spawnSync(command, args, {
        cwd: rootDir,
        stdio: "inherit",
        env: { ...process.env, ...options.env },
        input: options.input,
        shell: options.shell || false,
    });

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        throw new Error(`${command} exited with code ${result.status}`);
    }
}

function runNpm(args, options = {}) {
    if (npmExecPath) {
        run(process.execPath, [npmExecPath, ...args], options);
        return;
    }

    const fallbackCommand = process.platform === "win32" ? "npm.cmd" : "npm";
    run(fallbackCommand, args, {
        ...options,
        shell: process.platform === "win32",
    });
}

function capture(command, args) {
    const result = spawnSync(command, args, {
        cwd: rootDir,
        stdio: ["ignore", "pipe", "inherit"],
        encoding: "utf8",
    });

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        throw new Error(`${command} exited with code ${result.status}`);
    }

    return result.stdout.trim();
}

function ensureSupportedNode() {
    const [major, minor] = process.versions.node.split(".").map(Number);
    if (major < 20 || (major === 20 && minor < 9)) {
        throw new Error(
            `Local Node.js ${process.versions.node} is too old. Use >= 20.9.0 before deploying.`,
        );
    }
}

function utcTimestamp() {
    const now = new Date();
    const parts = [
        now.getUTCFullYear(),
        String(now.getUTCMonth() + 1).padStart(2, "0"),
        String(now.getUTCDate()).padStart(2, "0"),
        String(now.getUTCHours()).padStart(2, "0"),
        String(now.getUTCMinutes()).padStart(2, "0"),
        String(now.getUTCSeconds()).padStart(2, "0"),
    ];
    return parts.join("");
}

function packageBundle(tempDir) {
    const bundleDir = join(tempDir, "deploy_bundle");
    const archivePath = join(tempDir, "deploy.tgz");
    const standaloneDir = join(rootDir, ".next", "standalone");
    const staticDir = join(rootDir, ".next", "static");
    const publicDir = join(rootDir, "public");

    if (!existsSync(join(standaloneDir, "server.js"))) {
        throw new Error("Missing .next/standalone/server.js. Build did not produce a standalone bundle.");
    }

    mkdirSync(join(bundleDir, ".next"), { recursive: true });
    cpSync(standaloneDir, bundleDir, { recursive: true });
    cpSync(staticDir, join(bundleDir, ".next", "static"), { recursive: true });

    if (existsSync(publicDir)) {
        cpSync(publicDir, join(bundleDir, "public"), { recursive: true });
    }

    run("tar", ["-czf", archivePath, "-C", bundleDir, "."]);
    return archivePath;
}

function main() {
    ensureSupportedNode();

    const gitSha = capture("git", ["rev-parse", "--short=7", "HEAD"]) || "local";
    const dirty = capture("git", ["status", "--porcelain"]);
    const releaseId = `${utcTimestamp()}-${gitSha}${dirty ? "-dirty" : ""}`;
    const releaseDir = `${config.serverAppDir}/releases/${releaseId}`;
    const tempDir = mkdtempSync(join(tmpdir(), "portfolio-deploy-"));

    if (dirty) {
        console.warn("Working tree has uncommitted changes. Deploying the current local contents.");
    }

    try {
        if (!config.skipBuild) {
            runNpm(["run", "build"], {
                env: {
                    SKIP_GITHUB_FETCH: "1",
                    NEXT_PUBLIC_SITE_URL: config.siteUrl,
                },
            });
        }

        const archivePath = packageBundle(tempDir);
        const sshTarget = `${config.serverUser}@${config.serverHost}`;
        const sshBaseArgs = [
            "-F",
            sshNullConfig,
            "-o",
            "StrictHostKeyChecking=no",
            "-o",
            `UserKnownHostsFile=${sshNullConfig}`,
            "-o",
            "ConnectTimeout=10",
            "-p",
            config.serverPort,
        ];

        run("ssh", [...sshBaseArgs, sshTarget, `mkdir -p '${releaseDir}'`]);

        run("scp", [
            "-O",
            "-F",
            sshNullConfig,
            "-o",
            "StrictHostKeyChecking=no",
            "-o",
            `UserKnownHostsFile=${sshNullConfig}`,
            "-o",
            "ConnectTimeout=10",
            "-P",
            config.serverPort,
            archivePath,
            `${sshTarget}:${releaseDir}/deploy.tgz`,
        ]);

        const remoteScript = `
set -euo pipefail

release_dir="${releaseDir}"
app_dir="${config.serverAppDir}"
service_name="${config.serverServiceName}"
node_bin="${config.serverNodeBin}"
bind_host="${config.serverBindHost}"
app_port="${config.serverAppPort}"
site_url="${config.siteUrl}"
keep_releases="${config.keepReleases}"

cd "\${release_dir}"
tar -xzf deploy.tgz
rm -f deploy.tgz

if [ ! -f server.js ]; then
  echo "Missing standalone server.js after extract" >&2
  exit 1
fi

if [ ! -x "\${node_bin}" ]; then
  echo "Node binary not found or not executable: \${node_bin}" >&2
  exit 1
fi

cat > "/etc/systemd/system/\${service_name}" <<SYSTEMD
[Unit]
Description=Portfolio (Next.js standalone)
After=network.target

[Service]
Type=simple
WorkingDirectory=\${app_dir}/current
Environment=NODE_ENV=production
Environment=NEXT_TELEMETRY_DISABLED=1
Environment=NEXT_PUBLIC_SITE_URL=\${site_url}
Environment=PORT=\${app_port}
Environment=HOSTNAME=\${bind_host}
ExecStart=\${node_bin} server.js
Restart=always
RestartSec=3
StandardOutput=journal
StandardError=journal
SyslogIdentifier=portfolio

[Install]
WantedBy=multi-user.target
SYSTEMD

ln -sfn "\${release_dir}" "\${app_dir}/current"
systemctl daemon-reload
systemctl enable "\${service_name}"
systemctl restart "\${service_name}"

for n in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS --max-time 5 "http://\${bind_host}:\${app_port}/" >/dev/null; then
    cd "\${app_dir}/releases"
    ls -1dt */ 2>/dev/null | tail -n +"$((keep_releases + 1))" | while IFS= read -r dir; do
      [ -n "\${dir}" ] && rm -rf -- "\${dir}"
    done
    exit 0
  fi
  sleep 2
done

echo "Health check failed" >&2
systemctl status --no-pager -n 100 "\${service_name}" || true
journalctl -u "\${service_name}" --no-pager -n 150 || true
ss -ltnp | grep ":\${app_port}" || true
exit 1
`;

        run("ssh", [...sshBaseArgs, sshTarget, "bash -s"], { input: remoteScript });
        console.log(`Server deploy finished: ${releaseId}`);
    } finally {
        rmSync(tempDir, { recursive: true, force: true });
    }
}

main();
