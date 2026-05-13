import mysql from 'mysql2/promise'

// ─── ENV-Validierung (lazy) ────────────────────────────────────────
const REQUIRED_ENV = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'] as const

/**
 * Prüft, ob alle benötigten ENV-Variablen gesetzt sind.
 * Wird beim ersten getPool()-Aufruf zur Runtime ausgeführt,
 * NICHT beim Modul-Import (damit Build-Time funktioniert).
 */
function validateEnv(): void {
  for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
      throw new Error(`Fehlende ENV-Variable: ${key}`)
    }
  }
}

// ─── Typen ────────────────────────────────────────────────────────────

/**
 * Erlaubte Parameter-Typen für prepared statements.
 * Entspricht den von mysql2 unterstützten Werten.
 */
export type SqlParam =
  | string
  | number
  | boolean
  | bigint
  | Date
  | Buffer
  | null
  | undefined

export type SqlParams = ReadonlyArray<SqlParam>

// ─── Connection Pool ──────────────────────────────────────────────────
let pool: mysql.Pool | null = null

export function getPool(): mysql.Pool {
  if (pool) return pool

  // Lazy: ENV erst prüfen wenn die DB wirklich gebraucht wird
  validateEnv()

  pool = mysql.createPool({
    host:           process.env.DB_HOST,
    port:           Number(process.env.DB_PORT ?? 3306),
    user:           process.env.DB_USER,
    password:       process.env.DB_PASSWORD,
    database:       process.env.DB_NAME,

    // Connection-Settings
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
    enableKeepAlive:    true,
    keepAliveInitialDelay: 10_000,

    // Charset & Timezone
    charset:        'utf8mb4_unicode_ci',
    timezone:       '+00:00',
    dateStrings:    false,

    // Numeric-Handling für BIGINT
    supportBigNumbers: true,
    bigNumberStrings:  false,
  })

  return pool
}

// ─── Query-Helpers ────────────────────────────────────────────────────

/**
 * Führt ein SELECT aus und gibt das erste Ergebnis zurück (oder null).
 */
export async function queryOne<T = unknown>(
  sql: string,
  params: SqlParams = []
): Promise<T | null> {
  const [rows] = await getPool().execute<mysql.RowDataPacket[]>(sql, params as any[])
  return (rows[0] as T | undefined) ?? null
}

/**
 * Führt ein SELECT aus und gibt alle Ergebnisse zurück.
 */
export async function queryMany<T = unknown>(
  sql: string,
  params: SqlParams = []
): Promise<T[]> {
  const [rows] = await getPool().execute<mysql.RowDataPacket[]>(sql, params as any[])
  return rows as T[]
}

/**
 * Führt INSERT/UPDATE/DELETE aus und gibt das Result-Header-Object zurück.
 */
export async function execute(
  sql: string,
  params: SqlParams = []
): Promise<mysql.ResultSetHeader> {
  const [result] = await getPool().execute<mysql.ResultSetHeader>(sql, params as any[])
  return result
}

/**
 * Schließt den Pool – nur für Migrations-Scripts & Tests.
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}
