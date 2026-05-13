# MSK Shortener – Deployment Guide

> Anleitung für die Installation auf einem Debian-/Ubuntu-Server.

## 🏗️ Deployment-Architektur

```
┌─────────────────┐      Push main      ┌─────────────────┐
│   GitHub Repo   │ ──────────────────► │ GitHub Actions  │
└─────────────────┘                     └────────┬────────┘
                                                 │
                                                 │ SCP + SSH
                                                 ▼
                          ┌──────────────────────────────────────┐
                          │  Server (Debian/Ubuntu)              │
                          │                                      │
                          │  /opt/msk-shortener/                 │
                          │      ├── .next/         ← Build      │
                          │      ├── public/                     │
                          │      ├── node_modules/  ← npm ci     │
                          │      └── .env           ← chmod 600  │
                          │                                      │
                          │  systemctl restart msk-shortener     │
                          │      ↓                               │
                          │  localhost:3001                      │
                          │      ↑                               │
                          │  Apache2 Reverse-Proxy (HTTPS)       │
                          └──────────────────────────────────────┘
```

**Zwei Phasen:**

1. **Einmaliges Setup** mit `install.sh` (System-Pakete, DB, Apache, SSL)
2. **Kontinuierliche Updates** automatisch via GitHub Actions bei jedem Push auf `main`

## 🚀 Erstinstallation (einmalig)

### Voraussetzungen

| Was | Mindestanforderung |
|---|---|
| **OS** | Debian 11+ / Ubuntu 22.04+ |
| **RAM** | 512 MB (1 GB empfohlen) |
| **Speicher** | 2 GB frei |
| **Domain** | A-Record auf Server-IP |
| **User** | `musiker15` muss existieren (`sudo adduser musiker15`) |
| **Ports** | 80 + 443 erreichbar |

### Schritt 1 – Server-Setup ausführen

Auf dem Server als root:

```bash
curl -fsSL https://raw.githubusercontent.com/musiker15/msk-shortener/main/deployment/scripts/install.sh \
  | sudo bash
```

Das Script führt dich interaktiv durch:
1. Domain abfragen
2. Email für Let's Encrypt
3. System-Pakete installieren (Node.js, MariaDB, Apache, Certbot)
4. DB + DB-User anlegen mit sicheren Random-Passwörtern
5. `.env` unter `/opt/msk-shortener/.env` erzeugen (chmod 600)
6. Apache vHost konfigurieren
7. SSL via Certbot beantragen

Am Ende werden dir alle **GitHub-Secrets** angezeigt, die du im Repo hinterlegen musst.

### Schritt 2 – GitHub Secrets hinterlegen

Repo → **Settings → Secrets and variables → Actions** → **New repository secret**:

| Secret | Wert |
|---|---|
| `FTP_SERVER` | IP oder Hostname des Servers |
| `FTP_USERNAME` | `musiker15` |
| `FTP_PORT` | `22` (oder dein SSH-Port) |
| `SSH_PRIVATE_KEY` | Private Key für `musiker15` (mit `ssh-keygen` erstellen, Public Key in `~/.ssh/authorized_keys` des Servers ablegen) |
| `NEXT_PUBLIC_BASE_URL` | `https://s.msk-scripts.de` |
| `DB_HOST` | `localhost` |
| `DB_PORT` | `3306` |
| `DB_USER` | `msk_shortener` |
| `DB_PASSWORD` | (aus install.sh-Output) |
| `DB_NAME` | `msk_shortener` |
| `IP_HASH_SECRET` | (aus install.sh-Output) |

### Schritt 3 – Ersten Deploy auslösen

```bash
git push origin main
```

GitHub Actions baut die App, überträgt sie via SCP, installiert npm-Dependencies, führt Migrationen aus und startet den Service.

Status verfolgen unter: `https://github.com/musiker15/msk-shortener/actions`

## 🔄 Updates

**Automatisch bei jedem Push auf `main`:**

```bash
git push origin main
```

Das war's. GitHub Actions kümmert sich um den Rest.

## 💾 Datenbank-Backup

```bash
sudo bash /opt/msk-shortener/deployment/scripts/backup.sh
```

Backups landen in `/var/backups/msk-shortener/` (gzip-komprimiert, 14-Tage-Retention).

**Tägliches Backup einrichten:**

```bash
sudo crontab -e
# Hinzufügen:
0 3 * * * /opt/msk-shortener/deployment/scripts/backup.sh
```

## 🔧 Service-Befehle

```bash
# Status prüfen
sudo systemctl status msk-shortener

# Logs in Echtzeit
sudo journalctl -u msk-shortener -f

# Neu starten
sudo systemctl restart msk-shortener

# Stoppen
sudo systemctl stop msk-shortener
```

## 📁 Wichtige Pfade

| Was | Pfad |
|---|---|
| App-Verzeichnis | `/opt/msk-shortener/` |
| Konfiguration | `/opt/msk-shortener/.env` (chmod 600) |
| systemd Unit | `/etc/systemd/system/msk-shortener.service` |
| Apache vHost | `/etc/apache2/sites-available/msk-shortener.conf` |
| Apache Logs | `/var/log/apache2/msk-shortener-*.log` |
| Service Logs | `journalctl -u msk-shortener` |
| Backups | `/var/backups/msk-shortener/` |

## 🆘 Troubleshooting

### Deploy schlägt fehl

GitHub Actions-Logs prüfen unter:
`https://github.com/musiker15/msk-shortener/actions`

Häufige Ursachen:
- **SSH-Key falsch:** Public Key muss in `~/.ssh/authorized_keys` von `musiker15` auf dem Server liegen
- **Secrets fehlen:** Alle 11 Secrets müssen gesetzt sein
- **`musiker15` hat keinen Schreibzugriff** auf `/opt/msk-shortener/`

### Service startet nach Deploy nicht

```bash
sudo journalctl -u msk-shortener -e --no-pager
```

Häufigste Ursachen:
- DB-Verbindung fehlgeschlagen → `.env`-Werte gegen install.sh-Output prüfen
- Port 3001 belegt → `sudo ss -tlnp | grep 3001`

### Apache zeigt 502 Bad Gateway

Der Next.js-Service läuft nicht.

```bash
sudo systemctl status msk-shortener
```

### SSL-Erneuerung testen

```bash
sudo certbot renew --dry-run
```

### Komplette Deinstallation

```bash
sudo systemctl stop msk-shortener
sudo systemctl disable msk-shortener
sudo rm /etc/systemd/system/msk-shortener.service
sudo systemctl daemon-reload

sudo a2dissite msk-shortener
sudo rm /etc/apache2/sites-available/msk-shortener.conf
sudo systemctl reload apache2

sudo rm -rf /opt/msk-shortener
sudo rm -rf /var/backups/msk-shortener

# DB optional löschen
sudo mariadb -e "DROP DATABASE msk_shortener; DROP USER 'msk_shortener'@'localhost';"
```

---

Bei Fragen → [GitHub Issues](https://github.com/musiker15/msk-shortener/issues)
