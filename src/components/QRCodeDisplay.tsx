'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface QRCodeDisplayProps {
  shortCode: string
}

export function QRCodeDisplay({ shortCode }: QRCodeDisplayProps) {
  const t = useTranslations('stats')
  const [isLoading, setIsLoading] = useState(true)

  const qrUrl       = `/api/links/${shortCode}/qr?format=png`
  const downloadPng = `/api/links/${shortCode}/qr?format=png`
  const downloadSvg = `/api/links/${shortCode}/qr?format=svg`

  return (
    <div className="bg-msk-surface/50 border border-msk-border rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-msk-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
        <h3 className="text-sm font-medium text-msk-text uppercase tracking-wider">
          {t('qrCodeTitle')}
        </h3>
      </div>

      <div className="bg-white rounded-lg p-4 flex items-center justify-center aspect-square max-w-[260px] mx-auto relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 animate-spin text-msk-accent" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrUrl}
          alt={`QR-Code für /${shortCode}`}
          className="w-full h-full object-contain"
          onLoad={() => setIsLoading(false)}
          loading="lazy"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <a
          href={downloadPng}
          download={`msk-${shortCode}.png`}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-msk-surface hover:bg-msk-surface2 border border-msk-border rounded-lg text-xs text-msk-text transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          PNG
        </a>
        <a
          href={downloadSvg}
          download={`msk-${shortCode}.svg`}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-msk-surface hover:bg-msk-surface2 border border-msk-border rounded-lg text-xs text-msk-text transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          SVG
        </a>
      </div>
    </div>
  )
}
