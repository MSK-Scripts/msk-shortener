#!/usr/bin/env bash
# ============================================================================
# MSK Shortener – Update via GitHub Actions
#
# Updates erfolgen automatisch bei Push auf 'main' via GitHub Actions
# (siehe .github/workflows/deploy.yml).
#
# Dieses Script existiert nur noch als manueller Fallback für den Notfall.
# ============================================================================

set -euo pipefail

cat << "EOF"

  Updates laufen automatisch über GitHub Actions.

  → Code-Änderung committen
  → git push origin main
  → GitHub Actions baut & deployt automatisch

  Status der letzten Deployments:
  https://github.com/musiker15/msk-shortener/actions

  Manueller Fallback (auf dem Server):

    cd /opt/msk-shortener
    systemctl stop msk-shortener
    # ... (Build-Artefakte manuell via SCP übertragen) ...
    npm ci --omit=dev
    npm run migrate
    systemctl restart msk-shortener

EOF
