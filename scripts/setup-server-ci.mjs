import { spawnSync } from "node:child_process";
import process from "node:process";

const config = {
    serverHost: process.env.SERVER_HOST || "106.12.154.163",
    serverUser: process.env.SERVER_USER || "root",
    serverPort: process.env.SERVER_PORT || "22",
    serverGitDir: process.env.SERVER_GIT_DIR || "/var/git/portfolio.git",
    serverAppDir: process.env.SERVER_APP_DIR || "/var/www/portfolio",
    serverServiceName: process.env.SERVER_SERVICE_NAME || "portfolio.service",
    serverNodeBin:
        process.env.SERVER_NODE_BIN ||
        "/root/.local/share/mise/installs/node/22.22.1/bin/node",
    serverNpmCli:
        process.env.SERVER_NPM_CLI ||
        "/root/.local/share/mise/installs/node/22.22.1/lib/node_modules/npm/bin/npm-cli.js",
    serverBindHost: process.env.SERVER_BIND_HOST || "127.0.0.1",
    serverAppPort: process.env.SERVER_APP_PORT || "3000",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://106.12.154.163",
    keepReleases: process.env.KEEP_RELEASES || "5",
    localOriginRemote: process.env.LOCAL_ORIGIN_REMOTE || "origin",
    localServerRemote: process.env.LOCAL_SERVER_REMOTE || "server",
};

function run(command, args, options = {}) {
    const stdio = options.capture
        ? ["ignore", "pipe", "pipe"]
        : options.input !== undefined
          ? ["pipe", "inherit", "inherit"]
          : "inherit";
    const result = spawnSync(command, args, {
        stdio,
        encoding: options.capture ? "utf8" : undefined,
        input: options.input,
        shell: options.shell ?? false,
    });

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        const stderr = options.capture ? result.stderr.trim() : "";
        throw new Error(stderr || `${command} exited with code ${result.status}`);
    }

    return options.capture ? result.stdout.trim() : "";
}

function singleQuote(value) {
    return `'${String(value).replace(/'/g, `'\"'\"'`)}'`;
}

function renderHook() {
    const deployDir = `${config.serverAppDir}/deploy`;
    const dispatchScript = `${config.serverAppDir}/bin/dispatch-deploy.sh`;

    return `#!/usr/bin/env bash
set -euo pipefail

deploy_dir=${singleQuote(deployDir)}
dispatch_script=${singleQuote(dispatchScript)}

while read -r oldrev newrev refname; do
  [ "$refname" = "refs/heads/main" ] || continue
  case "$newrev" in
    0000000000000000000000000000000000000000) continue ;;
  esac

  mkdir -p "$deploy_dir"
  printf '%s\\n' "$newrev" > "$deploy_dir/target-sha"

  unit="portfolio-deploy-$(date -u +%s)-\${newrev:0:12}"
  systemd-run --unit "$unit" --quiet --collect /bin/bash "$dispatch_script" >/dev/null 2>&1 || true
done
`;
}

function renderDispatchScript() {
    const deployDir = `${config.serverAppDir}/deploy`;
    const runScript = `${config.serverAppDir}/bin/run-deploy.sh`;

    return `#!/usr/bin/env bash
set -euo pipefail

deploy_dir=${singleQuote(deployDir)}
log_dir="$deploy_dir/logs"
lock_file="$deploy_dir/deploy.lock"
run_script=${singleQuote(runScript)}

mkdir -p "$deploy_dir" "$log_dir"
exec 9>"$lock_file"
flock 9

target_sha="$(tr -d ' \\r\\n' < "$deploy_dir/target-sha" 2>/dev/null || true)"
[ -n "$target_sha" ] || exit 0

started_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
log_stamp="$(date -u +%Y%m%dT%H%M%SZ)"
log_path="$log_dir/$log_stamp-\${target_sha:0:12}.log"
: > "$log_path"
ln -sfn "$log_path" "$deploy_dir/latest.log"

cat > "$deploy_dir/last-result.env" <<EOF
LAST_STATUS=running
TARGET_SHA=$target_sha
STARTED_AT=$started_at
MESSAGE=deployment queued
EOF

/bin/bash "$run_script" >>"$log_path" 2>&1
`;
}

