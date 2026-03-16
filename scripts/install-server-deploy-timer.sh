#!/usr/bin/env bash
set -euo pipefail

# Inputs:
# - APP_DIR, SOURCE_DIR, REPO_URL, DEPLOY_BRANCH, DEPLOY_INTERVAL
# - NODE_BIN, SERVICE_NAME, BIND_HOST, APP_PORT, SITE_URL
# Output:
# - Installs a systemd timer that keeps the server release in sync.
# Failure:
# - Exits non-zero if systemd units or the deploy script cannot be installed.

APP_DIR="${APP_DIR:-/var/www/portfolio}"
SOURCE_DIR="${SOURCE_DIR:-${APP_DIR}/source}"
REPO_URL="${REPO_URL:-https://github.com/byteD-x/My-Resume.git}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
DEPLOY_INTERVAL="${DEPLOY_INTERVAL:-1min}"
NODE_BIN="${NODE_BIN:-/root/.local/share/mise/installs/node/22.22.1/bin/node}"
SERVICE_NAME="${SERVICE_NAME:-portfolio.service}"
BIND_HOST="${BIND_HOST:-127.0.0.1}"
APP_PORT="${APP_PORT:-3000}"
SITE_URL="${SITE_URL:-http://106.12.154.163}"

mkdir -p "${APP_DIR}"

if [ ! -d "${SOURCE_DIR}/.git" ]; then
  git clone --depth 1 --branch "${DEPLOY_BRANCH}" "${REPO_URL}" "${SOURCE_DIR}"
fi

git -C "${SOURCE_DIR}" remote set-url origin "${REPO_URL}"
chmod +x "${SOURCE_DIR}/scripts/deploy-server.sh"

cat > /etc/systemd/system/portfolio-deploy.service <<SYSTEMD
[Unit]
Description=Deploy portfolio from GitHub to the local server
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
WorkingDirectory=${SOURCE_DIR}
Environment=APP_DIR=${APP_DIR}
Environment=SOURCE_DIR=${SOURCE_DIR}
Environment=REPO_URL=${REPO_URL}
Environment=DEPLOY_BRANCH=${DEPLOY_BRANCH}
Environment=NODE_BIN=${NODE_BIN}
Environment=SERVICE_NAME=${SERVICE_NAME}
Environment=BIND_HOST=${BIND_HOST}
Environment=APP_PORT=${APP_PORT}
Environment=SITE_URL=${SITE_URL}
ExecStart=${SOURCE_DIR}/scripts/deploy-server.sh
StandardOutput=journal
StandardError=journal
SYSTEMD

cat > /etc/systemd/system/portfolio-deploy.timer <<SYSTEMD
[Unit]
Description=Check for portfolio updates and deploy them locally

[Timer]
OnBootSec=1min
OnUnitActiveSec=${DEPLOY_INTERVAL}
AccuracySec=15s
Unit=portfolio-deploy.service

[Install]
WantedBy=timers.target
SYSTEMD

systemctl daemon-reload
systemctl enable --now portfolio-deploy.timer
systemctl start portfolio-deploy.service

echo "SERVER_DEPLOY_TIMER_OK"
