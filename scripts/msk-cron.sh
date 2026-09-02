#!/bin/bash
#
# Wrapper für die Cron-Jobs von msk-shortener.
#
# ── Warum es das gibt ───────────────────────────────────────────────────────
#
# Der Cleanup-Job lief zuletzt am 06.06.2026. Danach nicht mehr, weil kein
# Crontab-Eintrag mehr auf ihn zeigte. Auffällig war das nie: das Logfile
# /var/log/msk-shortener-cleanup.log lag weiter da, mit einem Eintrag, der
# freundlich "Keine abgelaufenen Links gefunden" meldete. Ein Job, der nicht
# läuft, sieht in seinem eigenen Log genauso aus wie einer, der nichts zu tun
# hat.
#
# Die Folge war still und trotzdem falsch: abgelaufene Links blieben in der
# Datenbank stehen. Die Anwendung weist sie zwar mit 410 ab, aber die
# Datenschutzseite sagt zu, dass ein Link "bis zum Ablaufdatum" gespeichert
# wird, und das stimmte drei Monate lang nicht.
#
# ── Warum nicht einfach eine Crontab-Zeile ──────────────────────────────────
#
# Die übliche Kette
#
#   cd /opt/msk-shortener && npx tsx scripts/cleanup.ts >> /var/log/... 2>&1
#
# hat zwei Schwächen. Die Umleitung hängt nur am letzten Kommando: scheitert
# das `cd`, landet der Fehler nicht im Log, sondern in der Cron-Mail. Genau so
# lagen bei msk-shop am 29.08.2026 drei Jobs drei Tage still (siehe
# msk-shop/scripts/msk-cron.sh). Und `npx` greift zum Netz, wenn das Paket
# lokal fehlt, statt sofort und deutlich zu scheitern.
#
# Hier passiert die Umleitung deshalb vor allem anderen, und der Runner wird
# mit absolutem Pfad aufgerufen.
#
# ── Wie der Alarm funktioniert ──────────────────────────────────────────────
#
# Die ursprünglichen Kanäle von Cron werden auf 3 und 4 gerettet, bevor stdout
# ins Log umgebogen wird. Läuft der Job durch, schreibt der Wrapper nichts auf
# Kanal 3, Cron sieht keine Ausgabe und verschickt keine Mail. Erst ein
# Fehlschlag erzeugt eine Zusammenfassung, und die wird zur Mail an das
# `MAILTO` der Crontab.
#
# Eine Mail bedeutet damit, dass etwas kaputt ist. Ein täglicher Bericht, den
# niemand liest, hätte drei Monate Stillstand genauso wenig aufgedeckt wie gar
# keine Mail.
#
# ── Aufruf ──────────────────────────────────────────────────────────────────
#
#   /opt/msk-shortener/scripts/msk-cron.sh cleanup
#
# Läuft als root aus der Crontab. Die Datei liegt im Repo und wird mit jedem
# Deploy aktualisiert.

set -uo pipefail

BASE=/opt/msk-shortener
NODE_BIN=/usr/bin/node
TSX="$BASE/node_modules/.bin/tsx"

# Allow-list statt freier Skriptname. Der Wrapper läuft als root aus der
# Crontab; ein durchgereichter Pfad wäre eine Einladung, und ein Tippfehler
# würde sonst als "kann Datei nicht finden" enden statt als klarer Fehler.
case "${1:-}" in
  cleanup) JOB="$1" ;;
  *)
    echo "Aufruf: $0 {cleanup}" >&2
    exit 64   # EX_USAGE
    ;;
esac

LOG="/var/log/msk-shortener-${JOB}.log"

# Originale Kanäle sichern, BEVOR umgeleitet wird. Auf 3 landet später nur der
# Fehlerfall, und genau daraus macht Cron die Mail.
exec 3>&1 4>&2
exec >> "$LOG" 2>&1

started=$(date -Is)
echo "=== $started  start $JOB (pid $$)"

fail() {
  local rc="$1" msg="$2"
  echo "=== $(date -Is)  ENDE $JOB FEHLGESCHLAGEN rc=$rc: $msg"
  {
    echo "Cron-Job '$JOB' auf $(hostname -f) fehlgeschlagen."
    echo "Beginn:    $started"
    echo "Ende:      $(date -Is)"
    echo "Exit-Code: $rc"
    echo "Grund:     $msg"
    echo "Log:       $LOG"
    echo
    echo "--- letzte 40 Zeilen ---"
    tail -n 40 "$LOG"
  } >&3
  exit "$rc"
}

# ── Voraussetzungen ─────────────────────────────────────────────────────────
#
# cleanup.ts lädt seine .env selbst über `process.cwd()`, deshalb muss der
# Wrapper ins Anwendungsverzeichnis wechseln. Ein fehlgeschlagenes `cd` ist
# genau der Fall, der in der alten Kette keine Spur hinterlassen hätte.
cd "$BASE" || fail 72 "$BASE nicht erreichbar"        # EX_OSFILE

if [ ! -r "$BASE/.env" ]; then
  fail 78 "$BASE/.env ist nicht lesbar"               # EX_CONFIG
fi

# tsx kommt aus `npm install --no-save tsx` im Deploy und liegt deshalb nicht
# in der Lockfile. Fehlt es, ist der Deploy unvollständig, und das soll laut
# gesagt werden statt in einem npx-Netzabruf zu enden.
if [ ! -x "$TSX" ]; then
  fail 72 "$TSX fehlt (Deploy unvollstaendig?)"
fi

SCRIPT="$BASE/scripts/${JOB}.ts"
if [ ! -f "$SCRIPT" ]; then
  fail 72 "$SCRIPT fehlt"
fi

# ── Job ausführen ───────────────────────────────────────────────────────────
"$NODE_BIN" "$TSX" "$SCRIPT"
rc=$?

if [ "$rc" -ne 0 ]; then
  fail "$rc" "das Skript endete mit einem Fehler"
fi

echo "=== $(date -Is)  ende $JOB rc=0"
exit 0
