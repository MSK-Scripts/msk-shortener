#!/usr/bin/env bash
# ============================================================================
# MSK Shortener – Backup-Script
#
# Erstellt einen gzip-komprimierten Dump der MariaDB-Datenbank.
# Behält die letzten 14 Backups, ältere werden automatisch gelöscht.
#
# Nutzung: sudo bash /opt/msk-shortener/scripts/backup.sh
# Cron:    0 3 * * * /opt/msk-shortener/scripts/backup.sh
# ============================================================================

set -euo pipefail

APP_DIR="/opt/msk-shortener"
BACKUP_DIR="/var/backups/msk-shortener"
LOG_FILE="/var/log/msk-shortener-backup.log"
RETENTION_DAYS=14

# Farben nur am Terminal. In einer Logdatei sind sie Rauschen, und bis
# zum 03.09.2026 trug die naechtliche Cron-Mail die rohen Escape-Sequenzen.
if [[ -t 1 ]]; then
    GREEN='\033[0;32m'
    RED='\033[0;31m'
    NC='\033[0m'
else
    GREEN=''
    RED=''
    NC=''
fi

log_ok()  { echo -e "${GREEN}✓${NC}  $1"; }
log_err() { echo -e "${RED}✗${NC}  $1" >&2; }

# ─── Cron-Ausgabe: Erfolg schweigt, Fehler meldet sich ───────────────
#
# Die urspruenglichen Kanaele von Cron werden auf 3 und 4 gerettet,
# BEVOR stdout ins Log umgebogen wird. Nur der Fehlerpfad schreibt auf
# Kanal 3, ein durchgelaufener Job erzeugt also keine Ausgabe und damit
# keine Mail.
#
# Warum das am 03.09.2026 geaendert wurde: die echo-Zeilen gingen bis
# dahin direkt an Cron. Seit dem MAILTO vom 02.09.2026 hiess das jede
# Nacht eine Erfolgsmeldung samt Escape-Sequenzen, und ein taeglicher
# Bericht, den niemand liest, deckt einen Stillstand genauso wenig auf
# wie gar keine Mail. Gleiche Begruendung wie in
# /opt/msk-shortener/scripts/msk-cron.sh.
exec 3>&1 4>&2
if [[ -w "$(dirname "$LOG_FILE")" || -w "$LOG_FILE" ]]; then
    exec >> "$LOG_FILE" 2>&1
fi

STARTED="$(date -Is)"
echo "=== $STARTED  start backup (pid $$)"

on_exit() {
    local rc=$?
    # Ein mittendrin gestorbener Dump laesst eine .partial zurueck. Die
    # wird entfernt, damit eine abgeschnittene Datei nie als Backup
    # durchgeht.
    if [[ -n "${PARTIAL:-}" && -e "${PARTIAL:-}" ]]; then
        rm -f "$PARTIAL"
        echo "Unvollstaendige Datei entfernt: $PARTIAL"
    fi
    if [[ $rc -ne 0 ]]; then
        echo "=== $(date -Is)  ENDE FEHLGESCHLAGEN rc=$rc"
        {
            echo "Backup 'msk-shortener' auf $(hostname -f) fehlgeschlagen."
            echo "Beginn:    $STARTED"
            echo "Ende:      $(date -Is)"
            echo "Exit-Code: $rc"
            echo "Log:       $LOG_FILE"
            echo
            echo "--- letzte 40 Zeilen ---"
            tail -n 40 "$LOG_FILE" 2>/dev/null
        } >&3
    else
        echo "=== $(date -Is)  ende backup rc=0"
    fi
}
# Ein per Signal beendeter Lauf (Reboot, OOM, systemd-stop, kill) laesst $? im
# EXIT-Trap auf dem Status des letzten FERTIGEN Kommandos stehen, meist also
# auf 0. Der Trap meldete dann Erfolg fuer einen abgebrochenen Lauf, und es
# ginge keine Mail raus. Am 03.09.2026 genau so beobachtet und nachgemessen.
trap 'exit 143' TERM
trap 'exit 130' INT
trap on_exit EXIT

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
PARTIAL="${BACKUP_FILE}.partial"

# Erst nach .partial schreiben, dann umbenennen. Bis zum 03.09.2026 lief
# der Dump direkt in den Zielnamen: ein Abbruch mittendrin hinterliess
# eine abgeschnittene .sql.gz, die von der Aufbewahrung mitgezaehlt wird
# und wie ein gueltiges Backup aussieht. Der EXIT-Trap raeumt sie weg.
#
# stderr geht bewusst nicht mehr nach /dev/null. MariaDB 11.8 gibt die
# Passwort-Warnung, gegen die das gerichtet war, gar nicht mehr aus (auf
# dem Server nachgemessen), es verschluckte also nur echte Fehler.
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
    "$DB_NAME" \
    | gzip -9 > "$PARTIAL"

mv "$PARTIAL" "$BACKUP_FILE"
unset PARTIAL
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
