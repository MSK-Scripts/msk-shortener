#!/usr/bin/env bash
# ============================================================================
# MSK Shortener – Einmaliges Server-Setup für Debian / Ubuntu
#
# Diese Datei bereitet den Server EINMALIG vor:
#   - System-Pakete (Node.js, MariaDB, Apache, Certbot)
#   - Apache-Module aktivieren
#   - MariaDB-Datenbank + User anlegen
#   - Apache vHost konfigurieren
#   - SSL via Let's Encrypt beantragen
#   - Verzeichnis /opt/msk-shortener/ vorbereiten
#   - .env-Datei mit allen Secrets erzeugen
#
# Der CODE-DEPLOY läuft anschließend ausschließlich über GitHub Actions
# (siehe .github/workflows/deploy.yml). Dieses Script muss nur EINMAL
# pro Server ausgeführt werden.
#
# Nutzung:
#   curl -fsSL https://raw.githubusercontent.com/musiker15/msk-shortener/main/deployment/scripts/install.sh \
#     | sudo bash
# ============================================================================

set -euo pipefail

# ─── Konfiguration ────────────────────────────────────────────────────
APP_NAME="msk-shortener"
APP_USER="musiker15"
APP_DIR="/opt/${APP_NAME}"
DOMAIN_DEFAULT="s.msk-scripts.de"
NODE_VERSION="20"
NEXT_PORT="3001"
DB_NAME="msk_shortener"
DB_USER="msk_shortener"

# ─── Farben ───────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# ─── Logging-Helfer ───────────────────────────────────────────────────
log_info() { echo -e "${BLUE}ℹ${NC}  $1"; }
log_ok()   { echo -e "${GREEN}✓${NC}  $1"; }
log_warn() { echo -e "${YELLOW}⚠${NC}  $1"; }
log_err()  { echo -e "${RED}✗${NC}  $1" >&2; }
log_step() { echo -e "\n${BOLD}${CYAN}▶ $1${NC}\n"; }

trap 'log_err "Setup fehlgeschlagen in Zeile ${LINENO}."' ERR

# ============================================================================
# 0. Banner & Vorprüfungen
# ============================================================================

clear
cat << "BANNER"

  ███╗   ███╗███████╗██╗  ██╗
  ████╗ ████║██╔════╝██║ ██╔╝
  ██╔████╔██║███████╗█████╔╝
  ██║╚██╔╝██║╚════██║██╔═██╗
  ██║ ╚═╝ ██║███████║██║  ██╗
  ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝
        S H O R T E N E R
   One-Time Server Setup
   (Code-Deploy läuft via GitHub Actions)

BANNER

echo -e "${DIM}Bereitet den Server EINMALIG für MSK Shortener vor.${NC}"
echo -e "${DIM}Nachfolgende Code-Updates erfolgen automatisch via GitHub Actions.${NC}\n"

# ─── Root-Check ───────────────────────────────────────────────────────
if [[ $EUID -ne 0 ]]; then
    log_err "Dieses Script muss als root ausgeführt werden (mit sudo)."
    exit 1
fi

# ─── OS-Check ─────────────────────────────────────────────────────────
if ! command -v apt-get &>/dev/null; then
    log_err "Nur Debian / Ubuntu wird unterstützt (apt-get nicht gefunden)."
    exit 1
fi

if [[ -f /etc/os-release ]]; then
    . /etc/os-release
    log_info "Erkanntes System: ${BOLD}${PRETTY_NAME}${NC}"
fi

# ─── User vorhanden? ──────────────────────────────────────────────────
if ! id "$APP_USER" &>/dev/null; then
    log_err "User '${APP_USER}' existiert nicht."
    echo "Dieser User wird auch für andere MSK-Projekte (z. B. msk-shop) verwendet."
    echo "Lege ihn an mit: sudo adduser musiker15"
    exit 1
fi

# ============================================================================
# 1. Interaktive Eingaben
# ============================================================================

log_step "1/10  Konfiguration"

read -rp "$(echo -e "${BOLD}Domain${NC} [${DOMAIN_DEFAULT}]: ")" DOMAIN
DOMAIN=${DOMAIN:-$DOMAIN_DEFAULT}

read -rp "$(echo -e "${BOLD}Email für Let's Encrypt${NC}: ")" LE_EMAIL
while [[ ! "$LE_EMAIL" =~ ^[^@]+@[^@]+\.[^@]+$ ]]; do
    log_err "Ungültige Email-Adresse"
    read -rp "Email: " LE_EMAIL
done

read -rp "$(echo -e "${BOLD}SSL-Zertifikat jetzt mit Certbot beantragen?${NC} (J/n): ")" use_ssl
USE_SSL=$([[ "$use_ssl" =~ ^[nN]$ ]] && echo "no" || echo "yes")

