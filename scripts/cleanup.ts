/* eslint-disable no-console */
/**
 * MSK Shortener – Cleanup-Job
 *
 * Löscht alle abgelaufenen Links (clicks werden via CASCADE mitgelöscht).
 * Sollte regelmäßig per Cron-Job laufen (z. B. täglich um 03:00 Uhr):
 *
 *   0 3 * * * cd /var/www/msk-shortener && /usr/bin/node /usr/local/bin/tsx scripts/cleanup.ts >> /var/log/msk-shortener-cleanup.log 2>&1
 *
 * Usage: npm run cleanup
 */
import { config } from 'dotenv'
import { resolve } from 'node:path'
import { execute, queryOne, closePool } from '../src/lib/db'

// .env laden
config({ path: resolve(process.cwd(), '.env') })

async function main() {
  const startedAt = Date.now()
  const timestamp = new Date().toISOString()

  console.log(`[${timestamp}] 🧹 MSK Shortener – Cleanup-Job gestartet`)
  console.log('─────────────────────────────────────────────────────')

  // Zähle abgelaufene Links VOR dem Löschen (für Reporting)
  const expired = await queryOne<{ count: number }>(
    'SELECT COUNT(*) AS count FROM links WHERE expires_at IS NOT NULL AND expires_at < NOW()'
  )
  const expectedCount = expired?.count ?? 0

  if (expectedCount === 0) {
    console.log('✨ Keine abgelaufenen Links gefunden')
    await closePool()
    return
  }

  // Lösche abgelaufene Links (clicks via CASCADE)
  const result = await execute(
    'DELETE FROM links WHERE expires_at IS NOT NULL AND expires_at < NOW()'
  )

  const duration = Date.now() - startedAt
  console.log(`✅ ${result.affectedRows} abgelaufene Links gelöscht (${duration}ms)`)
  console.log('─────────────────────────────────────────────────────')

  await closePool()
}

main().catch(async (err) => {
  console.error('❌ Cleanup fehlgeschlagen:')
  console.error(err)
  await closePool()
  process.exit(1)
})
