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
| Framework    | Next.js 16 (App Router) |
| Sprache      | TypeScript (strict)     |
| Datenbank    | MariaDB (`mysql2`)      |
| Styling      | Tailwind CSS 4          |
| Validation   | Zod                     |
| Short-Codes  | nanoid                  |
| QR-Codes     | qrcode                  |
| Passwörter   | bcrypt                  |
| UA-Parsing   | ua-parser-js            |
| Charts       | SVG, ohne Bibliothek    |

**Bewusst kein:** Prisma (Overhead), Redis (Single-Server), Drittanbieter-Auth.

## 🎨 MSK Design-System

Das Designsystem von msk-scripts.de, wie in MSK Forms: Tokens, Typografie, Layout, Komponenten und
Barrierefreiheit stehen in **`DESIGN.md`**, die Werte in `app/globals.css`. Kurz: Hell und Dunkel
(System als Vorgabe), Archivo und Source Sans 3 lokal über Fontsource, Phosphor-Icons nur aus
`src/components/icons`, Kopf- und Fußleiste des Shops (`src/components/site`), Diagramme als
SVG ohne Bibliothek. `src/test/contrast.test.ts` rechnet jedes Farbpaar in beiden Themes nach.
Ausgeschlossen: Inter, JetBrains Mono, GitHub-Dark-Palette, Emoji als Icons.

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
- `id`, `link_id` (FK), `clicked_at`, `referrer`
- `browser`, `os`, `device_type`
- **Kein IP-Merkmal.** `ip_hash` gab es bis 09/2026, wurde nie gelesen und ist
  mit `migrations/004_drop_click_ip_hash.sql` entfallen

## 📋 Roadmap

- [x] **Phase 1:** Foundation (Setup, DB, Lib)
- [x] **Phase 2:** Core (Link-Erstellung, Redirect, Custom-Codes)
- [x] **Phase 3:** Erweiterte Features (Passwort, Ablauf, Rate-Limit, Tracking)
- [x] **Phase 4:** Statistiken & QR-Codes
- [x] **Phase 5:** Deployment (Apache2, systemd, install.sh)

**🎉 Projekt komplett – produktionsreif!**

## 🔒 Sicherheits-Prinzipien

1. **DSGVO:** Nur beim Anlegen eines Links wird die IP als gesalzener SHA-256-Hash abgelegt (`links.created_ip_hash`, Rate-Limit). Klicks speichern kein IP-Merkmal, siehe `migrations/004_drop_click_ip_hash.sql`
2. **SSRF-Schutz:** Keine privaten IP-Ranges als Redirect-Ziel
3. **Rate-Limiting:** 20 Link-Erstellungen pro IP/Stunde
4. **CSP-Header:** Strenge Content-Security-Policy
5. **bcrypt:** Cost 12 für Link-Passwörter
6. **Keine Tracking-Cookies:** Das einzige Cookie ist `NEXT_LOCALE` (Sprachauswahl, 1 Jahr), gesetzt von `POST /api/locale`

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
| Projekt (local)  | `G:\GitHub Repositories\MSK Scripts\Web\msk-shortener` |
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
