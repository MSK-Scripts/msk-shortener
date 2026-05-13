-- ============================================================================
-- MSK Shortener – Migration 002
-- Tabelle: clicks
-- Anonymisiertes Click-Tracking für Statistiken (DSGVO-konform)
-- ============================================================================

CREATE TABLE IF NOT EXISTS clicks (
  id            BIGINT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  link_id       BIGINT          UNSIGNED NOT NULL,
  clicked_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ip_hash       VARCHAR(64)     NOT NULL COMMENT 'SHA-256 mit Secret-Pepper',
  referrer      VARCHAR(500)    DEFAULT NULL,
  browser       VARCHAR(50)     DEFAULT NULL COMMENT 'Parsed via ua-parser-js',
  os            VARCHAR(50)     DEFAULT NULL,
  device_type   VARCHAR(20)     DEFAULT NULL COMMENT 'desktop, mobile, tablet',

  -- Foreign Key mit CASCADE-Delete
  CONSTRAINT fk_clicks_link
    FOREIGN KEY (link_id) REFERENCES links(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='MSK Shortener – Click-Tracking (anonymisiert)';