function renderRunDeployScript() {
    const repoDir = `${config.serverAppDir}/repo`;
    const deployDir = `${config.serverAppDir}/deploy`;
    const releasesDir = `${config.serverAppDir}/releases`;

    return `#!/usr/bin/env bash
set -euo pipefail

git_dir=${singleQuote(config.serverGitDir)}
app_dir=${singleQuote(config.serverAppDir)}
repo_dir=${singleQuote(repoDir)}
deploy_dir=${singleQuote(deployDir)}
releases_dir=${singleQuote(releasesDir)}
current_link=${singleQuote(`${config.serverAppDir}/current`)}
service_name=${singleQuote(config.serverServiceName)}
node_bin=${singleQuote(config.serverNodeBin)}
npm_cli=${singleQuote(config.serverNpmCli)}
bind_host=${singleQuote(config.serverBindHost)}
app_port=${singleQuote(config.serverAppPort)}
site_url=${singleQuote(config.siteUrl)}
keep_releases=${singleQuote(config.keepReleases)}
npm_cache_dir=${singleQuote(`${config.serverAppDir}/.npm-cache`)}
target_sha_file="$deploy_dir/target-sha"
current_sha_file="$deploy_dir/current-sha"
last_result_file="$deploy_dir/last-result.env"

timestamp() {
  date -u +%Y-%m-%dT%H:%M:%SZ
}

write_result() {
  status="$1"
  message="$2"
  finished_at="$(timestamp)"

  cat > "$last_result_file" <<EOF
LAST_STATUS=$status
TARGET_SHA=\${target_sha:-}
CURRENT_SHA=\${current_sha:-}
RELEASE_ID=\${release_id:-}
STARTED_AT=\${started_at:-}
FINISHED_AT=$finished_at
MESSAGE=$message
EOF
}

rollback() {
  exit_code="$1"

  if [ "$exit_code" -ne 0 ]; then
    if [ -n "\${previous_target:-}" ] && [ -e "$previous_target/server.js" ]; then
      ln -sfn "$previous_target" "$current_link"
      systemctl restart "$service_name" || true
    fi

    write_result "failed" "deployment failed, rollback attempted"
  fi
}

started_at="$(timestamp)"
release_id=""
previous_target=""
current_sha="$(tr -d ' \\r\\n' < "$current_sha_file" 2>/dev/null || true)"
target_sha="$(tr -d ' \\r\\n' < "$target_sha_file" 2>/dev/null || true)"

trap 'code=$?; rollback "$code"; exit "$code"' EXIT

mkdir -p "$repo_dir" "$deploy_dir" "$releases_dir" "$npm_cache_dir"

if [ -z "$target_sha" ]; then
  write_result "noop" "missing target sha"
  trap - EXIT
  exit 0
fi

if [ ! -x "$node_bin" ]; then
  echo "Node binary not found: $node_bin" >&2
  exit 1
fi

if [ ! -f "$npm_cli" ]; then
  echo "npm cli not found: $npm_cli" >&2
  exit 1
fi

if [ "$current_sha" = "$target_sha" ] && [ -L "$current_link" ]; then
  write_result "noop" "target already deployed"
  trap - EXIT
  exit 0
fi

echo "[$started_at] target sha: $target_sha"
git --git-dir="$git_dir" rev-parse --verify "$target_sha^{commit}" >/dev/null
git --git-dir="$git_dir" --work-tree="$repo_dir" checkout -f "$target_sha"
git --git-dir="$git_dir" --work-tree="$repo_dir" clean -fdx

"$node_bin" -v
"$node_bin" "$npm_cli" -v

(
  cd "$repo_dir"
  export CI=1
  export PATH="$(dirname "$node_bin"):$PATH"
  export npm_config_cache="$npm_cache_dir"
  "$node_bin" "$npm_cli" ci --no-audit --no-fund
  SKIP_GITHUB_FETCH=1 NEXT_PUBLIC_SITE_URL="$site_url" "$node_bin" "$npm_cli" run build
)

short_sha="$(printf '%s' "$target_sha" | cut -c1-12)"
release_id="$(date -u +%Y%m%d%H%M%S)-$short_sha"
release_dir="$releases_dir/$release_id"
mkdir -p "$release_dir/.next"
cp -a "$repo_dir/.next/standalone/." "$release_dir/"
cp -a "$repo_dir/.next/static" "$release_dir/.next/static"

if [ -d "$repo_dir/public" ]; then
  cp -a "$repo_dir/public" "$release_dir/public"
fi

printf '%s\\n' "$target_sha" > "$release_dir/REVISION"
previous_target="$(readlink -f "$current_link" 2>/dev/null || true)"

ln -sfn "$release_dir" "$current_link"
systemctl daemon-reload
systemctl restart "$service_name"

for _ in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS --max-time 5 "http://$bind_host:$app_port/" >/dev/null; then
    printf '%s\\n' "$target_sha" > "$current_sha_file"
    current_sha="$target_sha"
    write_result "success" "deployment finished"

    cd "$releases_dir"
    ls -1dt */ 2>/dev/null | tail -n "+$((keep_releases + 1))" | while IFS= read -r dir; do
      [ -n "$dir" ] && rm -rf -- "$dir"
    done

    trap - EXIT
    exit 0
  fi

  sleep 2
done

echo "Health check failed" >&2
systemctl status --no-pager -n 50 "$service_name" || true
journalctl -u "$service_name" --no-pager -n 120 || true
ss -ltnp | grep ":$app_port" || true
exit 1
`;
}

