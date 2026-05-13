#!/usr/bin/env bash
# ============================================================================
# MSK Shortener – Backup-Script
#
# Erstellt einen gzip-komprimierten Dump der MariaDB-Datenbank.
# Behält die letzten 14 Backups, ältere werden automatisch gelöscht.
#
# Nutzung: sudo bash /opt/msk-shortener/deployment/scripts/backup.sh
# Cron:    0 3 * * * /opt/msk-shortener/deployment/scripts/backup.sh
# ============================================================================

set -euo pipefail

APP_DIR="/opt/msk-shortener"
BACKUP_DIR="/var/backups/msk-shortener"
RETENTION_DAYS=14

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log_ok()  { echo -e "${GREEN}✓${NC}  $1"; }
log_err() { echo -e "${RED}✗${NC}  $1" >&2; }

# Root-Check
if [[ $EUID -ne 0 ]]; then
    log_err "Bitte mit sudo ausführen"
    exit 1
fi

# ─── .env laden ──────────────────────────────────────────────────────
if [[ ! -f "$APP_DIR/.env" ]]; then
    log_err ".env nicht gefunden unter $APP_DIR"
    exit 1
fi

# shellcheck disable=SC1091
set -o allexport
source <(grep -E '^(DB_NAME|DB_USER|DB_PASSWORD|DB_HOST|DB_PORT)=' "$APP_DIR/.env")
set +o allexport

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"

# ─── Backup-Verzeichnis vorbereiten ──────────────────────────────────
mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

# ─── Dump erstellen ──────────────────────────────────────────────────
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_FILE="$BACKUP_DIR/msk-shortener-${TIMESTAMP}.sql.gz"

mariadb-dump \
    --host="$DB_HOST" \
    --port="$DB_PORT" \
    --user="$DB_USER" \
    --password="$DB_PASSWORD" \
    --single-transaction \
    --quick \
    --routines \
    --triggers \
    --add-drop-table \
    "$DB_NAME" 2>/dev/null \
    | gzip -9 > "$BACKUP_FILE"

chmod 600 "$BACKUP_FILE"

SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
log_ok "Backup erstellt: $BACKUP_FILE (${SIZE})"

# ─── Alte Backups bereinigen ─────────────────────────────────────────
DELETED=$(find "$BACKUP_DIR" -name "msk-shortener-*.sql.gz" -mtime +${RETENTION_DAYS} -delete -print | wc -l)
if [[ $DELETED -gt 0 ]]; then
    log_ok "${DELETED} alte Backup(s) gelöscht (älter als ${RETENTION_DAYS} Tage)"
fi

TOTAL=$(find "$BACKUP_DIR" -name "msk-shortener-*.sql.gz" | wc -l)
echo "Backups im Verzeichnis: ${TOTAL}"