echo ""
echo -e "${BOLD}Zusammenfassung:${NC}"
echo -e "  Domain:       ${CYAN}${DOMAIN}${NC}"
echo -e "  Email (LE):   ${CYAN}${LE_EMAIL}${NC}"
echo -e "  SSL:          ${CYAN}${USE_SSL}${NC}"
echo -e "  Verzeichnis:  ${CYAN}${APP_DIR}${NC}"
echo -e "  Service-User: ${CYAN}${APP_USER}${NC}"
echo ""
read -rp "Setup jetzt starten? (J/n) " confirm
if [[ "$confirm" =~ ^[nN]$ ]]; then
    echo "Abgebrochen."
    exit 0
fi

# ============================================================================
# 2. System-Pakete aktualisieren
# ============================================================================

log_step "2/10  System-Pakete aktualisieren"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get upgrade -qq -y
log_ok "System aktuell"

# ============================================================================
# 3. Basis-Tools installieren
# ============================================================================

log_step "3/10  Basis-Tools installieren"
apt-get install -qq -y \
    curl wget git ca-certificates gnupg lsb-release \
    openssl ufw
log_ok "Basis-Tools installiert"

# ============================================================================
# 4. Node.js installieren
# ============================================================================

log_step "4/10  Node.js ${NODE_VERSION} installieren"
if ! command -v node &>/dev/null || [[ $(node -v | cut -d. -f1 | tr -d 'v') -lt 20 ]]; then
    curl -fsSL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | bash - >/dev/null
    apt-get install -qq -y nodejs
fi
log_ok "Node.js $(node -v), npm $(npm -v) installiert"

# ============================================================================
# 5. MariaDB installieren
# ============================================================================

log_step "5/10  MariaDB installieren"
apt-get install -qq -y mariadb-server mariadb-client
systemctl enable --now mariadb
log_ok "MariaDB läuft"

# ============================================================================
# 6. Apache2 + Certbot installieren
# ============================================================================

log_step "6/10  Apache2 & Certbot installieren"
apt-get install -qq -y apache2 certbot python3-certbot-apache

a2enmod proxy        >/dev/null 2>&1 || true
a2enmod proxy_http   >/dev/null 2>&1 || true
a2enmod ssl          >/dev/null 2>&1 || true
a2enmod headers      >/dev/null 2>&1 || true
a2enmod rewrite      >/dev/null 2>&1 || true
a2enmod deflate      >/dev/null 2>&1 || true

systemctl enable apache2
log_ok "Apache2 mit allen Modulen bereit"

# ============================================================================
# 7. Datenbank einrichten
# ============================================================================

log_step "7/10  MariaDB-Datenbank einrichten"

DB_PASSWORD=$(openssl rand -base64 32 | tr -d '/+=\n' | cut -c1-24)
IP_HASH_SECRET=$(openssl rand -hex 32)

mariadb << SQL
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP USER IF EXISTS '${DB_USER}'@'localhost';
CREATE USER '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';

GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
SQL

log_ok "Datenbank '${DB_NAME}' und User '${DB_USER}' eingerichtet"

# ============================================================================
# 8. Verzeichnis & .env vorbereiten
# ============================================================================

log_step "8/10  Verzeichnis & .env vorbereiten"

mkdir -p "$APP_DIR"
chown "$APP_USER:$APP_USER" "$APP_DIR"

cat > "$APP_DIR/.env" << ENV
# Automatisch generiert von install.sh – $(date)
NODE_ENV=production
PORT=${NEXT_PORT}

NEXT_PUBLIC_BASE_URL=https://${DOMAIN}

DB_HOST=localhost
DB_PORT=3306
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}

IP_HASH_SECRET=${IP_HASH_SECRET}

RATE_LIMIT_CREATE_PER_HOUR=20

SHORTCODE_LENGTH=7
SHORTCODE_MIN_CUSTOM=3
SHORTCODE_MAX_CUSTOM=20
ENV

chown "$APP_USER:$APP_USER" "$APP_DIR/.env"
chmod 600 "$APP_DIR/.env"
log_ok ".env-Datei erstellt (chmod 600)"

# ============================================================================
# 9. Apache-vHost konfigurieren
# ============================================================================

log_step "9/10  Apache-vHost konfigurieren"

