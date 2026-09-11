-- ============================================================================
-- INTELIX - WEB-BASED INTEGRATED PROJECT MONITORING & COLLABORATION PLATFORM
-- V1: Initial Schema Definition (Temporary Synthetic Database: project_monitoring_dev)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(180) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(30) NOT NULL,
    avatar_url VARCHAR(500),
    title VARCHAR(150),
    capacity_hours_per_week INT NOT NULL DEFAULT 40,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(36) PRIMARY KEY,
    project_key VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    client_id VARCHAR(36),
    manager_id VARCHAR(36),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PLANNING',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    overall_progress INT NOT NULL DEFAULT 0 CHECK (overall_progress BETWEEN 0 AND 100),
    health_score INT NOT NULL DEFAULT 100 CHECK (health_score BETWEEN 0 AND 100),
    health_status VARCHAR(50) NOT NULL DEFAULT 'HEALTHY',
    predicted_completion_date DATE,
    risk_level VARCHAR(20) NOT NULL DEFAULT 'LOW',
    allocated_budget NUMERIC(14, 2) DEFAULT 1000000.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PROJECT MEMBERS
CREATE TABLE IF NOT EXISTS project_members (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    project_role VARCHAR(50) NOT NULL DEFAULT 'MEMBER',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_project_member UNIQUE (project_id, user_id)
);

