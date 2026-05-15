import { customAlphabet } from 'nanoid'
import { queryOne } from './db'

// URL-safe Alphabet ohne mehrdeutige Zeichen (0/O, 1/l/I)
const ALPHABET = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'

// Reservierte Codes, die nicht als Short-Code verwendet werden dürfen
const RESERVED = new Set([
  'api', 'stats', 'admin', 'login', 'register', 'logout',
  'password', '_next', 'favicon.ico', 'robots.txt', 'sitemap.xml',
  'about', 'help', 'docs', 'terms', 'privacy', 'imprint', 'impressum',
  'manifest.json', 'icon', 'apple-icon',
])

const DEFAULT_LENGTH = Number(process.env.SHORTCODE_LENGTH ?? 7)

/**
 * Generiert einen zufälligen Short-Code mit gegebener Länge.
 */
export function generateShortCode(length = DEFAULT_LENGTH): string {
  const nanoid = customAlphabet(ALPHABET, length)
  return nanoid()
}

/**
 * Generiert einen einzigartigen Short-Code, der noch nicht in der DB existiert.
 * Macht max. 5 Versuche bei Kollisionen.
 */
export async function generateUniqueShortCode(length = DEFAULT_LENGTH): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateShortCode(length + attempt) // Bei Kollision: länger werden

    if (RESERVED.has(code.toLowerCase())) continue

    const existing = await queryOne(
      'SELECT id FROM links WHERE short_code = ?',
      [code]
    )

    if (!existing) return code
  }

  throw new Error('Konnte keinen einzigartigen Short-Code generieren')
}

/**
 * Prüft, ob ein Custom-Code valide und verfügbar ist.
 */
export async function isCustomCodeAvailable(code: string): Promise<boolean> {
  if (RESERVED.has(code.toLowerCase())) return false

  const existing = await queryOne(
    'SELECT id FROM links WHERE short_code = ?',
    [code]
  )

  return !existing
}

/**
 * Validiert das Format eines Custom-Codes.
 * Erlaubt: a-z, A-Z, 0-9, _, -
 */
export function isValidCustomCodeFormat(code: string): boolean {
  const min = Number(process.env.SHORTCODE_MIN_CUSTOM ?? 3)
  const max = Number(process.env.SHORTCODE_MAX_CUSTOM ?? 20)

  if (code.length < min || code.length > max) return false
  return /^[a-zA-Z0-9_-]+$/.test(code)
}

/**
 * Generiert einen Delete-Token (URL-safe, lang genug für Sicherheit).
 */
export function generateDeleteToken(): string {
  const nanoid = customAlphabet(
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    48
  )
  return nanoid()
}