function renderServiceFile() {
    return `[Unit]
Description=Portfolio (Next.js standalone)
After=network.target

[Service]
Type=simple
WorkingDirectory=${config.serverAppDir}/current
Environment=NODE_ENV=production
Environment=NEXT_TELEMETRY_DISABLED=1
Environment=NEXT_PUBLIC_SITE_URL=${config.siteUrl}
Environment=PORT=${config.serverAppPort}
Environment=HOSTNAME=${config.serverBindHost}
ExecStart=${config.serverNodeBin} server.js
Restart=always
RestartSec=3
StandardOutput=journal
StandardError=journal
SyslogIdentifier=portfolio

[Install]
WantedBy=multi-user.target
`;
}

function buildRemoteBootstrapScript() {
    const hookContent = renderHook();
    const dispatchContent = renderDispatchScript();
    const runDeployContent = renderRunDeployScript();
    const serviceContent = renderServiceFile();
    const binDir = `${config.serverAppDir}/bin`;
    const deployDir = `${config.serverAppDir}/deploy`;
    const releasesDir = `${config.serverAppDir}/releases`;
    const repoDir = `${config.serverAppDir}/repo`;

    return `set -euo pipefail

git_dir=${singleQuote(config.serverGitDir)}
app_dir=${singleQuote(config.serverAppDir)}
bin_dir=${singleQuote(binDir)}
deploy_dir=${singleQuote(deployDir)}
releases_dir=${singleQuote(releasesDir)}
repo_dir=${singleQuote(repoDir)}
service_name=${singleQuote(config.serverServiceName)}

mkdir -p "$(dirname "$git_dir")" "$app_dir" "$bin_dir" "$deploy_dir/logs" "$releases_dir" "$repo_dir"

if [ ! -d "$git_dir" ]; then
  git init --bare "$git_dir"
fi

git --git-dir="$git_dir" symbolic-ref HEAD refs/heads/main

cat > "$git_dir/hooks/post-receive" <<'HOOK'
${hookContent}
HOOK
chmod +x "$git_dir/hooks/post-receive"

cat > "$bin_dir/dispatch-deploy.sh" <<'DISPATCH'
${dispatchContent}
DISPATCH
chmod +x "$bin_dir/dispatch-deploy.sh"

cat > "$bin_dir/run-deploy.sh" <<'RUNDEPLOY'
${runDeployContent}
RUNDEPLOY
chmod +x "$bin_dir/run-deploy.sh"

cat > "/etc/systemd/system/$service_name" <<'SERVICE'
${serviceContent}
SERVICE

systemctl daemon-reload
systemctl enable "$service_name" >/dev/null 2>&1 || true

touch "$deploy_dir/target-sha" "$deploy_dir/current-sha"
echo "server-ci bootstrap finished"
`;
}

function ensureLocalGitConfig() {
    const originUrl = run("git", ["remote", "get-url", config.localOriginRemote], { capture: true });
    const serverUrl = `ssh://${config.serverUser}@${config.serverHost}:${config.serverPort}${config.serverGitDir}`;
    const remotes = run("git", ["remote"], { capture: true })
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);

    if (remotes.includes(config.localServerRemote)) {
        run("git", ["remote", "set-url", config.localServerRemote, serverUrl]);
    } else {
        run("git", ["remote", "add", config.localServerRemote, serverUrl]);
    }

    try {
        run("git", ["config", "--unset-all", `remote.${config.localOriginRemote}.pushurl`], {
            capture: true,
        });
    } catch {
        // No existing pushurl values is fine.
    }
    run("git", ["remote", "set-url", "--push", config.localOriginRemote, originUrl]);
    run("git", ["remote", "set-url", "--add", "--push", config.localOriginRemote, serverUrl]);

    return { originUrl, serverUrl };
}

function main() {
    const sshTarget = `${config.serverUser}@${config.serverHost}`;
    const remoteScript = buildRemoteBootstrapScript();

    run("ssh", [
        "-o",
        "StrictHostKeyChecking=no",
        "-p",
        config.serverPort,
        sshTarget,
        "bash -s",
    ], { input: remoteScript });

    const { originUrl, serverUrl } = ensureLocalGitConfig();
    console.log(`Origin fetch URL: ${originUrl}`);
    console.log(`Origin push URLs: ${originUrl}, ${serverUrl}`);
    console.log(`Server remote: ${config.localServerRemote} -> ${serverUrl}`);
}

main();
