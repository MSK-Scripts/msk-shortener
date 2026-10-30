# Operations

## 🖥️ Production server

For a full production setup on Debian/Ubuntu, see the dedicated [**Deployment Guide →**](../deployment/README.md).

**TL;DR** for a one-shot install:

```bash
curl -fsSL https://raw.githubusercontent.com/MSK-Scripts/msk-shortener/main/deployment/scripts/install.sh \
  | sudo bash
```

This walks you through domain setup, MariaDB, Apache, Let's Encrypt SSL, systemd, and prints out the GitHub secrets you'll need for CI/CD.

## ⚙️ Configuration

All configuration happens through environment variables. See [`.env.example`](../.env.example) for the full list.

Most important:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_BASE_URL` | Public base URL of your instance (used for QR codes and share URLs) |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MariaDB connection |
| `IP_HASH_SECRET` | Secret for HMAC-based IP hashing, generate with `openssl rand -hex 32` |
| `RATE_LIMIT_CREATE_PER_HOUR` | Max links per IP per hour (default: `20`) |
| `SHORTCODE_LENGTH` | Length of auto-generated short codes (default: `7`, clamped to `3`–`16`; anything unusable falls back to `7`) |
