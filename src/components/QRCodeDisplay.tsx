'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CircleNotch, DownloadSimple, QrCode } from '@/components/icons'

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
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <QrCode className="w-4 h-4 text-primary" />
        <h3 className="font-display text-lead font-[650] text-foreground">
          {t('qrCodeTitle')}
        </h3>
      </div>

      <div className="bg-white rounded-lg p-4 flex items-center justify-center aspect-square max-w-[260px] mx-auto relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <CircleNotch className="w-8 h-8 animate-spin text-primary" />
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
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-card hover:bg-muted border border-border rounded-lg text-small text-foreground transition-colors"
        >
          <DownloadSimple className="w-3.5 h-3.5" />
          PNG
        </a>
        <a
          href={downloadSvg}
          download={`msk-${shortCode}.svg`}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-card hover:bg-muted border border-border rounded-lg text-small text-foreground transition-colors"
        >
          <DownloadSimple className="w-3.5 h-3.5" />
          SVG
        </a>
      </div>
    </div>
  )
}
