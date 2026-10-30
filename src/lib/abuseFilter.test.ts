import { describe, expect, it } from 'vitest'
import { checkUrlForAbuse, looksLikePhishingHost } from './abuseFilter'

const OWN = 'https://s.msk-scripts.de'

describe('phishing hostnames', () => {
  it('blocks the phishing hosts found in the database', () => {
    for (const host of [
      'iaccess-update-login.org.nz',
      'officialupdate-iaccess.org.nz',
      'lbpiaccess-mobile-login.info',
      'vinted.verificationpage.sbs',
    ]) {
      expect(looksLikePhishingHost(host), host).toBe(true)
    }
  })

  it('lets real login and account hosts through', () => {
    for (const host of [
      'accounts.google.com',
      'login.microsoftonline.com',
      'github.com',
      'www.reddit.com',
      'cryptpad.fr',
      'docu.msk-scripts.de',
      'secure.example-shop.de',
    ]) {
      expect(looksLikePhishingHost(host), host).toBe(false)
    }
  })

  it('blocks one bait word with a cheap TLD, many hyphens or punycode', () => {
    expect(looksLikePhishingHost('paypal-verify.top')).toBe(true)
    expect(looksLikePhishingHost('my-bank-login-portal.de')).toBe(true)
    expect(looksLikePhishingHost('xn--pypal-4ve.login.com')).toBe(true)
  })
})

describe('checkUrlForAbuse', () => {
  it('accepts an ordinary link', () => {
    expect(checkUrlForAbuse('https://www.msk-scripts.de/de/shop', OWN)).toEqual({ blocked: false })
  })

  it('blocks links to itself and to other shorteners, also through subdomains', () => {
    expect(checkUrlForAbuse('https://s.msk-scripts.de/abc', OWN)).toEqual({ blocked: true, reason: 'own-link' })
    expect(checkUrlForAbuse('https://bit.ly/x', OWN)).toEqual({ blocked: true, reason: 'shortener' })
    expect(checkUrlForAbuse('https://www.bit.ly/x', OWN)).toEqual({ blocked: true, reason: 'shortener' })
  })

  it('blocks IP addresses as hosts', () => {
    expect(checkUrlForAbuse('http://203.0.113.7/login', OWN)).toEqual({ blocked: true, reason: 'ip-host' })
    expect(checkUrlForAbuse('http://[2001:db8::1]/', OWN)).toEqual({ blocked: true, reason: 'ip-host' })
  })

  it('blocks phishing hosts', () => {
    expect(checkUrlForAbuse('https://vinted.verificationpage.sbs/item/1', OWN)).toEqual({ blocked: true, reason: 'phishing' })
  })
})
