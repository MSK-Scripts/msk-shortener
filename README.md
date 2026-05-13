# MSK Shortener

> Self-hosted URL-Shortener mit Statistiken, QR-Codes und Passwortschutz – Teil des MSK-Ökosystems.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)

## ✨ Features

- 🔗 **Custom Short-Codes** – Eigene Kurz-URLs vergeben
- 📊 **Click-Statistiken** – Anonymisiertes Tracking mit Charts
- 🔒 **Passwortschutz** – Links per Passwort sichern (bcrypt)
- ⏱️ **Link-Ablaufdatum** – Automatisches Ablaufen
- 📱 **QR-Code Generator** – PNG/SVG Download
- 🔌 **REST API** – Vollständig dokumentierte API
- 🌍 **DSGVO-konform** – IP-Hashing, keine GeoIP, keine Cookies
- 🛡️ **Sicherheit** – Rate-Limiting, SSRF-Schutz, CSP-Header

## 🚀 Live

Öffentliche Instanz: [s.msk-scripts.de](https://s.msk-scripts.de)

## 🛠️ Tech-Stack

- **Framework:** Next.js 15 (App Router)
- **Sprache:** TypeScript
- **Datenbank:** MariaDB (mit `mysql2`)
- **Styling:** Tailwind CSS
- **Validation:** Zod
- **Deployment:** Debian + Apache2 + systemd

## 📋 Installation

### Voraussetzungen
- Node.js 20+
- MariaDB 10.6+
- (Produktion) Debian/Ubuntu + Apache2

### Lokale Entwicklung

```bash
# Repository klonen
git clone https://github.com/musiker15/msk-shortener.git
cd msk-shortener

# Dependencies installieren
npm install

# Umgebungsvariablen kopieren & anpassen
cp .env.example .env

# Datenbank-Migrationen ausführen
npm run migrate

# Dev-Server starten
npm run dev
```

Die App läuft dann auf [http://localhost:3001](http://localhost:3001).

### Server-Installation (Debian/Ubuntu)

Vollständiges Installations-Script kommt in Phase 5:

```bash
curl -fsSL https://raw.githubusercontent.com/musiker15/msk-shortener/main/deployment/scripts/install.sh | sudo bash
```

## 📡 REST API

Vollständige Dokumentation: [docu.msk-scripts.de/shortener](https://docu.msk-scripts.de/shortener)

### Beispiel: Link erstellen

```bash
curl -X POST https://s.msk-scripts.de/api/links \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://msk-scripts.de",
    "customCode": "msk"
  }'
```

## 🔒 Sicherheit

- Keine Logs von IP-Adressen im Klartext
- Bcrypt für Link-Passwörter (Cost 12)
- SSRF-Schutz (keine privaten IP-Ranges als Ziel)
- Rate-Limiting (20 Links/Stunde pro IP)
- Strenge CSP-Header
- Keine Drittanbieter-Tracker, keine Cookies

## 📄 Lizenz

**AGPL-3.0-or-later** © [MSK Scripts](https://www.msk-scripts.de)

MSK Shortener steht unter der [GNU Affero General Public License v3.0](LICENSE).

Das bedeutet:
- ✅ Du darfst die Software nutzen, kopieren und modifizieren
- ✅ Du darfst eigene Versionen verbreiten
- ⚠️ Wenn du eine modifizierte Version als **Netzwerk-Service** anbietest (z.B. als Webdienst), musst du den Source-Code deiner Modifikationen öffentlich zugänglich machen
- ⚠️ Abgeleitete Werke müssen ebenfalls unter AGPL-3.0 lizenziert sein

Wenn du eine kommerzielle Lizenz ohne Copyleft-Verpflichtung benötigst, kontaktiere bitte den Autor.

---

Teil des **MSK-Ökosystems**: [msk-scripts.de](https://msk-scripts.de) · [cloud.musiker15.de](https://cloud.musiker15.de) · [musiker15.de](https://musiker15.de)
