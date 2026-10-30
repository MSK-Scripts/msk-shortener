# REST API and API keys

## 📡 REST API

Reading is open. Shortening a link from a script needs an API key, issued by the operator on the
server (see [API keys](#-api-keys)); without one, `POST /api/links` only accepts the site's own form.

Full documentation: **[docu.msk-scripts.de/shortener](https://docu.msk-scripts.de/shortener)**

### Create a link

```bash
curl -X POST https://s.msk-scripts.de/api/links \
  -H "Authorization: Bearer msks_…" \
  -H "Content-Type: application/json" \
  -d '{
    "url":        "https://msk-scripts.de",
    "customCode": "msk",
    "expiresAt":  "2026-12-31T23:59:59Z"
  }'
```

**Response:**

```json
{
  "shortCode":   "msk",
  "shortUrl":    "https://s.msk-scripts.de/msk",
  "deleteToken": "dk_a7c4f2…",
  "expiresAt":   "2026-12-31T23:59:59.000Z",
  "hasPassword": false
}
```

### Other endpoints

| Method | Path | Description |
|---|---|---|
| `POST`   | `/api/links` | Create a new short link (API key required) |
| `GET`    | `/api/links/:code` | Look up a link |
| `DELETE` | `/api/links/:code` | Delete a link (requires `deleteToken`) |
| `GET`    | `/api/links/:code/stats` | Get click statistics for one link |
| `GET`    | `/api/links/:code/qr` | QR code as PNG or SVG |
| `GET`    | `/api/stats` | Global statistics across all links |
| `POST`   | `/api/verify` | Verify a password-protected link |

## 🔑 API keys

Only someone with a shell on the server and read access to the app's `.env` can manage keys. A key is
shown once when it is created; the database keeps only a scrypt hash of it.

```bash
/opt/msk-shortener/scripts/api-key.sh help                     # all commands
/opt/msk-shortener/scripts/api-key.sh list                     # id, prefix, label, last use, state
/opt/msk-shortener/scripts/api-key.sh create "<label>"         # issue a key
/opt/msk-shortener/scripts/api-key.sh revoke <key|prefix|id>   # block it, keep the row
/opt/msk-shortener/scripts/api-key.sh delete <key|prefix|id>   # remove it
```
