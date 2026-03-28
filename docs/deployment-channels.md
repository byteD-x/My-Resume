# Deployment Channels

This project publishes through three separate channels:

## Public URLs

- `International site (Vercel)`: `https://my-resume-gray-five.vercel.app`
- `GitHub site (Pages)`: `https://byted-x.github.io/My-Resume/`
- `China mainland site (Self-hosted)`: `https://www.byted.online`
- `China mainland site fallback (Self-hosted IP)`: `https://106.12.154.163`

1. `Vercel`
   - Trigger: Vercel Git integration on `main`
   - Purpose: international site
   - URL: `https://my-resume-gray-five.vercel.app`
   - Verify: `curl -I https://my-resume-gray-five.vercel.app`

2. `GitHub Pages`
   - Trigger: `.github/workflows/pages.yml`
   - Purpose: GitHub-hosted static site
   - URL: `https://byted-x.github.io/My-Resume/`
   - Verify: `curl -I https://byted-x.github.io/My-Resume/`

3. `Self-hosted server`
   - Trigger: `git push` to the SSH bare repo on `106.12.154.163`
   - Purpose: China mainland site via standalone Next.js behind Nginx with a canonical domain
   - Public URLs:
     - canonical domain: `https://www.byted.online`
     -备案/证书切换完成前的 fallback IP: `https://106.12.154.163`
   - Pipeline:
     - local git push writes to both GitHub and the server bare repo
     - server `post-receive` hook records the target SHA
     - `systemd-run` starts an asynchronous deployment job
     - the server builds `next build` locally with Node 22, rotates the release symlink, restarts `portfolio.service`, and health-checks `127.0.0.1:3000`
   - Verify:
     - `npm run deploy:server:status`
     - `ssh root@106.12.154.163 "systemctl status portfolio.service --no-pager"`
     - `curl -I https://106.12.154.163`
     - `curl -I https://www.byted.online`

## Server Setup

Install or refresh the self-hosted CI channel:

```bash
npm run setup:server:ci
```

Enable or refresh domain HTTPS:

```bash
npm run setup:server:https
```

The HTTPS bootstrap installs an isolated `certbot` runtime on the server, writes a temporary HTTP ACME config, issues a certificate for `www.byted.online`, and then switches Nginx to the final HTTPS proxy config. If the domain is still blocked by ICP/备案 or upstream ingress policy, certificate issuance will fail until that network prerequisite is cleared.

After setup, plain `git push` to `origin` will push to both GitHub and the server because `origin` gets a second `pushurl`. The repository also keeps a dedicated `server` remote for direct troubleshooting.

Optional environment overrides for setup/status/deploy scripts:

- `SERVER_HOST`
- `SERVER_USER`
- `SERVER_PORT`
- `SERVER_GIT_DIR`
- `SERVER_APP_DIR`
- `SERVER_SERVICE_NAME`
- `SERVER_NODE_BIN`
- `SERVER_NPM_CLI`
- `SERVER_BIND_HOST`
- `SERVER_APP_PORT`
- `NEXT_PUBLIC_SITE_URL`
- `SERVER_CANONICAL_HOST`
- `SERVER_ADDITIONAL_DOMAINS`
- `SERVER_REDIRECT_HOSTS`
- `SERVER_IP_PUBLIC_URL`
- `KEEP_RELEASES`
- `LOCAL_ORIGIN_REMOTE`
- `LOCAL_SERVER_REMOTE`
- `SKIP_BUILD=1` to reuse an existing local build artifact

## Common Commands

Push all release channels:

```bash
git push
```

Explicit push helper:

```bash
npm run push:all
```

Check self-hosted deployment status:

```bash
npm run deploy:server:status
```

## Rollback

The active release is always the `/var/www/portfolio/current` symlink.
To roll back, repoint it to an older release under `/var/www/portfolio/releases/` and restart `portfolio.service`.

## Notes

- The self-hosted channel is intentionally independent of GitHub Actions. GitHub only receives the same git push and continues triggering `Vercel` plus `Pages`.
- The server build runs with `/root/.local/share/mise/installs/node/22.22.1/bin/node`, not the system default `node`.
- Public endpoint verification in `.github/workflows/pages.yml` always checks `Vercel`, `GitHub Pages`, and the self-hosted IP endpoint. The self-hosted domain check is optional by default and becomes required once the repo variable `VERIFY_SERVER_PUBLIC_URL=true` is set.
- `git push` across GitHub and the server is not atomic. If one remote succeeds and the other fails, resolve the failed side explicitly and push again.
