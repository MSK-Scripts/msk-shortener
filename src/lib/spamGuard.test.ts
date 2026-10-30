import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./links', () => ({ recentLinkCountByIp: vi.fn() }))
vi.mock('./turnstile', () => ({ verifyTurnstile: vi.fn() }))
vi.mock('./apiKeys', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./apiKeys')>()),
  findActiveApiKey: vi.fn(),
}))

import { findActiveApiKey } from './apiKeys'
import { issueFormStamp } from './formStamp'
import { recentLinkCountByIp } from './links'
import { guardCreate } from './spamGuard'
import { verifyTurnstile } from './turnstile'

const ORIGIN = 'https://s.msk-scripts.de'
const TARGET = 'https://www.msk-scripts.de/de/shop'

function headers(values: Record<string, string>) {
  return { get: (name: string) => values[name.toLowerCase()] ?? null }
}

/** A stamp issued long enough ago to pass the fill-time check. */
function oldStamp() {
  return issueFormStamp(Date.now() - 10_000)
}

function formRequest(url: string, proof: Record<string, unknown> = {}) {
  return guardCreate({
    headers: headers({ origin: ORIGIN }),
    url,
    proof:   { formStamp: oldStamp(), turnstileToken: 'token', ...proof },
    ip:      '203.0.113.7',
    ipHash:  'a'.repeat(64),
  })
}

function keyRequest(authorization: string, url = TARGET) {
  return guardCreate({
    headers: headers({ authorization }),
    url,
    proof:   {},
    ip:      '203.0.113.7',
    ipHash:  'a'.repeat(64),
  })
}

const KEY_ROW = {
  id: 1, key_prefix: 'msks_abcdefgh', label: 'test',
  created_at: new Date(), last_used_at: null, revoked_at: null,
}

beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'production')
  vi.stubEnv('NEXT_PUBLIC_BASE_URL', ORIGIN)
  vi.mocked(recentLinkCountByIp).mockResolvedValue(0)
  vi.mocked(verifyTurnstile).mockResolvedValue('ok')
  vi.mocked(findActiveApiKey).mockResolvedValue(null)
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.clearAllMocks()
})

describe('the form', () => {
  it('lets a person through', async () => {
    expect(await formRequest(TARGET)).toEqual({ ok: true, via: 'form' })
  })

  it('sends a script without key and without origin to the API key', async () => {
    const result = await guardCreate({
      headers: headers({}),
      url:     TARGET,
      proof:   {},
      ip:      '203.0.113.7',
      ipHash:  'a'.repeat(64),
    })
    expect(result).toMatchObject({ ok: false, status: 401, code: 'api-key-required' })
  })

  it('turns down another origin, a filled honeypot and a missing stamp', async () => {
    const foreign = await guardCreate({
      headers: headers({ origin: 'https://evil.example' }),
      url:     TARGET,
      proof:   { formStamp: oldStamp(), turnstileToken: 'token' },
      ip:      '203.0.113.7',
      ipHash:  'a'.repeat(64),
    })
    expect(foreign).toMatchObject({ code: 'origin' })
    expect(await formRequest(TARGET, { website: 'x' })).toMatchObject({ code: 'rejected' })
    expect(await formRequest(TARGET, { formStamp: undefined })).toMatchObject({ code: 'stamp-invalid' })
  })

  it('turns down phishing, own links and other shorteners before spending the token', async () => {
    expect(await formRequest('https://vinted.verificationpage.sbs/x')).toMatchObject({ status: 422, code: 'phishing' })
    expect(await formRequest('https://s.msk-scripts.de/abc')).toMatchObject({ code: 'own-link' })
    expect(await formRequest('https://bit.ly/abc')).toMatchObject({ code: 'shortener' })
    expect(verifyTurnstile).not.toHaveBeenCalled()
  })

  it('turns down an address over its daily count', async () => {
    vi.mocked(recentLinkCountByIp).mockResolvedValue(20)
    expect(await formRequest(TARGET)).toMatchObject({ ok: false, status: 429, code: 'daily-limit' })
  })

  it('needs a solved captcha and fails closed without Cloudflare', async () => {
    vi.mocked(verifyTurnstile).mockResolvedValue('invalid')
    expect(await formRequest(TARGET)).toMatchObject({ status: 403, code: 'captcha' })
    vi.mocked(verifyTurnstile).mockResolvedValue('not-configured')
    expect(await formRequest(TARGET)).toMatchObject({ status: 503, code: 'captcha-unavailable' })
  })
})

describe('an API key', () => {
  it('lets a valid key through without form checks', async () => {
    vi.mocked(findActiveApiKey).mockResolvedValue(KEY_ROW)
    expect(await keyRequest('Bearer msks_valid')).toEqual({ ok: true, via: 'api-key' })
    expect(verifyTurnstile).not.toHaveBeenCalled()
    expect(recentLinkCountByIp).not.toHaveBeenCalled()
  })

  it('turns down an unknown or revoked key', async () => {
    expect(await keyRequest('Bearer msks_unknown')).toMatchObject({ status: 401, code: 'api-key-invalid' })
  })

  it('still checks the target', async () => {
    vi.mocked(findActiveApiKey).mockResolvedValue(KEY_ROW)
    expect(await keyRequest('Bearer msks_valid', 'http://203.0.113.7/login')).toMatchObject({ code: 'ip-host' })
  })
})
