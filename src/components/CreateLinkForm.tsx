'use client'

import { useState, FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import type { CreateLinkResponse, ApiError } from '@/types'
import { LinkResult } from './LinkResult'

export function CreateLinkForm() {
  const t = useTranslations('createForm')

  // ─── State ──────────────────────────────────────────────────────
  const [url, setUrl]               = useState('')
  const [customCode, setCustomCode] = useState('')
  const [password, setPassword]     = useState('')
  const [expiresAt, setExpiresAt]   = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [result, setResult]       = useState<CreateLinkResponse | null>(null)

  // ─── Submit ─────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setIsLoading(true)

    try {
      const expiresAtIso = expiresAt ? new Date(expiresAt).toISOString() : undefined

      const res = await fetch('/api/links', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          url:        url.trim(),
          customCode: customCode.trim() || undefined,
          password:   password || undefined,
          expiresAt:  expiresAtIso,
        }),
      })

      const data = await res.json() as CreateLinkResponse | ApiError

      if (!res.ok) {
        const err = data as ApiError
        setError(err.error)
        if (err.details) setFieldErrors(err.details)
        return
      }

      setResult(data as CreateLinkResponse)
    } catch {
      setError(t('networkError'))
    } finally {
      setIsLoading(false)
    }
  }

  function handleReset() {
    setResult(null)
    setUrl('')
    setCustomCode('')
    setPassword('')
    setExpiresAt('')
    setShowAdvanced(false)
    setShowPassword(false)
    setError(null)
    setFieldErrors({})
  }

  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  const minDateTime = now.toISOString().slice(0, 16)

  if (result) {
    return <LinkResult result={result} onReset={handleReset} />
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5 animate-fade-in">

      {/* URL-Input */}
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-msk-text mb-2">
          {t('urlLabel')}
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t('urlPlaceholder')}
          required
          autoFocus
          disabled={isLoading}
          className="w-full px-4 py-3 bg-msk-surface border border-msk-border rounded-lg text-msk-text placeholder:text-msk-dim focus:border-msk-accent focus:outline-none transition-colors disabled:opacity-50"
        />
        {fieldErrors.url && (
          <p className="mt-1.5 text-sm text-msk-danger">{fieldErrors.url.join(', ')}</p>
        )}
      </div>

      {/* Advanced Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-msk-muted hover:text-msk-accent transition-colors flex items-center gap-1.5"
      >
        <svg
          className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {t('advancedToggle')}
      </button>

      {showAdvanced && (
        <div className="animate-slide-up space-y-5 pl-5 border-l-2 border-msk-border">

          {/* Custom Code */}
          <div>
            <label htmlFor="customCode" className="block text-sm font-medium text-msk-text mb-2">
              {t('customCodeLabel')}{' '}
              <span className="text-msk-muted font-normal">({t('optional')})</span>
            </label>
            <div className="flex items-stretch">
              <span className="px-3 inline-flex items-center bg-msk-surface2 border border-r-0 border-msk-border rounded-l-lg text-sm text-msk-muted">
                s.msk-scripts.de/
              </span>
              <input
                id="customCode"
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder={t('customCodePlaceholder')}
                pattern="[a-zA-Z0-9_-]{3,20}"
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-msk-surface border border-msk-border rounded-r-lg text-msk-text placeholder:text-msk-dim focus:border-msk-accent focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>
            <p className="mt-1.5 text-xs text-msk-muted">
              {t('customCodeHint')}
            </p>
            {fieldErrors.customCode && (
              <p className="mt-1.5 text-sm text-msk-danger">{fieldErrors.customCode.join(', ')}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-msk-text mb-2">
              {t('passwordLabel')}{' '}
              <span className="text-msk-muted font-normal">({t('optional')})</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
                minLength={4}
                maxLength={100}
                disabled={isLoading}
                autoComplete="new-password"
                className="w-full px-4 py-3 pr-12 bg-msk-surface border border-msk-border rounded-lg text-msk-text placeholder:text-msk-dim focus:border-msk-accent focus:outline-none transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-msk-muted hover:text-msk-text transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1.5 text-sm text-msk-danger">{fieldErrors.password.join(', ')}</p>
            )}
          </div>

          {/* Expires At */}
          <div>
            <label htmlFor="expiresAt" className="block text-sm font-medium text-msk-text mb-2">
              {t('expiresAtLabel')}{' '}
              <span className="text-msk-muted font-normal">({t('optional')})</span>
            </label>
            <input
              id="expiresAt"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              min={minDateTime}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-msk-surface border border-msk-border rounded-lg text-msk-text focus:border-msk-accent focus:outline-none transition-colors disabled:opacity-50 [color-scheme:dark]"
            />
            {expiresAt && (
              <button
                type="button"
                onClick={() => setExpiresAt('')}
                className="mt-1.5 text-xs text-msk-muted hover:text-msk-accent transition-colors"
              >
                {t('expiresAtRemove')}
              </button>
            )}
            {fieldErrors.expiresAt && (
              <p className="mt-1.5 text-sm text-msk-danger">{fieldErrors.expiresAt.join(', ')}</p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="px-4 py-3 bg-msk-danger/10 border border-msk-danger/30 rounded-lg text-sm text-msk-danger animate-fade-in">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !url.trim()}
        className="w-full px-6 py-3.5 bg-msk-accent hover:bg-msk-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            {t('submitting')}
          </>
        ) : (
          <>
            {t('submit')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    </form>
  )
}
