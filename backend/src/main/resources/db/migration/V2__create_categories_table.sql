-- =============================================================================
-- MediStock: Migration V2
-- Ensure categories table exists for environments baselined at V1 or partially migrated
-- =============================================================================

CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_medicines_category_id ON medicines(category_id);
