'use client'

import { useState, FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowRight, CircleNotch, Eye, EyeSlash } from '@/components/icons'

interface PasswordPromptProps {
  shortCode: string
}

export function PasswordPrompt({ shortCode }: PasswordPromptProps) {
  const t = useTranslations('password')

  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch('/api/verify', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ shortCode, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? t('wrongPassword'))
        setPassword('')
        setIsLoading(false)
        return
      }

      window.location.href = data.originalUrl
    } catch {
      setError(t('networkError'))
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-small font-medium text-foreground mb-2">
          {t('passwordLabel')}
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoFocus
            disabled={isLoading}
            className="w-full px-4 py-3 pr-12 bg-card border-[1.5px] border-input rounded-md text-foreground placeholder:text-muted-foreground focus-visible:border-primary transition-colors disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? t('hidePassword') : t('showPassword')}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeSlash className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 bg-danger/8 border border-danger/40 rounded-lg text-small text-danger animate-fade-in">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !password}
        className="w-full px-6 py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <CircleNotch className="w-4 h-4 animate-spin" />
            {t('submitting')}
          </>
        ) : (
          <>
            {t('submit')}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-small text-muted-foreground text-center pt-2">
        {t('rateLimitHint')}
      </p>
    </form>
  )
}
