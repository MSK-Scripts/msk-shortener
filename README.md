<div align="center">

# 🔗 MSK Shortener

**Self-hosted URL shortener with statistics, QR codes, and password protection.**

Part of the **MSK ecosystem** – open source, privacy-friendly, no tracking, no third parties.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-5eb131.svg)](LICENSE.md)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)](https://www.typescriptlang.org)
[![Made with ❤️](https://img.shields.io/badge/Made_with_❤️_by-MSK_Scripts-5eb131)](https://msk-scripts.de)

[**Live demo →**](https://s.msk-scripts.de) &nbsp;·&nbsp; [**Report a bug**](https://github.com/MSK-Scripts/msk-shortener/issues) &nbsp;·&nbsp; [**Request a feature**](https://github.com/MSK-Scripts/msk-shortener/issues)

</div>

---

## ✨ Features

| | |
|---|---|
| 🔗 **Custom short codes** | Define your own short URLs or let the system generate one |
| 📊 **Click statistics** | Anonymous tracking with interactive charts and aggregations |
| 🔒 **Password protection** | Lock links behind a password (bcrypt, cost 12) |
| ⏱️ **Link expiration** | Auto-expire links at a date/time of your choice |
| 📱 **QR code generator** | Download as PNG or SVG |
| 🔌 **REST API** | Fully documented endpoints for automation |
| 🌍 **Bilingual UI** | German and English, switchable per user (cookie-based) |
| 🛡️ **Privacy-friendly** | IP hashing, no GeoIP, no third-party trackers, no analytics cookies |
| ⚡ **Rate limiting** | 20 links/hour per IP to prevent abuse |
| 🗑️ **Delete tokens** | Every short link comes with a one-time delete token |

---

## 🚀 Live Instance

The reference deployment runs at **[s.msk-scripts.de](https://s.msk-scripts.de)**.

You're welcome to use it, or self-host your own (see [Installation](#-installation) below).

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router) |
| **Language** | TypeScript (strict mode) |
| **Database** | MariaDB via [`mysql2`](https://github.com/sidorares/node-mysql2) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) |
| **Validation** | [Zod 4](https://zod.dev) |
| **i18n** | [next-intl 4](https://next-intl.dev) |
| **Hashing** | [bcryptjs 3](https://github.com/dcodeIO/bcrypt.js) |
| **Short codes** | [nanoid](https://github.com/ai/nanoid) |
| **QR codes** | [qrcode](https://github.com/soldair/node-qrcode) |
| **Charts** | [Recharts](https://recharts.org) |
| **UA parsing** | [ua-parser-js 2](https://github.com/faisalman/ua-parser-js) |
| **Deployment** | Debian/Ubuntu + Apache2 + systemd |
| **CI/CD** | GitHub Actions |

> **Deliberately not used:** Prisma (too much overhead), Redis (single-server setup), third-party auth providers.

---

## 📋 Installation

### Prerequisites

- **Node.js** 20 or later
- **MariaDB** 10.6 or later
- A modern terminal (Linux, macOS, or WSL on Windows)

### Local development

```bash
# Clone the repository
git clone https://github.com/MSK-Scripts/msk-shortener.git
cd msk-shortener

# Install dependencies
npm install

# Copy the environment template and adjust the values
cp .env.example .env

# Run database migrations
npm run migrate

# Start the dev server
npm run dev
```

The app will be available at **[http://localhost:3000](http://localhost:3000)**.

### Production server

For a full production setup on Debian/Ubuntu, see the dedicated [**Deployment Guide →**](deployment/README.md).

**TL;DR** for a one-shot install:

```bash
curl -fsSL https://raw.githubusercontent.com/MSK-Scripts/msk-shortener/main/deployment/scripts/install.sh \
  | sudo bash
```

This walks you through domain setup, MariaDB, Apache, Let's Encrypt SSL, systemd, and prints out the GitHub secrets you'll need for CI/CD.

---

## 📡 REST API

Every feature in the web UI is available through the REST API.

Full documentation: **[docu.msk-scripts.de/shortener](https://docu.msk-scripts.de/shortener)**

### Create a link

```bash
curl -X POST https://s.msk-scripts.de/api/links \
  -H "Content-Type: application/json" \
  -d '{
    "url":        "https://msk-scripts.de",
    "customCode": "msk",
    "expiresAt":  "2026-12-31T23:59:59Z"
  }'
```

**Response:**

```json
{
  "shortCode":   "msk",
  "shortUrl":    "https://s.msk-scripts.de/msk",
  "deleteToken": "dk_a7c4f2…",
  "expiresAt":   "2026-12-31T23:59:59.000Z",
  "hasPassword": false
}
```

### Other endpoints

| Method | Path | Description |
|---|---|---|
| `POST`   | `/api/links` | Create a new short link |
| `GET`    | `/api/links/:code` | Look up a link |
| `DELETE` | `/api/links/:code` | Delete a link (requires `deleteToken`) |
| `GET`    | `/api/links/:code/stats` | Get click statistics for one link |
| `GET`    | `/api/links/:code/qr` | QR code as PNG or SVG |
| `GET`    | `/api/stats` | Global statistics across all links |
| `POST`   | `/api/verify` | Verify a password-protected link |

---

## ⚙️ Configuration

All configuration happens through environment variables. See [`.env.example`](.env.example) for the full list.

Most important:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_BASE_URL` | Public base URL of your instance (used for QR codes and share URLs) |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MariaDB connection |
| `IP_HASH_SECRET` | Secret for HMAC-based IP hashing — generate with `openssl rand -hex 32` |
| `RATE_LIMIT_CREATE_PER_HOUR` | Max links per IP per hour (default: `20`) |
| `SHORTCODE_LENGTH` | Length of auto-generated short codes (default: `7`, clamped to `3`–`16`; anything unusable falls back to `7`) |

---

## 🔒 Security & Privacy

MSK Shortener is built with GDPR compliance and personal privacy in mind.

- **No IP addresses stored in plain text** — only salted HMAC hashes
- **No GeoIP lookups** — country/region data is never collected
- **No third-party trackers** — no Google Analytics, no Plausible, nothing
- **No tracking cookies** — the only cookie sets the user's chosen language
- **Password hashing** — bcrypt with cost factor 12
- **SSRF protection** — private IP ranges (RFC 1918, loopback, link-local) are rejected as targets
- **Rate limiting** — abuse protection per IP
- **Strict CSP headers** — defense in depth against XSS

A full **privacy policy** in German and English is available at [`/privacy`](https://s.msk-scripts.de/privacy) on every instance.

To report a security issue, see [`SECURITY.md`](SECURITY.md).

---

## 🌍 Internationalization

The UI is available in **German** and **English**.

- Language is detected from the user's browser on first visit (`Accept-Language` header)
- Users can switch languages via the header dropdown — the choice is stored in a cookie
- **No URL prefix** (no `/de/…` or `/en/…`) — short links stay as short as possible
- All UI strings live in [`messages/de.json`](messages/de.json) and [`messages/en.json`](messages/en.json)

Want to add another language? PRs welcome!

---

## 🤝 Contributing

Contributions are welcome! This is a single-maintainer project, so please:

1. Open an issue first to discuss larger changes
2. Keep PRs focused — one concern per PR
3. Run `npm run lint` and `npm run type-check` before submitting
4. Follow the existing code style

For bug reports, please include:
- Steps to reproduce
- Expected vs. actual behavior
- Your environment (Node version, browser, OS)

---

## 📄 License

**[GNU Affero General Public License v3.0 or later](LICENSE.md)** © [MSK Scripts](https://msk-scripts.de)

### What this means in plain English

- ✅ You **can** use, copy, and modify this software
- ✅ You **can** distribute your own versions
- ⚠️ If you offer a modified version as a **network service** (e.g. a public web app), you **must** make your modifications publicly available under the same license
- ⚠️ Derivative works must also be licensed under AGPL-3.0

If you need a commercial license without the copyleft obligations, please contact the author at [info@msk-scripts.de](mailto:info@msk-scripts.de).

---

<div align="center">

Part of the **MSK ecosystem** &nbsp;·&nbsp; [msk-scripts.de](https://msk-scripts.de) &nbsp;·&nbsp; [musiker15.de](https://musiker15.de)

</div>
