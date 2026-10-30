'use client'

import { useState, FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import { Check, CircleNotch, Trash } from '@/components/icons'

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
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent-soft">
          <Check className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-xl text-foreground mb-1">{t('successTitle')}</h3>
          <p className="text-small text-muted-foreground">{t('successSubtitle')}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg font-medium transition-colors"
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
        <h3 className="font-display text-xl text-foreground">{t('title')}</h3>
        <p className="text-small text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div>
        <label htmlFor="shortCode" className="block text-small font-medium text-foreground mb-2">
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
          className="w-full px-4 py-3 bg-card border-[1.5px] border-input rounded-md text-foreground placeholder:text-muted-foreground focus-visible:border-primary transition-colors disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="token" className="block text-small font-medium text-foreground mb-2">
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
          className="w-full px-4 py-3 bg-card border-[1.5px] border-input rounded-md text-foreground placeholder:text-muted-foreground font-mono text-small focus-visible:border-primary transition-colors disabled:opacity-50"
        />
      </div>

      {state.kind === 'error' && (
        <div className="px-4 py-3 bg-danger/8 border border-danger/40 rounded-lg text-small text-danger">
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-3 bg-card hover:bg-muted border border-border text-foreground rounded-lg font-medium text-small transition-colors disabled:opacity-50"
        >
          {c('cancel')}
        </button>
        <button
          type="submit"
          disabled={isLoading || !shortCode.trim() || token.trim().length !== 48}
          className="px-4 py-3 bg-danger hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-lg font-medium text-small transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <CircleNotch className="w-4 h-4 animate-spin" />
              {t('submitting')}
            </>
          ) : (
            <>
              <Trash className="w-4 h-4" />
              {t('submit')}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
