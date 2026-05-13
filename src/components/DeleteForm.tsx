'use client'

import { useState, FormEvent } from 'react'
import { useTranslations } from 'next-intl'

interface DeleteFormProps {
  onClose: () => void
}

type State =
  | { kind: 'input' }
  | { kind: 'loading' }
  | { kind: 'success' }
  | { kind: 'error'; message: string }

export function DeleteForm({ onClose }: DeleteFormProps) {
  const t = useTranslations('deleteForm')
  const c = useTranslations('common')

  const [shortCode, setShortCode] = useState('')
  const [token, setToken]         = useState('')
  const [state, setState]         = useState<State>({ kind: 'input' })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setState({ kind: 'loading' })

    let cleanCode = shortCode.trim()
    try {
      if (cleanCode.includes('://')) {
        const url = new URL(cleanCode)
        cleanCode = url.pathname.replace(/^\//, '').split('/')[0] ?? ''
      } else if (cleanCode.includes('/')) {
        cleanCode = cleanCode.split('/').pop() ?? ''
      }
    } catch {
      // Original verwenden
    }

    if (!cleanCode) {
      setState({ kind: 'error', message: t('errorInvalidCode') })
      return
    }

    try {
      const res = await fetch(`/api/links/${encodeURIComponent(cleanCode)}`, {
        method:  'DELETE',
        headers: { 'Authorization': `Bearer ${token.trim()}` },
      })

      if (res.ok) {
        setState({ kind: 'success' })
        return
      }

      const data = await res.json().catch(() => ({ error: t('errorDeleteFailed') }))
      setState({ kind: 'error', message: data.error ?? t('errorDeleteFailed') })
    } catch {
      setState({ kind: 'error', message: t('networkError') })
    }
  }

  if (state.kind === 'success') {
    return (
      <div className="space-y-4 animate-fade-in text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-msk-accent/10">
          <svg className="w-7 h-7 text-msk-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="font-heading text-xl text-msk-text mb-1">{t('successTitle')}</h3>
          <p className="text-sm text-msk-muted">{t('successSubtitle')}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-msk-accent hover:bg-msk-hover text-white rounded-lg font-medium transition-colors"
        >
          {c('close')}
        </button>
      </div>
    )
  }

  const isLoading = state.kind === 'loading'

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="space-y-1">
        <h3 className="font-heading text-xl text-msk-text">{t('title')}</h3>
        <p className="text-xs text-msk-muted">{t('subtitle')}</p>
      </div>

      <div>
        <label htmlFor="shortCode" className="block text-sm font-medium text-msk-text mb-2">
          {t('shortCodeLabel')}
        </label>
        <input
          id="shortCode"
          type="text"
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value)}
          placeholder={t('shortCodePlaceholder')}
          required
          disabled={isLoading}
          autoFocus
          className="w-full px-4 py-3 bg-msk-surface border border-msk-border rounded-lg text-msk-text placeholder:text-msk-dim focus:border-msk-accent focus:outline-none transition-colors disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="token" className="block text-sm font-medium text-msk-text mb-2">
          {t('tokenLabel')}
        </label>
        <input
          id="token"
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder={t('tokenPlaceholder')}
          required
          minLength={48}
          maxLength={48}
          disabled={isLoading}
          autoComplete="off"
          spellCheck={false}
          className="w-full px-4 py-3 bg-msk-surface border border-msk-border rounded-lg text-msk-text placeholder:text-msk-dim font-mono text-sm focus:border-msk-accent focus:outline-none transition-colors disabled:opacity-50"
        />
      </div>

      {state.kind === 'error' && (
        <div className="px-4 py-3 bg-msk-danger/10 border border-msk-danger/30 rounded-lg text-sm text-msk-danger">
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-3 bg-msk-surface hover:bg-msk-surface2 border border-msk-border text-msk-text rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
        >
          {c('cancel')}
        </button>
        <button
          type="submit"
          disabled={isLoading || !shortCode.trim() || token.trim().length !== 48}
          className="px-4 py-3 bg-msk-danger hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
              </svg>
              {t('submit')}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
