# 🚀 MSK Shortener – Deployment Guide

> Complete guide for self-hosting MSK Shortener on a Debian or Ubuntu server.

---

## 🏗️ Architecture

```
┌─────────────────┐      Push main      ┌─────────────────┐
│   GitHub Repo   │ ──────────────────► │ GitHub Actions  │
└─────────────────┘                     └────────┬────────┘
                                                 │
                                                 │ SCP + SSH
                                                 ▼
                          ┌──────────────────────────────────────┐
                          │  Server (Debian / Ubuntu)            │
                          │                                      │
                          │  /opt/msk-shortener/                 │
                          │      ├── .next/         ← Build      │
                          │      ├── public/                     │
                          │      ├── node_modules/  ← npm ci     │
                          │      └── .env           ← chmod 600  │
                          │                                      │
                          │  systemctl restart msk-shortener     │
                          │      ↓                               │
                          │  localhost:3011                      │
                          │      ↑                               │
                          │  Apache2 Reverse-Proxy (HTTPS)       │
                          └──────────────────────────────────────┘
```

The deployment has **two phases**:

1. **One-time server setup** with `install.sh` – installs system packages, MariaDB, Apache, SSL, and creates the systemd service.
2. **Continuous deployment** via GitHub Actions – every push to `main` builds the app and ships it to the server.

---

## ✅ Prerequisites

| Requirement | Minimum |
|---|---|
| **OS** | Debian 11+ or Ubuntu 22.04+ |
| **RAM** | 512 MB (1 GB recommended) |
| **Disk space** | 2 GB free |
| **Domain** | A record pointing to your server's IP |
| **Service user** | `musiker15` must exist (`sudo adduser musiker15`) |
| **Open ports** | 80 and 443 reachable from the internet |
| **SSH** | Key-based access for the deploy user |

---

## 🏁 Initial Setup (one-time)

### Step 1 – Run the install script

SSH into your server as root or with sudo, then:

```bash
curl -fsSL https://raw.githubusercontent.com/MSK-Scripts/msk-shortener/main/deployment/scripts/install.sh \
  | sudo bash
```

The script walks you through:

1. Domain name input
2. Email address for Let's Encrypt notifications
3. System package installation (Node.js, MariaDB, Apache, Certbot)
4. Database and DB user creation with auto-generated strong passwords
5. `.env` creation at `/opt/msk-shortener/.env` (mode `600`)
6. Apache vHost configuration
7. Let's Encrypt SSL certificate issuance

At the end, the script prints all the **GitHub secrets** you need to add to your repository.

### Step 2 – Set up SSH keys for CI/CD

GitHub Actions logs into the server via SSH to deploy. You need a dedicated deploy key:

```bash
# On your local machine or on the server, as the deploy user
ssh-keygen -t ed25519 -C "github-actions-msk-shortener" -f ~/.ssh/msk-shortener-deploy

# Add the public key to the server's authorized_keys
# (If you ran the install script as root, add it to /root/.ssh/authorized_keys)
cat ~/.ssh/msk-shortener-deploy.pub >> /root/.ssh/authorized_keys
```

The **private key** goes into the `SSH_PRIVATE_KEY` GitHub secret (see next step).

### Step 3 – Add GitHub repository secrets

Go to **Settings → Secrets and variables → Actions → New repository secret** and add:

| Secret | Value |
|---|---|
| `FTP_SERVER` | Your server's IP address or hostname |
| `FTP_USERNAME` | `root` (or the user whose `authorized_keys` you updated) |
| `FTP_PORT` | `22` (or your custom SSH port) |
| `SSH_PRIVATE_KEY` | The full private key including `-----BEGIN…-----` and `-----END…-----` lines |
| `NEXT_PUBLIC_BASE_URL` | `https://your-domain.example` |

> 💡 The database credentials are read from the server-side `.env` file during deploy, **not** from GitHub secrets — they never leave the server.

### Step 4 – Trigger the first deploy

```bash
git push origin main
```

That's it! Watch the deploy progress at:
`https://github.com/MSK-Scripts/msk-shortener/actions`

---

## 🔄 Updates

**Just push to main.** GitHub Actions handles the rest:

```bash
git push origin main
```

The workflow will:

1. Build the Next.js app
2. SCP the build artifacts to the server
3. Run `npm ci --omit=dev` on the server
4. Apply any pending database migrations
5. Restart the systemd service
6. Verify the service is healthy

---

## 💾 Database Backups

A backup script is included:

```bash
sudo bash /opt/msk-shortener/deployment/scripts/backup.sh
```

This creates a gzipped SQL dump in `/var/backups/msk-shortener/` with a 14-day retention policy.

### Schedule daily backups

```bash
sudo crontab -e
```

