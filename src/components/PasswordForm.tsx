'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ApiError } from '@/types'

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
    <div className="bg-msk-surface border border-msk-border rounded-xl p-6 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-msk-accent/10 mb-4">
          <svg className="w-8 h-8 text-msk-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h1 className="font-heading text-2xl font-bold mb-1">Passwort erforderlich</h1>
        <p className="text-msk-muted text-sm">
          Dieser Link ist passwortgeschützt.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          <span className="text-sm font-medium text-msk-text mb-2 block">Passwort</span>
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort eingeben"
            className="w-full bg-msk-surface2 border border-msk-border rounded-lg px-4 py-3 text-msk-text placeholder-msk-dim focus:outline-none focus:border-msk-accent transition-colors"
            disabled={loading}
          />
        </label>

        {error && (
          <div className="mb-4 bg-msk-danger/10 border border-msk-danger/30 rounded-lg px-4 py-3 text-msk-danger text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full bg-msk-accent hover:bg-msk-hover disabled:bg-msk-surface2 disabled:text-msk-muted disabled:cursor-not-allowed text-msk-bg font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-msk-bg border-t-transparent rounded-full animate-spin" />
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
          className="text-sm text-msk-muted hover:text-msk-accent transition-colors"
        >
          ← Zurück zur Startseite
        </Link>
      </div>
    </div>
  )
}
