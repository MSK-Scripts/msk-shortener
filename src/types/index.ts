// ============================================================================
// MSK Shortener – Zentrale TypeScript-Typen
// ============================================================================

// ─── Datenbank-Modelle ────────────────────────────────────────────────

export interface Link {
  id:                number
  short_code:        string
  original_url:      string
  password_hash:     string | null
  expires_at:        Date | null
  delete_token:      string
  click_count:       number
  created_at:        Date
  created_ip_hash:   string
}

export interface Click {
  id:           number
  link_id:      number
  clicked_at:   Date
  referrer:     string | null
  browser:      string | null
  os:           string | null
  device_type:  DeviceType | null
}

export type DeviceType = 'desktop' | 'mobile' | 'tablet'

// ─── API Response Types ───────────────────────────────────────────────

export interface CreateLinkResponse {
  shortCode:    string
  shortUrl:     string
  deleteToken:  string
  expiresAt:    string | null
  hasPassword:  boolean
}

export interface LinkInfoResponse {
  shortCode:    string
  shortUrl:     string
  hasPassword:  boolean
  expiresAt:    string | null
  clickCount:   number
  createdAt:    string
  // originalUrl wird NUR zurückgegeben, wenn kein Passwort gesetzt ist
  originalUrl?: string
}

export interface StatsResponse {
  shortCode:    string
  totalClicks:  number
  createdAt:    string
  expiresAt:    string | null
  timeline:     TimelinePoint[]
  browsers:     AggregateEntry[]
  operatingSystems: AggregateEntry[]
  devices:      AggregateEntry[]
  topReferrers: AggregateEntry[]
}

export interface TimelinePoint {
  date:   string  // YYYY-MM-DD
  clicks: number
}

export interface AggregateEntry {
  name:  string
  count: number
}

export interface ApiError {
  error:    string
  details?: Record<string, string[]>
}
