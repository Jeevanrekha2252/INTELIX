-- ============================================================================
-- V4__notifications_extended.sql
-- Real-time notification infrastructure & user notification preferences
-- ============================================================================

-- 1. EXTEND NOTIFICATIONS TABLE
ALTER TABLE notifications
    ADD COLUMN IF NOT EXISTS type VARCHAR(80) DEFAULT 'SYSTEM',
    ADD COLUMN IF NOT EXISTS project_id VARCHAR(36),
    ADD COLUMN IF NOT EXISTS related_entity_type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS related_entity_id VARCHAR(36),
    ADD COLUMN IF NOT EXISTS metadata TEXT,
    ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;

-- 2. INDEXES FOR REAL-TIME FILTERING & PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_notif_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_project_id ON notifications(project_id);
CREATE INDEX IF NOT EXISTS idx_notif_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notif_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notif_user_unread ON notifications(user_id, is_read, created_at DESC);

-- 3. USER NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS notification_preferences (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    tasks_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    risks_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    projects_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    meetings_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    approvals_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    comments_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_notif_pref_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notif_pref_user ON notification_preferences(user_id);
