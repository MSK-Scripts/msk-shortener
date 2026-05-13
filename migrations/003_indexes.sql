-- ============================================================================
-- MSK Shortener – Migration 003
-- Indexes für Performance
-- ============================================================================

-- Schnelle Redirect-Lookups (häufigste Operation!)
CREATE INDEX idx_links_short_code      ON links (short_code);

-- Cleanup-Jobs für abgelaufene Links
CREATE INDEX idx_links_expires_at      ON links (expires_at)
  COMMENT 'Für Cleanup abgelaufener Links';

-- Rate-Limit-Lookups
CREATE INDEX idx_links_ip_created      ON links (created_ip_hash, created_at)
  COMMENT 'Für Rate-Limit pro IP';

-- Sortierung in Statistiken
CREATE INDEX idx_clicks_link_clicked   ON clicks (link_id, clicked_at)
  COMMENT 'Für Statistik-Charts (zeitlicher Verlauf)';

-- Browser/OS-Aggregationen
CREATE INDEX idx_clicks_browser        ON clicks (link_id, browser);
CREATE INDEX idx_clicks_os             ON clicks (link_id, os);
