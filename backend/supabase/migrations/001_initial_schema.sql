-- ============================================================
-- Venture Autopsy — Database Schema
-- Target: Supabase (PostgreSQL 15+)
-- Apply via Supabase SQL Editor or CLI migrations
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. INVESTIGATIONS
-- ============================================================
CREATE TABLE investigations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL,
    description     TEXT,
    input_type      TEXT NOT NULL CHECK (input_type IN (
                        'startup_idea',
                        'pitch_deck',
                        'github_repo',
                        'enterprise_proposal'
                    )),
    input_data      JSONB NOT NULL,
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
                        'pending',
                        'initializing',
                        'agents_joining',
                        'analyzing',
                        'recruiting_specialists',
                        'conflict_resolution',
                        'executive_review',
                        'generating_report',
                        'completed',
                        'failed'
                    )),
    progress        INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    band_room_id    TEXT,
    error_message   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. INVESTIGATION AGENTS
-- ============================================================
CREATE TABLE investigation_agents (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investigation_id    UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
    agent_type          TEXT NOT NULL,
    agent_name          TEXT NOT NULL,
    role                TEXT NOT NULL CHECK (role IN ('core', 'specialist')),
    status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
                            'pending',
                            'joining',
                            'joined',
                            'analyzing',
                            'awaiting_input',
                            'completed',
                            'error'
                        )),
    band_agent_id       TEXT,
    verdict             TEXT CHECK (verdict IN (
                            'strong_approve', 'approve', 'conditional_approve',
                            'neutral', 'reject', 'strong_reject'
                        )),
    verdict_reasoning   TEXT,
    confidence          FLOAT CHECK (confidence >= 0 AND confidence <= 1),
    analysis_summary    TEXT,
    joined_at           TIMESTAMPTZ,
    completed_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. FINDINGS
