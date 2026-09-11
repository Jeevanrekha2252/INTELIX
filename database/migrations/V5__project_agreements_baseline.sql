-- ============================================================================
-- V5__project_agreements_baseline.sql
-- Project Governance / Terms & Conditions Baseline Module
-- ============================================================================

-- 1. PROJECT AGREEMENTS (Master baseline & terms document)
CREATE TABLE IF NOT EXISTS project_agreements (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL UNIQUE,
    version INT NOT NULL DEFAULT 1,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    total_value NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    effective_date DATE,
    baseline_start_date DATE NOT NULL,
    baseline_end_date DATE NOT NULL,
    current_forecast_end_date DATE NOT NULL,
    verified_blocking_delay_days INT NOT NULL DEFAULT 0,
    delay_attribution TEXT,
    scope_objective TEXT,
    included_modules TEXT,
    excluded_modules TEXT,
    assumptions TEXT,
    agreed_deliverables TEXT,
    created_by VARCHAR(36),
    approved_by_manager VARCHAR(36),
    approved_by_client VARCHAR(36),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_agreement_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_agreement_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_agreement_mgr FOREIGN KEY (approved_by_manager) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_agreement_client FOREIGN KEY (approved_by_client) REFERENCES users(id) ON DELETE SET NULL
);

-- 2. AGREEMENT MILESTONES (Agreed milestones, deliverables, and acceptance criteria)
CREATE TABLE IF NOT EXISTS agreement_milestones (
    id VARCHAR(36) PRIMARY KEY,
    agreement_id VARCHAR(36) NOT NULL,
    milestone_id VARCHAR(36),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    target_date DATE NOT NULL,
    deliverables TEXT,
    completion_requirement TEXT,
    acceptance_criteria TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_ag_milestone_agreement FOREIGN KEY (agreement_id) REFERENCES project_agreements(id) ON DELETE CASCADE,
    CONSTRAINT fk_ag_milestone_ref FOREIGN KEY (milestone_id) REFERENCES milestones(id) ON DELETE SET NULL
);

