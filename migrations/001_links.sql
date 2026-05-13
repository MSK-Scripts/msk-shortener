-- ============================================================================
-- MSK Shortener – Migration 001
-- Tabelle: links
-- Speichert die Kurz-URLs mit optionalem Passwortschutz und Ablaufdatum
-- ============================================================================

CREATE TABLE IF NOT EXISTS links (
  id                BIGINT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  short_code        VARCHAR(20)     NOT NULL,
  original_url      TEXT            NOT NULL,
  password_hash     VARCHAR(255)    DEFAULT NULL COMMENT 'bcrypt-Hash, NULL = kein Passwort',
  expires_at        DATETIME        DEFAULT NULL COMMENT 'NULL = kein Ablauf',
  delete_token      VARCHAR(64)     NOT NULL    COMMENT 'Zum Löschen ohne Account',
  click_count       INT UNSIGNED    NOT NULL    DEFAULT 0,
  created_at        TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP,
  created_ip_hash   VARCHAR(64)     NOT NULL    COMMENT 'SHA-256 für Rate-Limit & DSGVO',

  -- Constraints
  CONSTRAINT uq_links_short_code   UNIQUE (short_code),
  CONSTRAINT uq_links_delete_token UNIQUE (delete_token),

  -- Validierungen
  CONSTRAINT chk_short_code_length CHECK (CHAR_LENGTH(short_code) >= 3),
  CONSTRAINT chk_url_not_empty     CHECK (CHAR_LENGTH(original_url) > 0)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='MSK Shortener – Kurz-URLs';
