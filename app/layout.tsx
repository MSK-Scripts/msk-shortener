import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'
import './globals.css'

import { Inter, JetBrains_Mono } from 'next/font/google'

// Fonts are downloaded at build time by `next/font/google`, bundled into
// the build output, and served exclusively from this app's own origin.
// No runtime connection to Google CDN is made.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display:  'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display:  'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://s.msk-scripts.de'),
  title: {
    default:  'MSK Shortener – URL-Shortener',
    template: '%s | MSK Shortener',
  },
  description:
    'A fast, privacy-friendly URL shortener with statistics, QR codes, password protection, and expiration dates.',
  applicationName: 'MSK Shortener',
  authors: [{ name: 'Musiker15', url: 'https://www.musiker15.de' }, { name: 'MSK Scripts', url: 'https://www.msk-scripts.de' }],
  keywords: ['URL Shortener', 'Link Shortener', 'QR-Code', 'MSK', 'MSK Scripts', 'msk-scripts.de'],
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
    description: 'A fast, privacy-friendly URL shortener with statistics, QR codes, password protection, and expiration dates.',
    images:      ['/msk_shortener.png'],
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

  const fontClasses = `${inter.variable} ${jetbrainsMono.variable}`

  return (
    <html lang={locale} className={`dark ${fontClasses}`}>
      <body className="min-h-screen bg-msk-bg text-msk-text antialiased">
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
