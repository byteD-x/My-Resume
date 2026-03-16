#!/usr/bin/env bash
set -euo pipefail

# Inputs:
# - APP_DIR, SOURCE_DIR, REPO_URL, DEPLOY_BRANCH, GIT_REMOTE
# - NODE_BIN, SERVICE_NAME, BIND_HOST, APP_PORT, SITE_URL
# - KEEP_RELEASES, FORCE_DEPLOY
# Output:
# - Updates ${APP_DIR}/current to a validated standalone release.
# Failure:
# - Exits non-zero and leaves the current release symlink untouched.

APP_DIR="${APP_DIR:-/var/www/portfolio}"
SOURCE_DIR="${SOURCE_DIR:-${APP_DIR}/source}"
REPO_URL="${REPO_URL:-https://github.com/byteD-x/My-Resume.git}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
GIT_REMOTE="${GIT_REMOTE:-origin}"
NODE_BIN="${NODE_BIN:-/root/.local/share/mise/installs/node/22.22.1/bin/node}"
SERVICE_NAME="${SERVICE_NAME:-portfolio.service}"
BIND_HOST="${BIND_HOST:-127.0.0.1}"
APP_PORT="${APP_PORT:-3000}"
SITE_URL="${SITE_URL:-http://106.12.154.163}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"
FORCE_DEPLOY="${FORCE_DEPLOY:-0}"

NPM_BIN="$(dirname "${NODE_BIN}")/npm"
RELEASES_DIR="${APP_DIR}/releases"
CURRENT_LINK="${APP_DIR}/current"
STATE_DIR="${APP_DIR}/.deploy-state"
LAST_SHA_FILE="${STATE_DIR}/last_deployed_sha"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_cmd git
require_cmd curl
require_cmd systemctl

if [ ! -x "${NODE_BIN}" ]; then
  echo "Node binary not found or not executable: ${NODE_BIN}" >&2
  exit 1
fi

if [ ! -x "${NPM_BIN}" ]; then
  echo "npm binary not found or not executable: ${NPM_BIN}" >&2
  exit 1
fi

mkdir -p "${APP_DIR}" "${RELEASES_DIR}" "${STATE_DIR}"

if [ ! -d "${SOURCE_DIR}/.git" ]; then
  git clone --depth 1 --branch "${DEPLOY_BRANCH}" "${REPO_URL}" "${SOURCE_DIR}"
fi

cd "${SOURCE_DIR}"
git remote set-url "${GIT_REMOTE}" "${REPO_URL}"
git fetch --depth 1 "${GIT_REMOTE}" "${DEPLOY_BRANCH}"

target_sha="$(git rev-parse FETCH_HEAD)"
current_sha="$(cat "${LAST_SHA_FILE}" 2>/dev/null || true)"

if [ "${FORCE_DEPLOY}" != "1" ] && [ "${target_sha}" = "${current_sha}" ] && [ -L "${CURRENT_LINK}" ]; then
  echo "No new commit to deploy: ${target_sha}"
  exit 0
fi

# This clone is dedicated to deployment, so cleaning build leftovers is intentional.
git checkout --force "${target_sha}"
git clean -fdx

env \
  SKIP_GITHUB_FETCH=1 \
  NEXT_PUBLIC_SITE_URL="${SITE_URL}" \
  "${NPM_BIN}" ci

env \
  SKIP_GITHUB_FETCH=1 \
  NEXT_PUBLIC_SITE_URL="${SITE_URL}" \
  "${NPM_BIN}" run build

if [ ! -f .next/standalone/server.js ]; then
  echo "Missing standalone server.js after build" >&2
  exit 1
fi

release_id="$(date -u +'%Y%m%d%H%M%S')-$(printf '%s' "${target_sha}" | cut -c1-7)"
release_dir="${RELEASES_DIR}/${release_id}"

mkdir -p "${release_dir}/.next"
cp -R .next/standalone/. "${release_dir}/"
cp -R .next/static "${release_dir}/.next/static"

if [ -d public ]; then
  cp -R public "${release_dir}/public"
fi

cat > "/etc/systemd/system/${SERVICE_NAME}" <<SYSTEMD
[Unit]
Description=Portfolio (Next.js standalone)
After=network.target

[Service]
Type=simple
WorkingDirectory=${CURRENT_LINK}
Environment=NODE_ENV=production
Environment=NEXT_TELEMETRY_DISABLED=1
Environment=NEXT_PUBLIC_SITE_URL=${SITE_URL}
Environment=PORT=${APP_PORT}
Environment=HOSTNAME=${BIND_HOST}
ExecStart=${NODE_BIN} server.js
Restart=always
RestartSec=3
StandardOutput=journal
StandardError=journal
SyslogIdentifier=portfolio

[Install]
WantedBy=multi-user.target
SYSTEMD

ln -sfn "${release_dir}" "${CURRENT_LINK}"

systemctl daemon-reload
systemctl enable "${SERVICE_NAME}"
systemctl restart "${SERVICE_NAME}"

for n in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS --max-time 5 "http://${BIND_HOST}:${APP_PORT}/" >/dev/null; then
    printf '%s\n' "${target_sha}" > "${LAST_SHA_FILE}"

    cd "${RELEASES_DIR}"
    ls -1dt */ 2>/dev/null | tail -n +"$((KEEP_RELEASES + 1))" | while IFS= read -r dir; do
      [ -n "${dir}" ] && rm -rf -- "${dir}"
    done

    echo "Deploy finished: ${release_id}"
    exit 0
  fi
  sleep 2
done

echo "Health check failed after deploy" >&2
systemctl status --no-pager -n 100 "${SERVICE_NAME}" || true
journalctl -u "${SERVICE_NAME}" --no-pager -n 150 || true
ss -ltnp | grep ":${APP_PORT}" || true
exit 1
