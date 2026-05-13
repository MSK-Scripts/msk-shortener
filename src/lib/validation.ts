import { z } from 'zod'

// ─── Hilfs-Schemas ────────────────────────────────────────────────────

/**
 * Validiert URLs:
 * - Muss http:// oder https:// sein
 * - Verbietet localhost/private IPs als Ziel (SSRF-Schutz)
 */
const urlSchema = z
  .string()
  .trim()
  .min(1, 'URL darf nicht leer sein')
  .max(2048, 'URL ist zu lang (max. 2048 Zeichen)')
  .refine((url) => {
    try {
      const parsed = new URL(url)
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
      return false
    }
  }, 'Nur http:// und https:// URLs sind erlaubt')
  .refine((url) => {
    try {
      const parsed = new URL(url)
      const hostname = parsed.hostname.toLowerCase()

      // SSRF-Schutz: Keine privaten/internen Adressen
      const blocked = [
        'localhost', '127.0.0.1', '0.0.0.0', '::1',
      ]
      if (blocked.includes(hostname)) return false

      // Keine privaten IP-Ranges
      if (/^10\./.test(hostname))                 return false
      if (/^192\.168\./.test(hostname))           return false
      if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)) return false
      if (/^169\.254\./.test(hostname))           return false

      return true
    } catch {
      return false
    }
  }, 'Interne / private Adressen sind nicht erlaubt')

const customCodeSchema = z
  .string()
  .trim()
  .min(3,  'Custom-Code muss mindestens 3 Zeichen lang sein')
  .max(20, 'Custom-Code darf maximal 20 Zeichen lang sein')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Nur Buchstaben, Zahlen, _ und - erlaubt')
  .optional()
  .or(z.literal(''))

const passwordSchema = z
  .string()
  .min(4,   'Passwort muss mindestens 4 Zeichen lang sein')
  .max(100, 'Passwort darf maximal 100 Zeichen lang sein')
  .optional()
  .or(z.literal(''))

const expiresAtSchema = z
  .string()
  .datetime({ message: 'Ungültiges Datum (ISO 8601 erforderlich)' })
  .refine((date) => new Date(date) > new Date(), 'Ablaufdatum muss in der Zukunft liegen')
  .optional()
  .or(z.literal(''))
  .or(z.null())

// ─── Request-Schemas ──────────────────────────────────────────────────

export const createLinkSchema = z.object({
  url:         urlSchema,
  customCode:  customCodeSchema,
  password:    passwordSchema,
  expiresAt:   expiresAtSchema,
})

export const verifyPasswordSchema = z.object({
  shortCode: z.string().min(3).max(20),
  password:  z.string().min(1).max(100),
})

export const deleteLinkSchema = z.object({
  deleteToken: z.string().length(48),
})

// ─── Inferred Types ───────────────────────────────────────────────────

export type CreateLinkInput     = z.infer<typeof createLinkSchema>
export type VerifyPasswordInput = z.infer<typeof verifyPasswordSchema>
export type DeleteLinkInput     = z.infer<typeof deleteLinkSchema>
