import { spawnSync } from "node:child_process";
import process from "node:process";

function parseCsv(value) {
    return String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

const config = {
    serverHost: process.env.SERVER_HOST || "106.12.154.163",
    serverUser: process.env.SERVER_USER || "root",
    serverPort: process.env.SERVER_PORT || "22",
    canonicalHost: process.env.SERVER_CANONICAL_HOST || "www.byted.online",
    additionalDomains: parseCsv(process.env.SERVER_ADDITIONAL_DOMAINS),
    redirectHosts: parseCsv(process.env.SERVER_REDIRECT_HOSTS || "106.12.154.163"),
    certName: process.env.SERVER_CERT_NAME || process.env.SERVER_CANONICAL_HOST || "www.byted.online",
    certbotInstall: process.env.SERVER_CERTBOT_INSTALL || "venv",
    certbotVenvDir: process.env.SERVER_CERTBOT_VENV_DIR || "/opt/certbot",
    nginxSitePath: process.env.SERVER_NGINX_SITE_PATH || "/etc/nginx/sites-enabled/portfolio",
    acmeDir: process.env.SERVER_ACME_DIR || "/var/www/acme-challenge",
    serverBindHost: process.env.SERVER_BIND_HOST || "127.0.0.1",
    serverAppPort: process.env.SERVER_APP_PORT || "3000",
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

function uniqueHosts(items) {
    return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function renderBootstrapHttpConfig(serverNames, canonicalHost) {
    return `server {
  listen 80 default_server;
  listen [::]:80 default_server;

  server_name ${serverNames.join(" ")};

  location ^~ /.well-known/acme-challenge/ {
    alias ${config.acmeDir}/;
    default_type "text/plain";
  }

  location / {
    return 301 https://${canonicalHost}$request_uri;
  }
}
`;
}

function renderFinalHttpsConfig(serverNames, canonicalHost, certName) {
    const certDir = `/etc/letsencrypt/live/${certName}`;

    return `server {
  listen 80 default_server;
  listen [::]:80 default_server;

  server_name ${serverNames.join(" ")};

  location ^~ /.well-known/acme-challenge/ {
    alias ${config.acmeDir}/;
    default_type "text/plain";
  }

  location / {
    return 301 https://${canonicalHost}$request_uri;
  }
}

server {
  listen 443 ssl http2 default_server;
  listen [::]:443 ssl http2 default_server;

  server_name ${canonicalHost};

  ssl_certificate ${certDir}/fullchain.pem;
  ssl_certificate_key ${certDir}/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_session_cache shared:SSL:10m;
  ssl_session_timeout 1d;

  location / {
    proxy_pass http://${config.serverBindHost}:${config.serverAppPort};
    proxy_http_version 1.1;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection upgrade;
  }
}
`;
}

function buildRemoteScript() {
    const domainSet = uniqueHosts([config.canonicalHost, ...config.additionalDomains]);
    const serverNames = uniqueHosts([...domainSet, ...config.redirectHosts]);
    const bootstrapConfig = renderBootstrapHttpConfig(serverNames, config.canonicalHost);
    const finalConfig = renderFinalHttpsConfig(serverNames, config.canonicalHost, config.certName);
    const certbotDomainArgs = domainSet.map((domain) => `-d ${singleQuote(domain)}`).join(" ");

    return `set -euo pipefail

canonical_host=${singleQuote(config.canonicalHost)}
cert_name=${singleQuote(config.certName)}
certbot_install=${singleQuote(config.certbotInstall)}
certbot_venv_dir=${singleQuote(config.certbotVenvDir)}
nginx_site_path=${singleQuote(config.nginxSitePath)}
acme_dir=${singleQuote(config.acmeDir)}
renew_hook=${singleQuote("/etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh")}
renew_service=${singleQuote("/etc/systemd/system/portfolio-certbot-renew.service")}
renew_timer=${singleQuote("/etc/systemd/system/portfolio-certbot-renew.timer")}
backup_path="/tmp/$(basename "$nginx_site_path").bak.$(date -u +%Y%m%d%H%M%S)"
restore_needed=0
certbot_bin=""

restore_config() {
  if [ "$restore_needed" -eq 1 ] && [ -f "$backup_path" ]; then
    cp "$backup_path" "$nginx_site_path"
    nginx -t
    systemctl reload nginx
  fi
}

trap restore_config EXIT

if command -v certbot >/dev/null 2>&1; then
  certbot_bin="$(command -v certbot)"
elif [ "$certbot_install" = "venv" ]; then
  python3 -m venv "$certbot_venv_dir"
  "$certbot_venv_dir/bin/pip" install --upgrade pip setuptools wheel >/dev/null
  "$certbot_venv_dir/bin/pip" install --upgrade certbot >/dev/null
  ln -sf "$certbot_venv_dir/bin/certbot" /usr/local/bin/certbot
  certbot_bin="$certbot_venv_dir/bin/certbot"
else
  echo "Unsupported certbot install method: $certbot_install" >&2
  exit 1
fi

if [ -z "$certbot_bin" ] || [ ! -x "$certbot_bin" ]; then
  echo "certbot is not available after installation" >&2
  exit 1
fi

mkdir -p "$acme_dir" "$(dirname "$nginx_site_path")" /etc/letsencrypt/renewal-hooks/deploy

if [ -f "$nginx_site_path" ]; then
  cp "$nginx_site_path" "$backup_path"
  restore_needed=1
fi

cat > "$nginx_site_path" <<'BOOTSTRAPCONF'
${bootstrapConfig}
BOOTSTRAPCONF

nginx -t
systemctl reload nginx

"$certbot_bin" certonly \\
  --non-interactive \\
  --agree-tos \\
  --register-unsafely-without-email \\
  --webroot \\
  -w "$acme_dir" \\
  --cert-name "$cert_name" \\
  ${certbotDomainArgs}

cat > "$renew_hook" <<'HOOK'
#!/usr/bin/env bash
set -euo pipefail
systemctl reload nginx
HOOK
chmod +x "$renew_hook"

cat > "$renew_service" <<SERVICE
[Unit]
Description=Renew Let's Encrypt certificates for portfolio
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=$certbot_bin renew --quiet
SERVICE

cat > "$renew_timer" <<'TIMER'
[Unit]
Description=Twice-daily renewal checks for portfolio certificates

[Timer]
OnBootSec=5min
OnUnitActiveSec=12h
RandomizedDelaySec=10min
Persistent=true
Unit=portfolio-certbot-renew.service

[Install]
WantedBy=timers.target
TIMER

systemctl daemon-reload
systemctl enable --now portfolio-certbot-renew.timer >/dev/null 2>&1

cat > "$nginx_site_path" <<'HTTPSCONF'
${finalConfig}
HTTPSCONF

nginx -t
systemctl reload nginx

restore_needed=0

echo "HTTPS setup complete for $canonical_host"
"$certbot_bin" certificates
`;
}

function main() {
    const sshTarget = `${config.serverUser}@${config.serverHost}`;
    const remoteScript = buildRemoteScript();

    run(
        "ssh",
        [
            "-o",
            "StrictHostKeyChecking=no",
            "-p",
            config.serverPort,
            sshTarget,
            "bash -s",
        ],
        { input: remoteScript },
    );
}

main();
