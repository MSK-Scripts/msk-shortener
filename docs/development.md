# Development

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) |
| **Language** | TypeScript (strict mode) |
| **Database** | MariaDB via [`mysql2`](https://github.com/sidorares/node-mysql2) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) with the design tokens of msk-scripts.de (see [DESIGN.md](../DESIGN.md)) |
| **Fonts and icons** | Archivo and Source Sans 3 via Fontsource (served locally), [Phosphor](https://phosphoricons.com) |
| **Themes** | Light, dark and system via [next-themes](https://github.com/pacocoursey/next-themes) |
| **Validation** | [Zod 4](https://zod.dev) |
| **i18n** | [next-intl 4](https://next-intl.dev) |
| **Hashing** | [bcryptjs 3](https://github.com/dcodeIO/bcrypt.js) |
| **Short codes** | [nanoid](https://github.com/ai/nanoid) |
| **QR codes** | [qrcode](https://github.com/soldair/node-qrcode) |
| **Charts** | Hand-written SVG, rendered on the server |
| **UA parsing** | [ua-parser-js 2](https://github.com/faisalman/ua-parser-js) |
| **Deployment** | Debian/Ubuntu + Apache2 + systemd |
| **Tests** | [Vitest](https://vitest.dev) |
| **CI/CD** | GitHub Actions |

> **Deliberately not used:** Prisma (too much overhead), Redis (single-server setup), third-party auth providers.

## 📋 Installation

### Prerequisites

- **Node.js** 24 or later
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


## 🌍 Internationalization

The UI is available in **German** and **English**.

- Language is detected from the user's browser on first visit (`Accept-Language` header)
- Users can switch languages via the header dropdown — the choice is stored in a cookie
- **No URL prefix** (no `/de/…` or `/en/…`) — short links stay as short as possible
- All UI strings live in [`messages/de.json`](../messages/de.json) and [`messages/en.json`](../messages/en.json)

Want to add another language? PRs welcome!
