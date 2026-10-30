import { checkUrlForAbuse } from './abuseFilter'
import { bearerKey, findActiveApiKey } from './apiKeys'
import { checkFormStamp } from './formStamp'
import { recentLinkCountByIp } from './links'
import { checkRateLimit } from './rateLimit'
import { verifyTurnstile } from './turnstile'

/**
 * Who may shorten a link, and where it may point.
 *
 * Two ways in, nothing else:
 * - the site's own form: same origin, an untouched honeypot, a signed form
 *   stamp at least a few seconds old, a solved Turnstile and a daily count
 *   per address;
 * - a script with an API key from scripts/api-key.sh, limited per key.
 * Both pass the target checks (own links, other shorteners, IP hosts,
 * phishing hostnames).
 *
 * Cheap checks run first. Turnstile runs last, because verifying a token
 * spends it: a link turned down for its target keeps its token.
 */

export type GuardCode =
  | 'api-key-required'
  | 'api-key-invalid'
  | 'origin'
  | 'rejected'
  | 'stamp-invalid'
  | 'too-fast'
  | 'stamp-expired'
  | 'own-link'
  | 'shortener'
  | 'blocked-host'
  | 'ip-host'
  | 'phishing'
  | 'daily-limit'
  | 'key-limit'
  | 'key-attempts'
  | 'captcha'
  | 'captcha-unavailable'

export type GuardResult =
  | { ok: true; via: 'form' | 'api-key' }
  | { ok: false; status: number; code: GuardCode; message: string }

/** Fields the form sends besides the link. */
export interface FormProof {
  website?:        unknown
  formStamp?:      unknown
  turnstileToken?: unknown
}

// ─── Wrong keys per address ──────────────────────────────────────────
// Checking a key costs a scrypt hash, so an address that keeps sending wrong
// keys is stopped before hashing: 10 wrong keys per 10 minutes.
const KEY_FAILURE_LIMIT = 10
const KEY_FAILURE_WINDOW_MS = 10 * 60 * 1000
const keyFailures = new Map<string, { count: number; resetAt: number }>()

function keyFailuresExceeded(address: string, now = Date.now()): boolean {
  const entry = keyFailures.get(address)
  return entry !== undefined && entry.resetAt > now && entry.count >= KEY_FAILURE_LIMIT
}

function recordKeyFailure(address: string, now = Date.now()): void {
  const entry = keyFailures.get(address)
  if (entry && entry.resetAt > now) {
    entry.count++
    return
  }
  if (keyFailures.size > 10_000) {
    for (const [key, value] of keyFailures) if (value.resetAt <= now) keyFailures.delete(key)
  }
  keyFailures.set(address, { count: 1, resetAt: now + KEY_FAILURE_WINDOW_MS })
}

function deny(status: number, code: GuardCode, message: string): GuardResult {
  return { ok: false, status, code, message }
}

function envInt(name: string, fallback: number): number {
  const value = Number(process.env[name])
  return Number.isInteger(value) && value > 0 ? value : fallback
}

function expectedOrigin(): string | null {
  try {
    return new URL(process.env.NEXT_PUBLIC_BASE_URL ?? '').origin
  } catch {
    return null
  }
}

const TARGET_MESSAGES = {
  'invalid':      'Invalid URL',
  'own-link':     'Short links of this service cannot be shortened again',
  'shortener':    'Links of other URL shorteners are not accepted',
  'blocked-host': 'This domain is not allowed',
  'ip-host':      'Links to bare IP addresses are not accepted',
  'phishing':     'This address looks like a phishing page',
} as const

function checkTarget(url: string): GuardResult | null {
  const verdict = checkUrlForAbuse(url)
  if (!verdict.blocked) return null
  const code = verdict.reason === 'invalid' ? 'rejected' : verdict.reason
  return deny(422, code, TARGET_MESSAGES[verdict.reason])
}

/** Checks a request to shorten `url` before anything is stored. */
export async function guardCreate(params: {
  headers: { get(name: string): string | null }
  url:     string
  proof:   FormProof
  ip:      string
  ipHash:  string
}): Promise<GuardResult> {
  const { headers, url, proof, ip, ipHash } = params

  // ─── A script with an API key ───────────────────────────────────
  const key = bearerKey(headers)
  if (key !== null) {
    if (keyFailuresExceeded(ipHash)) {
      return deny(429, 'key-attempts', 'Too many invalid API keys, try again later')
    }
    const row = await findActiveApiKey(key)
    if (!row) {
      recordKeyFailure(ipHash)
      return deny(401, 'api-key-invalid', 'Invalid API key')
    }

    const refused = checkTarget(url)
    if (refused) return refused

    const perHour = envInt('API_KEY_CREATE_PER_HOUR', 120)
    if (!checkRateLimit(`api-key:${row.id}`, perHour, 60 * 60 * 1000).allowed) {
      return deny(429, 'key-limit', 'Hourly limit of this API key reached')
    }
    return { ok: true, via: 'api-key' }
  }

  // ─── The site's own form ────────────────────────────────────────
  const origin = headers.get('origin')
  if (!origin) {
    return deny(401, 'api-key-required', 'Shortening links through the API requires an API key')
  }
  if (process.env.NODE_ENV === 'production' && origin !== expectedOrigin()) {
    return deny(403, 'origin', 'Request from another site')
  }

  // A field people never see; whatever fills it is a bot.
  if (typeof proof.website === 'string' && proof.website.length > 0) {
    return deny(400, 'rejected', 'Request rejected')
  }

  const stamp = checkFormStamp(proof.formStamp)
  if (stamp === 'invalid') return deny(400, 'stamp-invalid', 'Reload the page and try again')
  if (stamp === 'too-fast') return deny(400, 'too-fast', 'Please wait a moment and send again')
  if (stamp === 'expired') return deny(400, 'stamp-expired', 'The page is too old, reload it')

  const refused = checkTarget(url)
  if (refused) return refused

  if ((await recentLinkCountByIp(ipHash)) >= envInt('DAILY_LINKS_PER_IP', 20)) {
    return deny(429, 'daily-limit', 'Daily limit for your address reached')
  }

  const captcha = await verifyTurnstile(proof.turnstileToken, ip)
  if (captcha === 'unavailable' || captcha === 'not-configured') {
    return deny(503, 'captcha-unavailable', 'The spam check is unavailable, try again later')
  }
  if (captcha !== 'ok') return deny(403, 'captcha', 'Captcha not solved')

  return { ok: true, via: 'form' }
}
