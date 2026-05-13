/**
 * MSK Shortener – Migration Runner
 *
 * Führt alle SQL-Dateien in /migrations in alphabetischer Reihenfolge aus.
 * Hält fest, welche Migrationen bereits gelaufen sind (in der Tabelle `_migrations`).
 *
 * Usage: npm run migrate
 */

// WICHTIG: dotenv/config MUSS als allererstes geladen werden,
// damit ENV-Variablen verfügbar sind, bevor db.ts importiert wird.
import 'dotenv/config'

import { readdir, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { getPool, queryMany, execute, closePool } from '../src/lib/db'

const MIGRATIONS_DIR = resolve(process.cwd(), 'migrations')

async function ensureMigrationsTable() {
  await execute(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      filename   VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
}

async function getExecutedMigrations(): Promise<Set<string>> {
  const rows = await queryMany<{ filename: string }>(
    'SELECT filename FROM _migrations'
  )
  return new Set(rows.map((r) => r.filename))
}

async function runMigration(filename: string) {
  const filepath = join(MIGRATIONS_DIR, filename)
  const sql      = await readFile(filepath, 'utf-8')

  // Kommentare ENTFERNEN (nicht das ganze Statement verwerfen), dann am ; splitten
  const statements = sql
    // Inline-Kommentare (-- bis Zeilenende) entfernen
    .replace(/--.*$/gm, '')
    // Block-Kommentare (/* ... */) entfernen
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Bei Semikolon splitten
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  if (statements.length === 0) {
    throw new Error(`Migration ${filename} enthält keine ausführbaren Statements`)
  }

  const pool = getPool()
  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()
    for (const stmt of statements) {
      await conn.query(stmt)
    }
    await conn.query('INSERT INTO _migrations (filename) VALUES (?)', [filename])
    await conn.commit()
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}

async function main() {
  console.log('🔧 MSK Shortener – Migration Runner')
  console.log('─────────────────────────────────────')

  await ensureMigrationsTable()
  const executed = await getExecutedMigrations()

  const files = (await readdir(MIGRATIONS_DIR))
    .filter((f) => f.endsWith('.sql'))
    .sort()

  let count = 0
  for (const file of files) {
    if (executed.has(file)) {
      console.log(`  ⏭️  ${file} (bereits ausgeführt)`)
      continue
    }

    process.stdout.write(`  ▶️  ${file}... `)
    await runMigration(file)
    console.log('✅')
    count++
  }

  console.log('─────────────────────────────────────')
  console.log(count > 0
    ? `✅ ${count} Migration(en) erfolgreich ausgeführt`
    : '✨ Alle Migrationen sind bereits aktuell'
  )

  await closePool()
}

main().catch(async (err) => {
  console.error('\n❌ Migration fehlgeschlagen:')
  console.error(err)
  await closePool()
  process.exit(1)
})
