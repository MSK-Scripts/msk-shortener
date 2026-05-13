'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import type { CreateLinkResponse } from '@/types'

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
      <div className="flex items-center gap-3 text-msk-accent">
        <div className="w-10 h-10 rounded-full bg-msk-accent/10 flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="font-heading text-lg text-msk-text">{t('success')}</p>
          <p className="text-xs text-msk-muted">{t('subtitle')}</p>
        </div>
      </div>

      {/* Short-URL Display */}
      <div className="p-4 bg-msk-surface border border-msk-border rounded-lg">
        <p className="text-xs uppercase tracking-wider text-msk-muted mb-2">{t('yourShortLink')}</p>
        <div className="flex items-center gap-3">
          <a
            href={result.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 font-mono text-msk-accent text-lg break-all hover:underline"
          >
            {result.shortUrl}
          </a>
          <button
            onClick={() => copyToClipboard(result.shortUrl, 'url')}
            className="flex-shrink-0 p-2.5 bg-msk-surface2 hover:bg-msk-border rounded-lg transition-colors"
            aria-label={t('copy')}
            title={t('copy')}
          >
            {copiedUrl ? (
              <svg className="w-5 h-5 text-msk-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-msk-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Metadata-Strip */}
      {hasMetadata && (
        <div className="flex flex-wrap gap-2 text-xs">
          {result.hasPassword && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-msk-surface border border-msk-border rounded-full text-msk-muted">
              <svg className="w-3.5 h-3.5 text-msk-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {t('passwordProtected')}
            </span>
          )}
          {expiryFormatted && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-msk-surface border border-msk-border rounded-full text-msk-muted">
              <svg className="w-3.5 h-3.5 text-msk-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('expiresOn')}: {expiryFormatted}
            </span>
          )}
        </div>
      )}

      {/* Delete-Token */}
      <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
        <div className="flex gap-3 mb-2">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-msk-text mb-1">{t('tokenTitle')}</p>
            <p className="text-xs text-msk-muted mb-3">
              {t('tokenWarning')}
            </p>

            {!showDeleteToken ? (
              <button
                onClick={() => setShowDeleteToken(true)}
                className="text-xs text-msk-accent hover:underline"
              >
                {t('showToken')}
              </button>
            ) : (
              <div className="flex items-center gap-2 p-2.5 bg-msk-bg border border-msk-border rounded">
                <code className="flex-1 text-xs text-msk-text break-all font-mono">
                  {result.deleteToken}
                </code>
                <button
                  onClick={() => copyToClipboard(result.deleteToken, 'token')}
                  className="flex-shrink-0 p-1.5 hover:bg-msk-surface2 rounded transition-colors"
                  aria-label={t('copy')}
                >
                  {copiedToken ? (
                    <svg className="w-4 h-4 text-msk-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-msk-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
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
          className="px-4 py-3 bg-msk-surface hover:bg-msk-surface2 border border-msk-border text-msk-text rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <svg className="w-4 h-4 text-msk-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {t('viewStats')}
        </a>
        <button
          onClick={onReset}
          className="px-4 py-3 bg-msk-surface hover:bg-msk-surface2 border border-msk-border text-msk-text rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t('newLink')}
        </button>
      </div>
    </div>
  )
}
