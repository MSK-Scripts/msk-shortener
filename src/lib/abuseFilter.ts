import { isIP } from 'net'

/**
 * What a short link may point to.
 *
 * 1. No chains through other shorteners, no links to our own short links.
 * 2. No hosts on the operator's block lists.
 * 3. No IP addresses as hosts: real sites have names, phishing kits often don't.
 * 4. No hostnames built like phishing pages. Measured on the production data
 *    in October 2026: `iaccess-update-login.org.nz`,
 *    `lbpiaccess-mobile-login.info`, `vinted.verificationpage.sbs`. They pile
 *    up words that promise a login or an account, or pair one of them with a
 *    cheap TLD or a hyphenated name. A real login page sits on its own short
 *    domain (`login.microsoftonline.com`, `accounts.google.com`) and passes.
 */

export type UrlVerdict =
  | { blocked: false }
  | { blocked: true; reason: 'invalid' | 'own-link' | 'shortener' | 'blocked-host' | 'ip-host' | 'phishing' }

const SHORTENER_DOMAINS = new Set<string>([
  'bit.ly', 'bitly.com', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'ow.ly', 'buff.ly',
  'tiny.cc', 'shorturl.at', 'rebrand.ly', 'cutt.ly', 's.id', 'rb.gy',
])

/** Hosts seen in phishing links; a host matches itself and its subdomains. */
const BLOCKED_HOSTS = new Set<string>([])

/** TLDs given away cheaply and common in phishing; not blocked alone. */
const CHEAP_TLDS = new Set<string>([
  'sbs', 'top', 'xyz', 'icu', 'cfd', 'rest', 'buzz', 'monster', 'cyou', 'quest', 'click',
  'link', 'live', 'site', 'online', 'info', 'store', 'tk', 'ml', 'ga', 'cf', 'gq', 'zip',
  'mov', 'support', 'help', 'cam', 'lol', 'bond', 'pw', 'website', 'space', 'fun', 'world',
])

/** Words that promise a login, an account or a payment. */
const BAIT_WORDS = [
  'login', 'logon', 'signin', 'sign-in', 'verify', 'verification', 'validate', 'secure',
  'security', 'account', 'update', 'confirm', 'auth', 'access', 'wallet', 'recover', 'unlock',
  'unblock', 'billing', 'payment', 'invoice', 'refund', 'banking', 'webmail', 'password',
]

/** True when the host or one of its parents is in the set. */
function hostIn(set: Set<string>, host: string): boolean {
  const labels = host.split('.')
  for (let i = 0; i < labels.length - 1; i++) {
    if (set.has(labels.slice(i).join('.'))) return true
  }
  return false
}

/** True for a hostname built like a phishing page (see the module comment). */
export function looksLikePhishingHost(host: string): boolean {
  const labels = host.split('.')
  const tld = labels[labels.length - 1] ?? ''
  const name = labels.slice(0, -1).join('.')

  const bait = BAIT_WORDS.filter((word) => name.includes(word)).length
  if (bait >= 2) return true
  if (bait === 0) return false

  const hyphens = (name.match(/-/g) ?? []).length
  const punycode = labels.some((label) => label.startsWith('xn--'))
  return CHEAP_TLDS.has(tld) || hyphens >= 2 || punycode
}

/** Checks the target of a new short link. */
export function checkUrlForAbuse(url: string, ownBaseUrl = process.env.NEXT_PUBLIC_BASE_URL): UrlVerdict {
  let host: string
  try {
    host = new URL(url).hostname.toLowerCase().replace(/\.$/, '')
  } catch {
    return { blocked: true, reason: 'invalid' }
  }

  if (ownBaseUrl) {
    try {
      if (host === new URL(ownBaseUrl).hostname.toLowerCase()) return { blocked: true, reason: 'own-link' }
    } catch {
      // A broken base URL is a configuration problem, not the visitor's.
    }
  }

  if (hostIn(SHORTENER_DOMAINS, host)) return { blocked: true, reason: 'shortener' }
  if (hostIn(BLOCKED_HOSTS, host)) return { blocked: true, reason: 'blocked-host' }
  if (isIP(host.replace(/^\[|\]$/g, ''))) return { blocked: true, reason: 'ip-host' }
  if (looksLikePhishingHost(host)) return { blocked: true, reason: 'phishing' }
  return { blocked: false }
}