-- 4. TEAMS
CREATE TABLE IF NOT EXISTS teams (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    lead_id VARCHAR(36),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TEAM MEMBERS
CREATE TABLE IF NOT EXISTS team_members (
    id VARCHAR(36) PRIMARY KEY,
    team_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    role_in_team VARCHAR(80),
    CONSTRAINT uq_team_member UNIQUE (team_id, user_id)
);

-- 6. MILESTONES
CREATE TABLE IF NOT EXISTS milestones (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    progress INT NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    order_index INT NOT NULL DEFAULT 0
);

-- 7. TASKS
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(36) PRIMARY KEY,
    task_key VARCHAR(50) NOT NULL UNIQUE,
    project_id VARCHAR(36) NOT NULL,
    milestone_id VARCHAR(36),
    team_id VARCHAR(36),
    assignee_id VARCHAR(36),
    title VARCHAR(250) NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(30) NOT NULL DEFAULT 'TO_DO',
    progress INT NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    start_date DATE,
    due_date DATE NOT NULL,
    estimated_hours NUMERIC(8, 2) NOT NULL DEFAULT 8.0,
    actual_hours NUMERIC(8, 2) NOT NULL DEFAULT 0.0,
    planned_start DATE,
    actual_start DATE,
    planned_end DATE,
    actual_end DATE,
    initial_estimate NUMERIC(8, 2),
    revised_estimate NUMERIC(8, 2),
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    blocker_reason TEXT,
    repository VARCHAR(200),
    branch_name VARCHAR(150),
    pull_request_url VARCHAR(300),
    pr_status VARCHAR(50),
    commits_count INT NOT NULL DEFAULT 0,
    risk_score INT,
    risk_level VARCHAR(20) DEFAULT 'LOW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TASK DEPENDENCIES
CREATE TABLE IF NOT EXISTS task_dependencies (
    id VARCHAR(36) PRIMARY KEY,
    predecessor_task_id VARCHAR(36) NOT NULL,
    successor_task_id VARCHAR(36) NOT NULL,
    dependency_type VARCHAR(50) NOT NULL DEFAULT 'FINISH_TO_START',
    CONSTRAINT uq_task_dependency UNIQUE (predecessor_task_id, successor_task_id)
);

-- 9. CHANGE REQUESTS
CREATE TABLE IF NOT EXISTS change_requests (
    id VARCHAR(36) PRIMARY KEY,
    cr_key VARCHAR(50) NOT NULL UNIQUE,
    project_id VARCHAR(36) NOT NULL,
    title VARCHAR(250) NOT NULL,
    description TEXT NOT NULL,
    module VARCHAR(120) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    requested_by_id VARCHAR(36) NOT NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'SUBMITTED',
    manager_response TEXT,
    linked_task_id VARCHAR(36),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. DELIVERABLE APPROVALS
CREATE TABLE IF NOT EXISTS deliverable_approvals (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    deliverable_name VARCHAR(250) NOT NULL,
    version VARCHAR(50) NOT NULL DEFAULT '1.0',
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    submitted_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    decided_by_id VARCHAR(36),
    decision_date TIMESTAMPTZ,
    comments TEXT,
    milestone_id VARCHAR(36),
    milestone_name VARCHAR(200),
    task_id VARCHAR(36)
);

-- 11. MEETINGS
CREATE TABLE IF NOT EXISTS meetings (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    title VARCHAR(250) NOT NULL,
    organizer_id VARCHAR(36) NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 45,
    status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
    agenda TEXT NOT NULL,
    notes TEXT,
    decisions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. MEETING PARTICIPANTS
CREATE TABLE IF NOT EXISTS meeting_participants (
    id VARCHAR(36) PRIMARY KEY,
    meeting_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    status VARCHAR(30) DEFAULT 'INVITED',
    CONSTRAINT uq_meeting_participant UNIQUE (meeting_id, user_id)
);

-- 13. MEETING ACTION ITEMS
CREATE TABLE IF NOT EXISTS meeting_action_items (
    id VARCHAR(36) PRIMARY KEY,
    meeting_id VARCHAR(36) NOT NULL,
    description TEXT NOT NULL,
    assignee_id VARCHAR(36),
    is_converted_to_task BOOLEAN NOT NULL DEFAULT FALSE,
    converted_task_id VARCHAR(36)
);

-- 14. COMMENTS / COLLABORATION
CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    task_id VARCHAR(36),
    user_id VARCHAR(36) NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. DOCUMENTS / ARTIFACTS
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    task_id VARCHAR(36),
    filename VARCHAR(250) NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    content_type VARCHAR(120) NOT NULL DEFAULT 'application/octet-stream',
    file_data_base64 TEXT,
    description TEXT,
    uploaded_by_id VARCHAR(36) NOT NULL,
    version VARCHAR(50) NOT NULL DEFAULT '1.0',
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(250) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(30) NOT NULL DEFAULT 'INFO',
    category VARCHAR(80) NOT NULL DEFAULT 'SYSTEM',
    link_url VARCHAR(300),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. RISK ASSESSMENTS
CREATE TABLE IF NOT EXISTS risk_assessments (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    task_id VARCHAR(36),
    risk_score INT NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
    risk_level VARCHAR(20) NOT NULL DEFAULT 'LOW',
    progress_risk NUMERIC(6, 2) DEFAULT 0.0,
    deadline_risk NUMERIC(6, 2) DEFAULT 0.0,
    dependency_risk NUMERIC(6, 2) DEFAULT 0.0,
    workload_risk NUMERIC(6, 2) DEFAULT 0.0,
    blocker_risk NUMERIC(6, 2) DEFAULT 0.0,
    confidence_score INT DEFAULT 85,
    confidence_rating VARCHAR(30) DEFAULT 'GOOD',
    explanation TEXT,
    recommended_action TEXT,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. PROJECT METRICS (EVM, Burndown, Timeseries)
CREATE TABLE IF NOT EXISTS project_metrics (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    metric_type VARCHAR(60) NOT NULL,
    metric_value NUMERIC(14, 4) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. ACTIVITY LOGS (Audit Trail)
CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    actor_id VARCHAR(36) NOT NULL,
    action_type VARCHAR(80) NOT NULL,
    entity_type VARCHAR(60) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. GIT COMMITS (Telemetry)
CREATE TABLE IF NOT EXISTS git_commits (
    id VARCHAR(36) PRIMARY KEY,
    task_id VARCHAR(36) NOT NULL,
    commit_hash VARCHAR(100) NOT NULL,
    message VARCHAR(300) NOT NULL,
    author_name VARCHAR(150) NOT NULL,
    branch_name VARCHAR(150),
    commit_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
