import bcrypt from 'bcryptjs'
import { execute, queryOne } from './db'
import {
  generateUniqueShortCode,
  isCustomCodeAvailable,
  isValidCustomCodeFormat,
  generateDeleteToken,
} from './shortcode'
import { hashIp } from './rateLimit'
import type { Link } from '@/types'

const BCRYPT_ROUNDS = 12

// ─── Custom-Errors ────────────────────────────────────────────────────

export class LinkServiceError extends Error {
  constructor(message: string, public status: number = 400) {
    super(message)
    this.name = 'LinkServiceError'
  }
}

// ─── Service-Methoden ────────────────────────────────────────────────

interface CreateLinkOptions {
  url:         string
  customCode?: string
  password?:   string
  expiresAt?:  Date | null
  clientIp:    string
}

interface CreateLinkResult {
  link:        Link
  deleteToken: string
}

/**
 * Erstellt einen neuen Kurz-Link.
 * Wirft LinkServiceError bei Validierungsfehlern.
 */
export async function createLink(opts: CreateLinkOptions): Promise<CreateLinkResult> {
  const { url, customCode, password, expiresAt, clientIp } = opts

  // ─── Short-Code bestimmen ────────────────────────────────────────
  let shortCode: string

  if (customCode && customCode.trim().length > 0) {
    const code = customCode.trim()

    if (!isValidCustomCodeFormat(code)) {
      throw new LinkServiceError(
        'Custom-Code hat ein ungültiges Format (nur a-z, A-Z, 0-9, _, -)',
        400
      )
    }

    const available = await isCustomCodeAvailable(code)
    if (!available) {
      throw new LinkServiceError('Dieser Custom-Code ist bereits vergeben', 409)
    }

    shortCode = code
  } else {
    shortCode = await generateUniqueShortCode()
  }

  // ─── Passwort hashen (falls vorhanden) ───────────────────────────
  const passwordHash = password && password.length > 0
    ? await bcrypt.hash(password, BCRYPT_ROUNDS)
    : null

  // ─── Delete-Token & IP-Hash generieren ───────────────────────────
  const deleteToken = generateDeleteToken()
  const ipHash      = hashIp(clientIp)

  // ─── In DB speichern ─────────────────────────────────────────────
  const result = await execute(
    `INSERT INTO links
       (short_code, original_url, password_hash, expires_at, delete_token, created_ip_hash)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [shortCode, url, passwordHash, expiresAt ?? null, deleteToken, ipHash]
  )

  // ─── Erstellten Link zurücklesen ─────────────────────────────────
  const link = await queryOne<Link>(
    'SELECT * FROM links WHERE id = ?',
    [result.insertId]
  )

  if (!link) {
    throw new LinkServiceError('Link konnte nicht erstellt werden', 500)
  }

  return { link, deleteToken }
}

/**
 * Holt einen Link anhand seines Short-Codes.
 * Gibt null zurück, wenn nicht gefunden.
 */
export async function getLinkByCode(shortCode: string): Promise<Link | null> {
  return queryOne<Link>(
    'SELECT * FROM links WHERE short_code = ?',
    [shortCode]
  )
}

/**
 * Verifiziert das Passwort eines Links.
 * Gibt die Original-URL zurück bei Erfolg, sonst null.
 */
export async function verifyLinkPassword(
  shortCode: string,
  password: string
): Promise<Link | null> {
  const link = await getLinkByCode(shortCode)
  if (!link || !link.password_hash) return null
  if (isLinkExpired(link))           return null

  const valid = await bcrypt.compare(password, link.password_hash)
  return valid ? link : null
}

/**
 * Erhöht den Click-Counter atomar.
 */
export async function incrementClickCount(linkId: number): Promise<void> {
  await execute(
    'UPDATE links SET click_count = click_count + 1 WHERE id = ?',
    [linkId]
  )
}

/**
 * Löscht einen Link anhand seines Delete-Tokens.
 * Gibt true zurück bei Erfolg, false wenn Token ungültig.
 */
export async function deleteLinkByToken(
  shortCode: string,
  deleteToken: string
): Promise<boolean> {
  const result = await execute(
    'DELETE FROM links WHERE short_code = ? AND delete_token = ?',
    [shortCode, deleteToken]
  )
  return result.affectedRows > 0
}

/**
 * Prüft, ob ein Link abgelaufen ist.
 */
export function isLinkExpired(link: Link): boolean {
  if (!link.expires_at) return false
  return new Date(link.expires_at) <= new Date()
}
