'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import type { CreateLinkResponse } from '@/types'
import { ChartBar, Check, Clock, Copy, LockSimple, Plus, Warning } from '@/components/icons'

interface LinkResultProps {
  result:  CreateLinkResponse
  onReset: () => void
}

export function LinkResult({ result, onReset }: LinkResultProps) {
  const t      = useTranslations('linkResult')
  const locale = useLocale()

  const [copiedUrl, setCopiedUrl]     = useState(false)
  const [copiedToken, setCopiedToken] = useState(false)
  const [showDeleteToken, setShowDeleteToken] = useState(false)

  async function copyToClipboard(text: string, type: 'url' | 'token') {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'url') {
        setCopiedUrl(true)
        setTimeout(() => setCopiedUrl(false), 2000)
      } else {
        setCopiedToken(true)
        setTimeout(() => setCopiedToken(false), 2000)
      }
    } catch (err) {
      console.error('Clipboard error:', err)
    }
  }

  const expiryFormatted = result.expiresAt
    ? new Date(result.expiresAt).toLocaleString(locale === 'de' ? 'de-DE' : 'en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null

  const hasMetadata = result.hasPassword || expiryFormatted

  return (
    <div className="w-full space-y-5 animate-fade-in">

      {/* Success-Header */}
      <div className="flex items-center gap-3 text-primary">
        <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center">
          <Check className="w-5 h-5" />
        </div>
        <div>
          <p className="font-display text-lg text-foreground">{t('success')}</p>
          <p className="text-small text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>

      {/* Short-URL Display */}
      <div className="p-4 bg-card border-[1.5px] border-input rounded-md">
        <p className="text-label font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-2">{t('yourShortLink')}</p>
        <div className="flex items-center gap-3">
          <a
            href={result.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 font-mono text-primary text-lg break-all hover:underline"
          >
            {result.shortUrl}
          </a>
          <button
            onClick={() => copyToClipboard(result.shortUrl, 'url')}
            className="flex-shrink-0 p-2.5 bg-muted hover:bg-muted rounded-lg transition-colors"
            aria-label={t('copy')}
            title={t('copy')}
          >
            {copiedUrl ? (
              <Check className="w-5 h-5 text-primary" />
            ) : (
              <Copy className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Metadata-Strip */}
      {hasMetadata && (
        <div className="flex flex-wrap gap-2 text-small">
          {result.hasPassword && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-full text-muted-foreground">
              <LockSimple className="w-3.5 h-3.5 text-primary" />
              {t('passwordProtected')}
            </span>
          )}
          {expiryFormatted && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-full text-muted-foreground">
              <Clock className="w-3.5 h-3.5 text-primary" />
              {t('expiresOn')}: {expiryFormatted}
            </span>
          )}
        </div>
      )}

      {/* Delete-Token */}
      <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
        <div className="flex gap-3 mb-2">
          <Warning className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-small font-medium text-foreground mb-1">{t('tokenTitle')}</p>
            <p className="text-small text-muted-foreground mb-3">
              {t('tokenWarning')}
            </p>

            {!showDeleteToken ? (
              <button
                onClick={() => setShowDeleteToken(true)}
                className="text-small text-primary hover:underline"
              >
                {t('showToken')}
              </button>
            ) : (
              <div className="flex items-center gap-2 p-2.5 bg-muted border border-border rounded">
                <code className="flex-1 text-small text-foreground break-all font-mono">
                  {result.deleteToken}
                </code>
                <button
                  onClick={() => copyToClipboard(result.deleteToken, 'token')}
                  className="flex-shrink-0 p-1.5 hover:bg-muted rounded transition-colors"
                  aria-label={t('copy')}
                >
                  {copiedToken ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <a
          href={`/stats/${result.shortCode}`}
          className="px-4 py-3 bg-card hover:bg-muted border border-border text-foreground rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-small"
        >
          <ChartBar className="w-4 h-4 text-primary" />
          {t('viewStats')}
        </a>
        <button
          onClick={onReset}
          className="px-4 py-3 bg-card hover:bg-muted border border-border text-foreground rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-small"
        >
          <Plus className="w-4 h-4" />
          {t('newLink')}
        </button>
      </div>
    </div>
  )
}