Add the following line:

```cron
0 3 * * * /opt/msk-shortener/deployment/scripts/backup.sh
```

This runs the backup every day at 3:00 AM server time.

---

## 🔧 Service Management

```bash
# Check status
sudo systemctl status msk-shortener

# Tail the logs
sudo journalctl -u msk-shortener -f

# Restart
sudo systemctl restart msk-shortener

# Stop
sudo systemctl stop msk-shortener

# Start
sudo systemctl start msk-shortener

# Enable on boot
sudo systemctl enable msk-shortener
```

---

## 📁 Important Paths

| What | Where |
|---|---|
| Application directory | `/opt/msk-shortener/` |
| Environment file | `/opt/msk-shortener/.env` (mode `600`) |
| systemd unit | `/etc/systemd/system/msk-shortener.service` |
| Apache vHost | `/etc/apache2/sites-available/msk-shortener.conf` |
| Apache access/error logs | `/var/log/apache2/msk-shortener-*.log` |
| Service logs | `journalctl -u msk-shortener` |
| Backups | `/var/backups/msk-shortener/` |

---

## 🆘 Troubleshooting

### Deploy fails on GitHub Actions

Check the workflow logs at:
`https://github.com/MSK-Scripts/msk-shortener/actions`

**Common causes:**

- **SSH authentication failed** — the public key isn't in `authorized_keys`, or the private key in the secret is malformed (missing `BEGIN`/`END` lines)
- **Missing secrets** — make sure all five secrets are set (`FTP_SERVER`, `FTP_USERNAME`, `FTP_PORT`, `SSH_PRIVATE_KEY`, `NEXT_PUBLIC_BASE_URL`)
- **Deploy user lacks write access** to `/opt/msk-shortener/` — fix with `sudo chown -R <user>:<user> /opt/msk-shortener`

### Service won't start after deploy

```bash
sudo journalctl -u msk-shortener -e --no-pager
```

**Most common causes:**

- **Database connection refused** — verify the values in `/opt/msk-shortener/.env` against the install script output
- **Port 3011 already in use** — check with `sudo ss -tlnp | grep 3011`
- **`.env` permissions wrong** — should be `600` and owned by the service user

### Apache returns "502 Bad Gateway"

This means Apache is up, but the Next.js service isn't responding on port 3011.

```bash
sudo systemctl status msk-shortener
sudo journalctl -u msk-shortener -e
```

### Test SSL renewal

```bash
sudo certbot renew --dry-run
```

Certbot is configured by `install.sh` to auto-renew via systemd timer, but it's good to verify once.

### Full uninstall

```bash
# Stop and disable the service
sudo systemctl stop msk-shortener
sudo systemctl disable msk-shortener
sudo rm /etc/systemd/system/msk-shortener.service
sudo systemctl daemon-reload

# Remove Apache config
sudo a2dissite msk-shortener
sudo rm /etc/apache2/sites-available/msk-shortener.conf
sudo systemctl reload apache2

# Remove application files
sudo rm -rf /opt/msk-shortener
sudo rm -rf /var/backups/msk-shortener

# Optionally drop the database
sudo mariadb -e "DROP DATABASE msk_shortener; DROP USER 'msk_shortener'@'localhost';"
```

---

## 🔐 Security Hardening

The installation defaults are already production-ready, but here are some optional hardening steps:

- **Firewall** — close all ports except 22, 80, and 443 (e.g. with `ufw`)
- **Fail2ban** — enable for SSH and Apache to throttle brute-force attempts
- **Non-root SSH** — disable root SSH login (`PermitRootLogin no`) after setting up a deploy user
- **Automatic security updates** — install `unattended-upgrades` for the OS

---

## 🧪 GitHub Actions Workflows

This repo ships with several CI workflows beyond the deploy:

| Workflow | Trigger | Purpose |
|---|---|---|
| **Deploy** | Push to `main` | Build & deploy to production |
| **CodeQL** | Push, PR, weekly | Static analysis for security issues |
| **ESLint** | Push, PR | Code quality and TypeScript type-checking |
| **Dependency Review** | PR only | Block PRs that introduce vulnerable deps |
| **Secret Scanning (TruffleHog)** | Push, PR, weekly | Catch accidentally committed secrets |
| **Dependabot** | Weekly | Auto-PRs for minor and patch updates |

All workflows are defined in [`.github/workflows/`](../.github/workflows/).

---

## 💬 Questions or Issues?

- Bug reports: [GitHub Issues](https://github.com/MSK-Scripts/msk-shortener/issues)
- Security: see [`SECURITY.md`](../SECURITY.md)
- General: [info@msk-scripts.de](mailto:info@msk-scripts.de)

---

[← Back to main README](../README.md)
