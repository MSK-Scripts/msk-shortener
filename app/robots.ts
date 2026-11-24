import type { MetadataRoute } from 'next'

/**
 * robots.txt. Without this file `/robots.txt` hit the `[code]` route and
 * answered 404. Short links stay crawlable, so a crawler can follow them to
 * their target; the API is not for crawlers.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
  }
}