-- 3. PAYMENT MILESTONES (Commercial payment terms, triggers, and status)
CREATE TABLE IF NOT EXISTS payment_milestones (
    id VARCHAR(36) PRIMARY KEY,
    agreement_id VARCHAR(36) NOT NULL,
    milestone_id VARCHAR(36),
    title VARCHAR(200) NOT NULL,
    trigger_type VARCHAR(50) NOT NULL DEFAULT 'PERCENTAGE',
    trigger_value NUMERIC(5, 2),
    target_date DATE,
    payment_percentage NUMERIC(5, 2) NOT NULL,
    payment_amount NUMERIC(14, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    triggered_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_payment_agreement FOREIGN KEY (agreement_id) REFERENCES project_agreements(id) ON DELETE CASCADE,
    CONSTRAINT fk_payment_milestone FOREIGN KEY (milestone_id) REFERENCES milestones(id) ON DELETE SET NULL
);

-- 4. AGREEMENT RESPONSIBILITIES (Contractual stakeholder responsibilities)
CREATE TABLE IF NOT EXISTS agreement_responsibilities (
    id VARCHAR(36) PRIMARY KEY,
    agreement_id VARCHAR(36) NOT NULL,
    owner_role VARCHAR(50) NOT NULL,
    owner_id VARCHAR(36),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    due_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'AGREED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_resp_agreement FOREIGN KEY (agreement_id) REFERENCES project_agreements(id) ON DELETE CASCADE,
    CONSTRAINT fk_resp_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. AGREEMENT AMENDMENTS (Formal change control & baseline amendments)
CREATE TABLE IF NOT EXISTS agreement_amendments (
    id VARCHAR(36) PRIMARY KEY,
    agreement_id VARCHAR(36) NOT NULL,
    amendment_number INT NOT NULL DEFAULT 1,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    reason TEXT NOT NULL,
    old_value TEXT NOT NULL,
    new_value TEXT NOT NULL,
    requested_by VARCHAR(36) NOT NULL,
    reviewed_by VARCHAR(36),
    status VARCHAR(50) NOT NULL DEFAULT 'REQUESTED',
    effective_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    CONSTRAINT fk_amendment_agreement FOREIGN KEY (agreement_id) REFERENCES project_agreements(id) ON DELETE CASCADE,
    CONSTRAINT fk_amendment_requester FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_amendment_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 6. INDEXES
CREATE INDEX IF NOT EXISTS idx_agreement_proj ON project_agreements(project_id);
CREATE INDEX IF NOT EXISTS idx_agreement_status ON project_agreements(status);
CREATE INDEX IF NOT EXISTS idx_ag_milestone_ag ON agreement_milestones(agreement_id);
CREATE INDEX IF NOT EXISTS idx_payment_ag ON payment_milestones(agreement_id);
CREATE INDEX IF NOT EXISTS idx_payment_status ON payment_milestones(status);
CREATE INDEX IF NOT EXISTS idx_resp_ag ON agreement_responsibilities(agreement_id);
CREATE INDEX IF NOT EXISTS idx_resp_role ON agreement_responsibilities(owner_role);
CREATE INDEX IF NOT EXISTS idx_amendment_ag ON agreement_amendments(agreement_id);

-- 7. SEED DATA FOR DEMO PROJECT (Smart Campus Management System - SCMS)
INSERT INTO project_agreements (
    id, project_id, version, status, total_value, currency, effective_date,
    baseline_start_date, baseline_end_date, current_forecast_end_date,
    verified_blocking_delay_days, delay_attribution,
    scope_objective, included_modules, excluded_modules, assumptions, agreed_deliverables,
    created_by, approved_by_manager, approved_by_client, created_at, approved_at
) VALUES (
    'ag-scms-001',
    'proj-scms-001',
    1,
    'LOCKED',
    1250000.00,
    'USD',
    '2026-06-01',
    '2026-06-01',
    '2026-11-30',
    '2026-12-04',
    4,
    'Client IT NOC firewall & LDAP endpoint credential delay (+4 days schedule adjustment approved in Amendment #1)',
    'Deliver an integrated, enterprise-grade Smart Campus Management System connecting attendance, access control, student records, payments, and faculty workflows.',
    'UI/UX Design System, Database Partitioning, Core Backend Microservices, React Web Portal, Mobile Attendance Module, Automated Testing Suite, Staging Deployment.',
    'Hardware beacon physical installation, campus cabling, and third-party biometric sensor procurement.',
    'Campus IT department provides LDAP/Active Directory endpoints within 10 days of milestone kickoff; client approvals returned within 5 business days.',
    'Design Tokens Specification v1.0, PostgreSQL Partitioned Schema DDL, RESTful API Gateway OpenAPI Spec, Mobile Attendance APK v1.0-RC1, Production Deployment Playbook.',
    'usr-pm-001',
    'usr-pm-001',
    'usr-client-001',
    NOW() - INTERVAL '90 days',
    NOW() - INTERVAL '85 days'
) ON CONFLICT (project_id) DO UPDATE SET
    status = EXCLUDED.status,
    total_value = EXCLUDED.total_value,
    baseline_start_date = EXCLUDED.baseline_start_date,
    baseline_end_date = EXCLUDED.baseline_end_date,
    current_forecast_end_date = EXCLUDED.current_forecast_end_date,
    verified_blocking_delay_days = EXCLUDED.verified_blocking_delay_days,
    delay_attribution = EXCLUDED.delay_attribution,
    scope_objective = EXCLUDED.scope_objective,
    included_modules = EXCLUDED.included_modules,
    excluded_modules = EXCLUDED.excluded_modules,
    assumptions = EXCLUDED.assumptions,
    agreed_deliverables = EXCLUDED.agreed_deliverables;

-- Seed Payment Milestones for SCMS
INSERT INTO payment_milestones (
    id, agreement_id, milestone_id, title, trigger_type, trigger_value, target_date,
    payment_percentage, payment_amount, status, triggered_at, paid_at
) VALUES
    ('pay-001', 'ag-scms-001', 'ms-scms-001', 'Initial Setup & UI/UX Sign-Off (20% Baseline)', 'PERCENTAGE', 20.0, '2026-06-25', 20.0, 250000.00, 'PAID', NOW() - INTERVAL '70 days', NOW() - INTERVAL '65 days'),
    ('pay-002', 'ag-scms-001', 'ms-scms-003', 'Database Architecture & Backend APIs Core (50% Completion)', 'PERCENTAGE', 50.0, '2026-08-30', 30.0, 375000.00, 'TRIGGERED', NOW() - INTERVAL '5 days', NULL),
    ('pay-003', 'ag-scms-001', 'ms-scms-004', 'Frontend Integration & Mobile Attendance (80% Completion)', 'PERCENTAGE', 80.0, '2026-10-15', 30.0, 375000.00, 'PENDING', NULL, NULL),
    ('pay-004', 'ag-scms-001', 'ms-scms-006', 'Final UAT Sign-off & Production Rollout (100% Handover)', 'PERCENTAGE', 100.0, '2026-11-30', 20.0, 250000.00, 'PENDING', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed Agreement Responsibilities
INSERT INTO agreement_responsibilities (id, agreement_id, owner_role, owner_id, title, description, due_date, status) VALUES
    ('resp-001', 'ag-scms-001', 'CLIENT', 'usr-client-001', 'Campus LDAP / SSO API Credentials', 'Provide test credentials and firewall whitelist for student database integration', '2026-06-15', 'COMPLETED'),
    ('resp-002', 'ag-scms-001', 'CLIENT', 'usr-client-001', 'Milestone Review & Sign-Off', 'Review and provide formal deliverable approvals within 5 business days of submission', '2026-11-30', 'AGREED'),
    ('resp-003', 'ag-scms-001', 'CLIENT', 'usr-client-001', 'RFID Sensor Gateway Specification', 'Supply campus RFID card reader data format and baud rate requirements', '2026-07-10', 'COMPLETED'),
    ('resp-004', 'ag-scms-001', 'MANAGER', 'usr-pm-001', 'Sprint Planning & Resource Allocation', 'Maintain active engineering schedule and manage critical path dependencies', '2026-11-30', 'AGREED'),
    ('resp-005', 'ag-scms-001', 'MANAGER', 'usr-pm-001', 'Weekly Risk & Telemetry Reporting', 'Publish bi-weekly project health indices, variance reports, and blocker escalations', '2026-11-30', 'AGREED'),
    ('resp-006', 'ag-scms-001', 'TEAM', 'usr-dev-001', 'Technical Task Execution & Testing', 'Deliver high-quality code adhering to 85%+ unit test coverage and zero critical vulnerabilities', '2026-11-30', 'AGREED'),
    ('resp-007', 'ag-scms-001', 'TEAM', 'usr-dev-001', 'Daily Progress & Blocker Flagging', 'Report daily progress percentage, effort hours, and immediately flag technical impediments', '2026-11-30', 'AGREED')
ON CONFLICT (id) DO NOTHING;

-- Seed Agreement Amendments (Demonstrating Schedule Baseline Adjustment)
INSERT INTO agreement_amendments (
    id, agreement_id, amendment_number, title, category, reason, old_value, new_value,
    requested_by, reviewed_by, status, effective_date, created_at, approved_at
) VALUES (
    'amend-001',
    'ag-scms-001',
    1,
    'Contract Schedule Adjustment for LDAP Firewall Delay',
    'DEADLINE',
    'Campus IT department took 4 business days to clear security firewall permissions for LDAP integration testing. Baseline schedule adjusted by verified 4-day blocking window.',
    'Contract Baseline Deadline: 2026-11-30',
    'Adjusted Forecast Deadline: 2026-12-04 (Original Baseline preserved)',
    'usr-pm-001',
    'usr-client-001',
    'APPROVED',
    '2026-07-18',
    NOW() - INTERVAL '50 days',
    NOW() - INTERVAL '48 days'
) ON CONFLICT (id) DO NOTHING;
