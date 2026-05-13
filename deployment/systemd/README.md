# Veraltete systemd-Dateien

Die aktuelle `msk-shortener.service` liegt jetzt im **Repo-Root**, damit sie via GitHub Actions
SCP-Transfer mit ausgeliefert werden kann.

Die Datei `msk-shortener.service.old` ist nur als Referenz hier und kann gelöscht werden.
Sie verwendet noch den alten Pfad `/var/www/` und den dedizierten User `mskshortener`.

**Aktuelle Konvention:**
- Pfad: `/opt/msk-shortener/`
- User: `musiker15`
- Service-Unit-Quelle: `/msk-shortener.service` (Repo-Root)
