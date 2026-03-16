# Deployment Channels

This project publishes through three separate channels:

1. `Vercel`
   - Trigger: Vercel Git integration on `main`
   - Purpose: public production site
   - Verify: `curl -I https://my-resume-gray-five.vercel.app`

2. `GitHub Pages`
   - Trigger: `.github/workflows/pages.yml`
   - Purpose: static export deployment
   - Verify: `curl -I https://byted-x.github.io/My-Resume/`

3. `Self-hosted server`
   - Trigger: local `systemd` timer on the server
   - Purpose: standalone Next.js service behind Nginx
   - Verify:
     - `systemctl status portfolio-deploy.timer`
     - `journalctl -u portfolio-deploy.service -n 100 --no-pager`
     - `curl -I http://106.12.154.163`

## Server Setup

Run the installer once on the server:

```bash
git clone https://github.com/byteD-x/My-Resume.git /var/www/portfolio/source
cd /var/www/portfolio/source
chmod +x scripts/install-server-deploy-timer.sh
sudo ./scripts/install-server-deploy-timer.sh
```

The installer creates:

- `portfolio-deploy.service`: a oneshot deploy job that pulls the latest `main`, builds the standalone server bundle, updates `/var/www/portfolio/current`, and restarts `portfolio.service`
- `portfolio-deploy.timer`: a recurring timer that checks for new commits every minute by default

## Rollback

The active release is always the `/var/www/portfolio/current` symlink.
To roll back, repoint it to an older release under `/var/www/portfolio/releases/` and restart `portfolio.service`.