cat > /etc/apache2/sites-available/msk-shortener.conf << APACHE
<VirtualHost *:80>
    ServerName ${DOMAIN}
    ServerAdmin webmaster@${DOMAIN}

    # Reverse-Proxy zu Next.js (Port ${NEXT_PORT})
    ProxyPreserveHost   On
    ProxyRequests       Off
    ProxyTimeout        60

    ProxyPass        / http://127.0.0.1:${NEXT_PORT}/
    ProxyPassReverse / http://127.0.0.1:${NEXT_PORT}/

    # Headers für Client-IP & Protokoll
    RequestHeader set X-Forwarded-Proto "http"
    RequestHeader set X-Forwarded-Host  "%{HTTP_HOST}e"
    RequestHeader set X-Real-IP         "%{REMOTE_ADDR}s"

    # Gzip-Kompression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/css text/javascript
        AddOutputFilterByType DEFLATE application/javascript application/json
        AddOutputFilterByType DEFLATE image/svg+xml
    </IfModule>

    ErrorLog  \${APACHE_LOG_DIR}/msk-shortener-error.log
    CustomLog \${APACHE_LOG_DIR}/msk-shortener-access.log combined
    LogLevel warn
</VirtualHost>
APACHE

a2ensite msk-shortener >/dev/null 2>&1
apache2ctl configtest >/dev/null
systemctl reload apache2
log_ok "Apache2 vHost aktiviert"

if command -v ufw &>/dev/null && ufw status | grep -q "Status: active"; then
    ufw allow 'Apache Full' >/dev/null
    log_ok "UFW: Port 80 + 443 freigegeben"
fi

# ============================================================================
# 10. SSL via Let's Encrypt (optional)
# ============================================================================

log_step "10/10  SSL-Zertifikat"

if [[ "$USE_SSL" == "yes" ]]; then
    log_info "Beantrage Let's Encrypt Zertifikat für ${DOMAIN}…"
    if certbot --apache --non-interactive \
        --agree-tos --email "$LE_EMAIL" \
        --redirect --no-eff-email \
        -d "$DOMAIN"; then
        log_ok "SSL aktiv – HTTPS erzwungen"
    else
        log_warn "Certbot fehlgeschlagen. Manuelle Ausführung:"
        echo "  sudo certbot --apache -d ${DOMAIN}"
    fi
else
    log_info "SSL übersprungen – später mit: sudo certbot --apache -d ${DOMAIN}"
fi

# ============================================================================
# Fertig!
# ============================================================================

echo ""
echo -e "${BOLD}${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${GREEN}║       Server-Setup erfolgreich abgeschlossen!         ║${NC}"
echo -e "${BOLD}${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BOLD}🚀 Nächste Schritte:${NC}"
echo ""
echo "1. GitHub-Repository einrichten und folgende ${BOLD}Secrets${NC} hinterlegen:"
echo "   (Settings → Secrets and variables → Actions)"
echo ""
echo -e "   ${CYAN}FTP_SERVER${NC}           = IP/Hostname dieses Servers"
echo -e "   ${CYAN}FTP_USERNAME${NC}         = ${APP_USER}"
echo -e "   ${CYAN}FTP_PORT${NC}             = 22 (oder dein SSH-Port)"
echo -e "   ${CYAN}SSH_PRIVATE_KEY${NC}      = Private Key für ${APP_USER}"
echo -e "   ${CYAN}NEXT_PUBLIC_BASE_URL${NC} = https://${DOMAIN}"
echo -e "   ${CYAN}DB_HOST${NC}              = localhost"
echo -e "   ${CYAN}DB_PORT${NC}              = 3306"
echo -e "   ${CYAN}DB_USER${NC}              = ${DB_USER}"
echo -e "   ${CYAN}DB_PASSWORD${NC}          = ${DB_PASSWORD}"
echo -e "   ${CYAN}DB_NAME${NC}              = ${DB_NAME}"
echo -e "   ${CYAN}IP_HASH_SECRET${NC}       = ${IP_HASH_SECRET}"
echo ""
echo "2. Push auf 'main' → GitHub Actions deployt automatisch."
echo ""
echo -e "${BOLD}📁 Wichtige Pfade:${NC}"
echo "   App:    ${APP_DIR}"
echo "   Config: ${APP_DIR}/.env"
echo "   Apache: /etc/apache2/sites-available/msk-shortener.conf"
echo ""
echo -e "${BOLD}🔧 Nützliche Befehle (nach erstem Deploy):${NC}"
echo "   Service-Status:   systemctl status msk-shortener"
echo "   Service-Logs:     journalctl -u msk-shortener -f"
echo "   Service-Neustart: systemctl restart msk-shortener"
echo "   Backup:           sudo bash ${APP_DIR}/deployment/scripts/backup.sh"
echo ""
echo -e "${YELLOW}⚠  Speichere die oben angezeigten Secrets sicher ab!${NC}"
echo -e "${YELLOW}    Sie sind auch in ${APP_DIR}/.env hinterlegt.${NC}"
echo ""
