// ============================================================================
// MSK Shortener – Bot-Detection
// Erkennt Crawler & Link-Previewer, damit diese nicht in den Statistiken landen
// ============================================================================

const BOT_PATTERNS = [
  // Suchmaschinen-Crawler
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot',
  'sogou', 'exabot', 'facebot', 'ia_archiver',

  // Social Media Link-Previewer
  'twitterbot', 'facebookexternalhit', 'linkedinbot', 'slackbot',
  'discordbot', 'telegrambot', 'whatsapp', 'skypeuripreview',
  'redditbot', 'pinterest', 'embedly',

  // SEO & Monitoring Tools
  'ahrefsbot', 'semrushbot', 'mj12bot', 'dotbot', 'rogerbot',
  'screaming frog', 'sitelock', 'uptimerobot',

  // Generic Bot-Signaturen
  'bot/', 'crawler', 'spider', 'scraper', 'headlesschrome',
  'phantomjs', 'selenium', 'puppeteer',

  // Preview Services
  'preview', 'fetch', 'unfurl',
]

/**
 * Prüft, ob ein User-Agent zu einem Bot/Crawler gehört.
 * Case-insensitive Vergleich.
 */
export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true // Kein UA = höchstwahrscheinlich ein Bot

  const ua = userAgent.toLowerCase()
  return BOT_PATTERNS.some((pattern) => ua.includes(pattern))
}
