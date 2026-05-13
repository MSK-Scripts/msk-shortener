import { NextResponse } from 'next/server'
import type { ApiError } from '@/types'
import { ZodError } from 'zod'

/**
 * Standardisierte Error-Response.
 */
export function jsonError(
  message: string,
  status = 400,
  details?: Record<string, string[]>
): NextResponse<ApiError> {
  return NextResponse.json<ApiError>(
    { error: message, ...(details && { details }) },
    { status }
  )
}

/**
 * Wandelt Zod-Errors in unser ApiError-Format um.
 * In Zod 4 heißt die Property `issues` statt `errors`.
 */
export function zodToApiError(err: ZodError): NextResponse<ApiError> {
  const details: Record<string, string[]> = {}
  for (const issue of err.issues) {
    const field = issue.path.join('.') || '_root'
    if (!details[field]) details[field] = []
    details[field].push(issue.message)
  }
  return jsonError('Validierungsfehler', 400, details)
}

/**
 * Parsed Request-Body als JSON oder gibt einen Error zurück.
 */
export async function parseJsonBody<T = unknown>(
  req: Request
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse<ApiError> }> {
  try {
    const data = (await req.json()) as T
    return { ok: true, data }
  } catch {
    return { ok: false, response: jsonError('Ungültiges JSON', 400) }
  }
}

/**
 * Baut die öffentliche Short-URL aus der ENV-Variable.
 */
export function buildShortUrl(shortCode: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3001'
  return `${base.replace(/\/$/, '')}/${shortCode}`
}
