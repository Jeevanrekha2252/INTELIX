-- ============================================================================
-- INTELIX - WEB-BASED INTEGRATED PROJECT MONITORING & COLLABORATION PLATFORM
-- V2: Foreign Key Constraints & Performance Indexes
-- ============================================================================

-- 1. FOREIGN KEYS FOR PROJECTS
ALTER TABLE projects
    ADD CONSTRAINT fk_projects_client FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_projects_manager FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL;

-- 2. FOREIGN KEYS FOR PROJECT MEMBERS
ALTER TABLE project_members
    ADD CONSTRAINT fk_pm_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_pm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 3. FOREIGN KEYS FOR TEAMS
ALTER TABLE teams
    ADD CONSTRAINT fk_teams_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_teams_lead FOREIGN KEY (lead_id) REFERENCES users(id) ON DELETE SET NULL;

-- 4. FOREIGN KEYS FOR TEAM MEMBERS
ALTER TABLE team_members
    ADD CONSTRAINT fk_tm_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_tm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 5. FOREIGN KEYS FOR MILESTONES
ALTER TABLE milestones
    ADD CONSTRAINT fk_milestones_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

-- 6. FOREIGN KEYS FOR TASKS
ALTER TABLE tasks
    ADD CONSTRAINT fk_tasks_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_tasks_milestone FOREIGN KEY (milestone_id) REFERENCES milestones(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_tasks_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_tasks_assignee FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL;

-- 7. FOREIGN KEYS FOR TASK DEPENDENCIES
ALTER TABLE task_dependencies
    ADD CONSTRAINT fk_dep_predecessor FOREIGN KEY (predecessor_task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_dep_successor FOREIGN KEY (successor_task_id) REFERENCES tasks(id) ON DELETE CASCADE;

-- 8. FOREIGN KEYS FOR CHANGE REQUESTS
ALTER TABLE change_requests
    ADD CONSTRAINT fk_cr_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_cr_requester FOREIGN KEY (requested_by_id) REFERENCES users(id) ON DELETE CASCADE;

-- 9. FOREIGN KEYS FOR DELIVERABLE APPROVALS
ALTER TABLE deliverable_approvals
    ADD CONSTRAINT fk_approvals_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_approvals_decider FOREIGN KEY (decided_by_id) REFERENCES users(id) ON DELETE SET NULL;

-- 10. FOREIGN KEYS FOR MEETINGS & COLLABORATION
ALTER TABLE meetings
    ADD CONSTRAINT fk_meetings_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_meetings_organizer FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE meeting_participants
    ADD CONSTRAINT fk_mp_meeting FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_mp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE meeting_action_items
    ADD CONSTRAINT fk_mai_meeting FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_mai_assignee FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE comments
    ADD CONSTRAINT fk_comments_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_comments_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 11. FOREIGN KEYS FOR DOCUMENTS & NOTIFICATIONS
ALTER TABLE documents
    ADD CONSTRAINT fk_docs_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_docs_uploader FOREIGN KEY (uploaded_by_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE notifications
    ADD CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 12. FOREIGN KEYS FOR RISK, METRICS, AUDIT & TELEMETRY
ALTER TABLE risk_assessments
    ADD CONSTRAINT fk_risk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

ALTER TABLE project_metrics
    ADD CONSTRAINT fk_metrics_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

ALTER TABLE activity_logs
    ADD CONSTRAINT fk_logs_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_logs_actor FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE git_commits
    ADD CONSTRAINT fk_commits_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE;

-- ============================================================================
-- PERFORMANCE B-TREE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_milestone ON tasks(milestone_id);
CREATE INDEX IF NOT EXISTS idx_tasks_team ON tasks(team_id);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

CREATE INDEX IF NOT EXISTS idx_dep_pred ON task_dependencies(predecessor_task_id);
CREATE INDEX IF NOT EXISTS idx_dep_succ ON task_dependencies(successor_task_id);

CREATE INDEX IF NOT EXISTS idx_risk_proj_time ON risk_assessments(project_id, calculated_at DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_proj_type ON project_metrics(project_id, metric_type, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_proj_time ON activity_logs(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_meetings_project ON meetings(project_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_cr_project_status ON change_requests(project_id, status);
