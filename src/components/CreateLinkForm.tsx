'use client'

import { useCallback, useState, FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import type { CreateLinkResponse, ApiError } from '@/types'
import { LinkResult } from './LinkResult'
import { TurnstileWidget } from './TurnstileWidget'
import { ArrowRight, CaretRight, CircleNotch, Eye, EyeSlash } from '@/components/icons'

/** Must match TURNSTILE_ACTION in src/lib/turnstile.ts. */
const TURNSTILE_ACTION = 'create-link'

/** Spam guard codes (src/lib/spamGuard.ts) and their message keys. */
const GUARD_MESSAGES: Record<string, string> = {
  'origin':              'rejected',
  'rejected':            'rejected',
  'api-key-required':    'rejected',
  'stamp-invalid':       'reload',
  'stamp-expired':       'reload',
  'too-fast':            'tooFast',
  'own-link':            'ownLink',
  'shortener':           'shortener',
  'blocked-host':        'blockedHost',
  'ip-host':             'ipHost',
  'phishing':            'phishing',
  'rate-limit':          'rateLimit',
  'daily-limit':         'dailyLimit',
  'captcha':             'captcha',
  'captcha-unavailable': 'captchaUnavailable',
}

/** After these the token may be spent, so the widget gets a fresh one. */
const RENEW_CAPTCHA = new Set(['captcha', 'captcha-unavailable'])

export function CreateLinkForm({
  siteKey,
  formStamp,
}: {
  /** Turnstile site key, null where no captcha is configured (development). */
  siteKey:   string | null
  /** Signed render time, see src/lib/formStamp.ts. */
  formStamp: string
}) {
  const t     = useTranslations('createForm')
  const tSpam = useTranslations('createForm.spam')

  // ─── State ──────────────────────────────────────────────────────
  const [url, setUrl]               = useState('')
  const [customCode, setCustomCode] = useState('')
  const [password, setPassword]     = useState('')
  const [expiresAt, setExpiresAt]   = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [website, setWebsite]       = useState('')

  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaKey, setCaptchaKey]     = useState(0)
  const onCaptchaToken = useCallback((token: string | null) => setCaptchaToken(token), [])

  function renewCaptcha() {
    setCaptchaToken(null)
    setCaptchaKey((k) => k + 1)
  }

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
          website,
          formStamp,
          turnstileToken: captchaToken ?? undefined,
        }),
      })

      const data = await res.json() as CreateLinkResponse | ApiError

      if (!res.ok) {
        const err = data as ApiError
        const key = err.code ? GUARD_MESSAGES[err.code] : undefined
        setError(key ? tSpam(key) : err.error)
        if (err.details) setFieldErrors(err.details)
        if (res.status >= 500 || (err.code && RENEW_CAPTCHA.has(err.code))) renewCaptcha()
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
    // The last token was spent on the link just created.
    renewCaptcha()
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
        <label htmlFor="url" className="block text-small font-medium text-foreground mb-2">
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
          className="w-full px-4 py-3 bg-card border-[1.5px] border-input rounded-md text-foreground placeholder:text-muted-foreground focus-visible:border-primary transition-colors disabled:opacity-50"
        />
        {fieldErrors.url && (
          <p className="mt-1.5 text-small text-danger">{fieldErrors.url.join(', ')}</p>
        )}
      </div>

      {/* Advanced Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-small text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
      >
        <CaretRight className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
        {t('advancedToggle')}
      </button>

      {showAdvanced && (
        <div className="animate-fade-in space-y-5 pl-5 border-l-2 border-border">

          {/* Custom Code */}
          <div>
            <label htmlFor="customCode" className="block text-small font-medium text-foreground mb-2">
              {t('customCodeLabel')}{' '}
              <span className="text-muted-foreground font-normal">({t('optional')})</span>
            </label>
            <div className="flex items-stretch">
              <span className="px-3 inline-flex items-center bg-muted border border-r-0 border-input rounded-l-md text-small text-muted-foreground">
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
                className="flex-1 px-4 py-3 bg-card border-[1.5px] border-input rounded-r-md text-foreground placeholder:text-muted-foreground focus-visible:border-primary transition-colors disabled:opacity-50"
              />
            </div>
            <p className="mt-1.5 text-small text-muted-foreground">
              {t('customCodeHint')}
            </p>
            {fieldErrors.customCode && (
              <p className="mt-1.5 text-small text-danger">{fieldErrors.customCode.join(', ')}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-small font-medium text-foreground mb-2">
              {t('passwordLabel')}{' '}
              <span className="text-muted-foreground font-normal">({t('optional')})</span>
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
                className="w-full px-4 py-3 pr-12 bg-card border-[1.5px] border-input rounded-md text-foreground placeholder:text-muted-foreground focus-visible:border-primary transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeSlash className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1.5 text-small text-danger">{fieldErrors.password.join(', ')}</p>
            )}
          </div>

          {/* Expires At */}
          <div>
            <label htmlFor="expiresAt" className="block text-small font-medium text-foreground mb-2">
              {t('expiresAtLabel')}{' '}
              <span className="text-muted-foreground font-normal">({t('optional')})</span>
            </label>
            <input
              id="expiresAt"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              min={minDateTime}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-card border-[1.5px] border-input rounded-md text-foreground focus-visible:border-primary transition-colors disabled:opacity-50"
            />
            {expiresAt && (
              <button
                type="button"
                onClick={() => setExpiresAt('')}
                className="mt-1.5 text-small text-muted-foreground hover:text-primary transition-colors"
              >
                {t('expiresAtRemove')}
              </button>
            )}
            {fieldErrors.expiresAt && (
              <p className="mt-1.5 text-small text-danger">{fieldErrors.expiresAt.join(', ')}</p>
            )}
          </div>
        </div>
      )}

      {/* A field people never see (off-screen, out of the tab order); bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto w-px h-px overflow-hidden">
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      {siteKey && (
        <TurnstileWidget
          key={captchaKey}
          siteKey={siteKey}
          action={TURNSTILE_ACTION}
          onToken={onCaptchaToken}
        />
      )}

      {error && (
        <div role="alert" className="px-4 py-3 bg-danger/8 border border-danger/40 rounded-lg text-small text-danger animate-fade-in">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !url.trim() || (siteKey !== null && !captchaToken)}
        className="w-full px-6 py-3.5 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
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
    </form>
  )
}