-- ============================================================
CREATE TABLE findings (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investigation_id    UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
    agent_id            UUID NOT NULL REFERENCES investigation_agents(id) ON DELETE CASCADE,
    category            TEXT NOT NULL CHECK (category IN (
                            'finding', 'risk', 'opportunity',
                            'recommendation', 'red_flag', 'strength'
                        )),
    severity            TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN (
                            'critical', 'high', 'medium', 'low', 'info'
                        )),
    title               TEXT NOT NULL,
    description         TEXT NOT NULL,
    evidence            TEXT,
    impact_area         TEXT,
    confidence          FLOAT NOT NULL DEFAULT 0.5 CHECK (confidence >= 0 AND confidence <= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. SHARED CONTEXT
-- ============================================================
CREATE TABLE shared_context (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investigation_id    UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
    contributed_by      UUID REFERENCES investigation_agents(id) ON DELETE SET NULL,
    context_type        TEXT NOT NULL CHECK (context_type IN (
                            'market_data', 'competitive_landscape',
                            'financial_model', 'technical_assessment',
                            'risk_matrix', 'team_assessment',
                            'regulatory_landscape', 'industry_analysis'
                        )),
    title               TEXT NOT NULL,
    data                JSONB NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. TIMELINE EVENTS
-- ============================================================
CREATE TABLE timeline_events (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investigation_id    UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
    agent_id            UUID REFERENCES investigation_agents(id) ON DELETE SET NULL,
    event_type          TEXT NOT NULL CHECK (event_type IN (
                            'investigation_created', 'investigation_started',
                            'agent_joined', 'agent_analyzing',
                            'finding_added', 'risk_added',
                            'opportunity_added', 'red_flag_added',
                            'strength_added', 'context_shared',
                            'specialist_requested', 'specialist_recruited',
                            'conflict_detected', 'conflict_resolution_started',
                            'conflict_resolved', 'executive_review_started',
                            'verdict_submitted', 'report_generated',
                            'investigation_completed', 'investigation_failed'
                        )),
    title               TEXT NOT NULL,
    description         TEXT,
    metadata            JSONB,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 6. CONFLICTS
-- ============================================================
CREATE TABLE conflicts (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investigation_id        UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
    band_resolution_room_id TEXT,
    status                  TEXT NOT NULL DEFAULT 'detected' CHECK (status IN (
                                'detected', 'debating', 'resolved',
                                'escalated', 'overridden'
                            )),
    topic                   TEXT NOT NULL,
    description             TEXT NOT NULL,
    resolution              TEXT,
    resolution_reasoning    TEXT,
    resolved_by             UUID REFERENCES investigation_agents(id) ON DELETE SET NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at             TIMESTAMPTZ
);

-- ============================================================
-- 7. CONFLICT PARTICIPANTS
-- ============================================================
CREATE TABLE conflict_participants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conflict_id     UUID NOT NULL REFERENCES conflicts(id) ON DELETE CASCADE,
    agent_id        UUID NOT NULL REFERENCES investigation_agents(id) ON DELETE CASCADE,
    position        TEXT NOT NULL,
    arguments       TEXT,
    UNIQUE(conflict_id, agent_id)
);

-- ============================================================
-- 8. REPORTS
-- ============================================================
CREATE TABLE reports (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investigation_id        UUID NOT NULL UNIQUE REFERENCES investigations(id) ON DELETE CASCADE,
    
    executive_summary       TEXT NOT NULL,
    agent_findings          JSONB NOT NULL DEFAULT '[]'::jsonb,
    opportunities           JSONB NOT NULL DEFAULT '[]'::jsonb,
    risks                   JSONB NOT NULL DEFAULT '[]'::jsonb,
    specialist_findings     JSONB NOT NULL DEFAULT '[]'::jsonb,
    conflicts               JSONB NOT NULL DEFAULT '[]'::jsonb,
    executive_decision      JSONB NOT NULL DEFAULT '{}'::jsonb,
    failure_scenarios       JSONB NOT NULL DEFAULT '[]'::jsonb,
    mitigation_strategies   JSONB NOT NULL DEFAULT '[]'::jsonb,
    scorecard               JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 9. UPLOADED FILES
-- ============================================================
CREATE TABLE uploaded_files (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investigation_id    UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
    file_name           TEXT NOT NULL,
    file_type           TEXT NOT NULL,
    file_size           INTEGER NOT NULL,
    storage_path        TEXT NOT NULL,
    extracted_text      TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_inv_agents_investigation ON investigation_agents(investigation_id);
CREATE INDEX idx_inv_agents_status ON investigation_agents(status);
CREATE INDEX idx_findings_investigation ON findings(investigation_id);
CREATE INDEX idx_findings_category ON findings(category);
CREATE INDEX idx_findings_severity ON findings(severity);
CREATE INDEX idx_findings_agent ON findings(agent_id);
CREATE INDEX idx_shared_ctx_investigation ON shared_context(investigation_id);
CREATE INDEX idx_timeline_investigation ON timeline_events(investigation_id);
CREATE INDEX idx_timeline_type ON timeline_events(event_type);
CREATE INDEX idx_timeline_created ON timeline_events(created_at);
CREATE INDEX idx_conflicts_investigation ON conflicts(investigation_id);
CREATE INDEX idx_conflicts_status ON conflicts(status);
CREATE INDEX idx_reports_investigation ON reports(investigation_id);
CREATE INDEX idx_uploaded_files_investigation ON uploaded_files(investigation_id);

-- ============================================================
-- TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_investigations_updated
    BEFORE UPDATE ON investigations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_shared_context_updated
    BEFORE UPDATE ON shared_context
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE investigation_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflict_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;

-- Service role bypass (backend uses service_role key)
CREATE POLICY "service_role_all" ON investigations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON investigation_agents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON findings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON shared_context FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON timeline_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON conflicts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON conflict_participants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON uploaded_files FOR ALL USING (true) WITH CHECK (true);
