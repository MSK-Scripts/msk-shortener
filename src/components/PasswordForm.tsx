'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ApiError } from '@/types'
import { LockSimple } from '@/components/icons'

interface Props {
  shortCode: string
}

export function PasswordForm({ shortCode }: Props) {
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/verify', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ shortCode, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        const apiErr = data as ApiError
        setError(apiErr.error || 'Fehler')
        return
      }

      // Redirect zur Original-URL
      if (data.originalUrl) {
        window.location.href = data.originalUrl
      }
    } catch {
      setError('Netzwerkfehler – bitte erneut versuchen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-card-hover)]">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-soft mb-4">
          <LockSimple className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-1">Passwort erforderlich</h1>
        <p className="text-muted-foreground text-small">
          Dieser Link ist passwortgeschützt.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          <span className="text-small font-medium text-foreground mb-2 block">Passwort</span>
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort eingeben"
            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus-visible:border-primary transition-colors"
            disabled={loading}
          />
        </label>

        {error && (
          <div className="mb-4 bg-danger/8 border border-danger/40 rounded-lg px-4 py-3 text-danger text-small">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full bg-primary hover:bg-primary-hover disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-background font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
              Prüfe...
            </>
          ) : (
            'Weiterleiten'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-small text-muted-foreground hover:text-primary transition-colors"
        >
          ← Zurück zur Startseite
        </Link>
      </div>
    </div>
  )
}
