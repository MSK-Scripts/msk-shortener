import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://s.msk-scripts.de'),
  title: {
    default:  'MSK Shortener – URL-Shortener',
    template: '%s | MSK Shortener',
  },
  description:
    'Schneller, datenschutzfreundlicher URL-Shortener mit Statistiken, QR-Codes, Passwortschutz und Ablaufdatum.',
  applicationName: 'MSK Shortener',
  authors: [{ name: 'Moritz Kohm', url: 'https://msk-scripts.de' }],
  keywords: ['URL Shortener', 'Link Shortener', 'QR-Code', 'MSK', 'msk-scripts.de'],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.png',    type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple:    '/logo.png',
  },
  robots: {
    index:  true,
    follow: true,
  },
  openGraph: {
    type:        'website',
    siteName:    'MSK Shortener',
    title:       'MSK Shortener – URL-Shortener',
    description: 'Schneller, datenschutzfreundlicher URL-Shortener mit Statistiken & QR-Codes.',
    images:      ['/logo.png'],
  },
}

export const viewport: Viewport = {
  themeColor:  '#1b1b1d',
  colorScheme: 'dark',
  width:       'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()

  return (
    <html lang={locale} className="dark">
      <body className="min-h-screen bg-msk-bg text-msk-text antialiased">
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
