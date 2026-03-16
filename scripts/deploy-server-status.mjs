import { spawnSync } from "node:child_process";
import process from "node:process";

const config = {
    serverHost: process.env.SERVER_HOST || "106.12.154.163",
    serverUser: process.env.SERVER_USER || "root",
    serverPort: process.env.SERVER_PORT || "22",
    serverAppDir: process.env.SERVER_APP_DIR || "/var/www/portfolio",
    serverServiceName: process.env.SERVER_SERVICE_NAME || "portfolio.service",
};

function runSsh(command) {
    const target = `${config.serverUser}@${config.serverHost}`;
    const args = [
        "-o",
        "StrictHostKeyChecking=no",
        "-p",
        config.serverPort,
        target,
        "bash -s",
    ];
    const result = spawnSync("ssh", args, {
        stdio: ["pipe", "pipe", "pipe"],
        encoding: "utf8",
        input: command,
    });

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        const stderr = result.stderr.trim();
        throw new Error(stderr || `ssh exited with code ${result.status}`);
    }

    return result.stdout.trim();
}

function printSection(title, content) {
    console.log(`\n=== ${title} ===`);
    console.log(content || "(empty)");
}

function main() {
    const deployDir = `${config.serverAppDir}/deploy`;
    const remoteScript = `
set -euo pipefail
deploy_dir=${JSON.stringify(deployDir)}
service_name=${JSON.stringify(config.serverServiceName)}
current_link=${JSON.stringify(`${config.serverAppDir}/current`)}

echo "[result]"
if [ -f "$deploy_dir/last-result.env" ]; then
  cat "$deploy_dir/last-result.env"
else
  echo "LAST_STATUS=unknown"
fi

echo "[target]"
if [ -f "$deploy_dir/target-sha" ]; then
  cat "$deploy_dir/target-sha"
fi

echo "[current]"
if [ -f "$deploy_dir/current-sha" ]; then
  cat "$deploy_dir/current-sha"
fi

echo "[release]"
readlink -f "$current_link" 2>/dev/null || true

echo "[service]"
systemctl is-active "$service_name" 2>/dev/null || true

echo "[deploy-units]"
systemctl list-units "portfolio-deploy-*" --no-legend --no-pager 2>/dev/null || true

echo "[log]"
latest_log=""
if [ -L "$deploy_dir/latest.log" ]; then
  latest_log="$(readlink -f "$deploy_dir/latest.log")"
elif [ -f "$deploy_dir/latest.log" ]; then
  latest_log="$deploy_dir/latest.log"
fi

if [ -n "$latest_log" ] && [ -f "$latest_log" ]; then
  tail -n 40 "$latest_log"
fi
`;

    const output = runSsh(remoteScript);
    const sections = {
        result: "",
        target: "",
        current: "",
        release: "",
        service: "",
        "deploy-units": "",
        log: "",
    };

    let current = null;
    for (const line of output.split(/\r?\n/)) {
        const marker = line.match(/^\[(.+)\]$/);
        if (marker) {
            current = marker[1];
            continue;
        }

        if (current && Object.hasOwn(sections, current)) {
            sections[current] += `${line}\n`;
        }
    }

    printSection("Last Result", sections.result.trim());
    printSection("Target SHA", sections.target.trim());
    printSection("Current SHA", sections.current.trim());
    printSection("Current Release", sections.release.trim());
    printSection("Runtime Service", sections.service.trim());
    printSection("Active Deploy Units", sections["deploy-units"].trim());
    printSection("Latest Deploy Log", sections.log.trim());
}

main();
