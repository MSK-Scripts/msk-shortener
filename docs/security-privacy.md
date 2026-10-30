# Security and privacy

## 🔒 Security & Privacy

MSK Shortener is built with GDPR compliance and personal privacy in mind.

- **No IP addresses stored in plain text** — only salted HMAC hashes
- **No GeoIP lookups** — country/region data is never collected
- **No third-party trackers** — no Google Analytics, no Plausible, nothing
- **No tracking cookies** — the only cookie sets the user's chosen language
- **Password hashing** — bcrypt with cost factor 12
- **SSRF protection** — private IP ranges (RFC 1918, loopback, link-local) are rejected as targets
- **Rate limiting** — abuse protection per IP
- **Spam and phishing protection** — Cloudflare Turnstile on the form, a honeypot, a signed form timestamp,
  daily limits per IP, and targets checked for phishing hostnames, IP hosts and other shorteners
- **Strict CSP headers** — defense in depth against XSS

A full **privacy policy** in German and English is available at [`/privacy`](https://s.msk-scripts.de/privacy) on every instance.

To report a security issue, see [`SECURITY.md`](../SECURITY.md).
