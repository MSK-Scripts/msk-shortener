# MSK Shortener – Claude Projekt-Doku

> Diese Datei dient als Kontext-Anker für Claude bei zukünftigen Sessions.

## 🌐 Sprache & Commit-Konventionen (WICHTIG)

- **GitHub-Inhalte auf Englisch** (Code-Kommentare, Commit-Messages, PR-Titel/-Body, README, Issues, Workflows). Damit jeder alles versteht.
- **Interne Doku auf Deutsch erlaubt:** `CLAUDE.md` (alle gitignored).
- **Commits AUSSCHLIESSLICH OHNE `Co-Authored-By`-Trailer.** Niemals einen Co-Author-Trailer anhängen.

## 🎯 Projektziel

Self-hosted URL-Shortener als Open-Source-Alternative zu Bitly/TinyURL.
Teil des MSK-Ökosystems unter `s.msk-scripts.de`.

## 🛠️ Tech-Stack

| Bereich      | Technologie             |
|--------------|-------------------------|
| Framework    | Next.js 15 (App Router) |
| Sprache      | TypeScript (strict)     |
| Datenbank    | MariaDB (`mysql2`)      |
| Styling      | Tailwind CSS            |
| Validation   | Zod                     |
| Short-Codes  | nanoid                  |
| QR-Codes     | qrcode                  |
| Passwörter   | bcrypt                  |
| UA-Parsing   | ua-parser-js            |
| Charts       | recharts                |

**Bewusst kein:** Prisma (Overhead), Redis (Single-Server), Drittanbieter-Auth.

## 🎨 MSK Design-System

```css
/* Farben */
--msk-bg:       #1b1b1d
--msk-surface:  #242526
--msk-surface2: #2a2b2e
--msk-border:   #3d3d3f
--msk-accent:   #5eb131    /* MSK-Grün */
--msk-hover:    #4e9827
--msk-text:     #e3e3e3
--msk-muted:    #8d9096
--msk-danger:   #e05c4b

/* Fonts */
Headings: Syne (700/800/900)
Body:     DM Sans (300-600)
```

## 📦 Features

| Feature              | Status        | Phase |
|----------------------|---------------|-------|
| Custom Short-Codes   | ✅ Geplant     | 2     |
| Click-Statistiken    | ✅ Geplant     | 4     |
| Link-Ablaufdatum     | ✅ Geplant     | 3     |
| Passwortschutz       | ✅ Geplant     | 3     |
| QR-Code Generator    | ✅ Geplant     | 4     |
| REST API             | ✅ Geplant     | 2-4   |
| GeoIP                | ❌ Bewusst weg | –     |
| User-Accounts        | ❌ Bewusst weg | –     |

## 🗄️ Datenbank-Schema

### `links`
- `id`, `short_code` (UNIQUE), `original_url`
- `password_hash` (NULL = kein PW), `expires_at` (NULL = kein Ablauf)
- `delete_token` (zum Löschen ohne Account)
- `click_count` (denormalisiert für Performance)
- `created_at`, `created_ip_hash` (für Rate-Limit)

### `clicks`
- `id`, `link_id` (FK), `clicked_at`
- `ip_hash` (DSGVO-konform), `referrer`
- `browser`, `os`, `device_type`

## 📋 Roadmap

- [x] **Phase 1:** Foundation (Setup, DB, Lib)
- [x] **Phase 2:** Core (Link-Erstellung, Redirect, Custom-Codes)
- [x] **Phase 3:** Erweiterte Features (Passwort, Ablauf, Rate-Limit, Tracking)
- [x] **Phase 4:** Statistiken & QR-Codes
- [x] **Phase 5:** Deployment (Apache2, systemd, install.sh)

**🎉 Projekt komplett – produktionsreif!**

## 🔒 Sicherheits-Prinzipien

1. **DSGVO:** IPs werden nur als gesalzener SHA-256-Hash gespeichert
2. **SSRF-Schutz:** Keine privaten IP-Ranges als Redirect-Ziel
3. **Rate-Limiting:** 20 Link-Erstellungen pro IP/Stunde
4. **CSP-Header:** Strenge Content-Security-Policy
5. **bcrypt:** Cost 12 für Link-Passwörter
6. **Keine Cookies:** Stateless, keine Tracking

## 🌍 Deployment

- **Server:** Debian + Apache2 + MariaDB
- **Port:** Next.js auf `localhost:3001`
- **Reverse-Proxy:** Apache2 mit Let's Encrypt
- **Service:** systemd (auto-restart, User `musiker15`)
- **Domain:** `s.msk-scripts.de`
- **Setup:** Einmalig via `install.sh`
- **CI/CD:** GitHub Actions bei Push auf `main` (SCP + SSH analog msk-shop)

## 📁 Wichtige Pfade

| Was              | Pfad                                                        |
|------------------|-------------------------------------------------------------|
| Projekt (local)  | `C:\Users\morit\OneDrive\GitHub Repositories\msk-shortener` |
| Produktion       | `/opt/msk-shortener/`                                       |
| .env (Server)    | `/opt/msk-shortener/.env` (chmod 600)                       |
| Apache Config    | `/etc/apache2/sites-available/msk-shortener.conf`           |
| systemd Service  | `/etc/systemd/system/msk-shortener.service`                 |
| Service-Unit Src | `msk-shortener.service` (Repo-Root, wird via SCP deployt)   |
| Workflow         | `.github/workflows/deploy.yml`                              |

## 💬 Arbeitsweise

- **Sprache:** Deutsch (alle Kommentare & Variablen wo sinnvoll)
- **Code-Stil:** TypeScript strict, keine `any`, Zod für Input-Validierung
- **Security-First:** Jeder neue Endpoint braucht Rate-Limit + Validation
- **Datei-Checkliste:** Nach jeder Änderung vollständige Pfadliste ausgeben

---

*Letzte Aktualisierung: Mai 2026 – Alle Phasen abgeschlossen ✅*
