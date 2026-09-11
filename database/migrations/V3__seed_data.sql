-- ============================================================================
-- INTELIX - WEB-BASED INTEGRATED PROJECT MONITORING & COLLABORATION PLATFORM
-- V3: Synthetic Demo Seed Data (Demonstrating Heuristic Risk Scenario)
-- ============================================================================

-- Password Hash for 'password123' generated with Spring BCrypt (10 rounds):
-- $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a

-- 1. USERS (Demo Personas)
INSERT INTO users (id, email, password, full_name, role, avatar_url, title, capacity_hours_per_week, is_active, created_at) VALUES
('u-admin-01', 'admin@demo.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'System Administrator', 'ADMIN', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'Platform Administrator', 40, TRUE, NOW() - INTERVAL '30 days'),
('u-manager-01', 'manager@demo.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Sarah Jenkins', 'PROJECT_MANAGER', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'Lead Project Manager', 40, TRUE, NOW() - INTERVAL '30 days'),
('u-client-01', 'client@demo.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'David Vance (Dean)', 'CLIENT', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'University Client Sponsor', 20, TRUE, NOW() - INTERVAL '30 days'),
('u-dev-01', 'developer@demo.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Alex Chen', 'EMPLOYEE', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'Senior Backend Engineer', 40, TRUE, NOW() - INTERVAL '30 days'),
('u-dev-02', 'developer2@demo.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Elena Rostova', 'EMPLOYEE', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', 'Frontend Architect', 40, TRUE, NOW() - INTERVAL '30 days'),
('u-qa-01', 'qa@demo.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Marcus Brody', 'EMPLOYEE', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', 'QA & Security Engineer', 40, TRUE, NOW() - INTERVAL '30 days'),
('u-ops-01', 'devops@demo.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Priya Sharma', 'EMPLOYEE', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'DevOps & Cloud Engineer', 40, TRUE, NOW() - INTERVAL '30 days'),
('u-exec-01', 'executive@demo.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Chancellor Thorne', 'EXECUTIVE', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', 'VP Academic Operations', 10, TRUE, NOW() - INTERVAL '30 days')
ON CONFLICT (id) DO NOTHING;

-- 2. PROJECTS (Smart Campus Management System)
INSERT INTO projects (id, project_key, name, description, client_id, manager_id, start_date, end_date, status, priority, overall_progress, health_score, health_status, predicted_completion_date, risk_level, allocated_budget, created_at, updated_at) VALUES
('proj-scms-001', 'SCMS', 'Smart Campus Management System', 'Next-generation unified IoT and academic delivery platform connecting automated attendance, dynamic class schedules, campus mapping, and payment processing.', 'u-client-01', 'u-manager-01', CURRENT_DATE - 25, CURRENT_DATE + 15, 'ACTIVE', 'CRITICAL', 68, 64, 'AT_RISK', CURRENT_DATE + 19, 'HIGH', 1250000.00, NOW() - INTERVAL '25 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. PROJECT MEMBERS
INSERT INTO project_members (id, project_id, user_id, project_role, joined_at) VALUES
('pm-01', 'proj-scms-001', 'u-manager-01', 'PROJECT_MANAGER', NOW() - INTERVAL '25 days'),
('pm-02', 'proj-scms-001', 'u-client-01', 'CLIENT_SPONSOR', NOW() - INTERVAL '25 days'),
('pm-03', 'proj-scms-001', 'u-dev-01', 'LEAD_ENGINEER', NOW() - INTERVAL '25 days'),
('pm-04', 'proj-scms-001', 'u-dev-02', 'FRONTEND_ARCHITECT', NOW() - INTERVAL '25 days'),
('pm-05', 'proj-scms-001', 'u-qa-01', 'QA_ENGINEER', NOW() - INTERVAL '25 days'),
('pm-06', 'proj-scms-001', 'u-ops-01', 'DEVOPS_ENGINEER', NOW() - INTERVAL '25 days')
ON CONFLICT (id) DO NOTHING;

-- 4. TEAMS
INSERT INTO teams (id, project_id, name, description, lead_id, created_at) VALUES
('team-ui-01', 'proj-scms-001', 'UI/UX Design', 'Interface wireframes and user experience design systems', 'u-manager-01', NOW() - INTERVAL '25 days'),
('team-db-01', 'proj-scms-001', 'Database Team', 'High-performance PostgreSQL and partition clustering', 'u-dev-01', NOW() - INTERVAL '25 days'),
('team-be-01', 'proj-scms-001', 'Backend Team', 'Spring Boot microservices, security and business workflows', 'u-dev-01', NOW() - INTERVAL '25 days'),
('team-fe-01', 'proj-scms-001', 'Frontend Team', 'React, TypeScript and responsive dashboards', 'u-dev-02', NOW() - INTERVAL '25 days'),
('team-qa-01', 'proj-scms-001', 'QA & Testing', 'Automated E2E Cypress suites and penetration testing', 'u-qa-01', NOW() - INTERVAL '25 days'),
('team-ops-01', 'proj-scms-001', 'DevOps & Cloud', 'Kubernetes cluster, CI/CD pipelines, and observability', 'u-ops-01', NOW() - INTERVAL '25 days')
ON CONFLICT (id) DO NOTHING;

-- 5. TEAM MEMBERS
INSERT INTO team_members (id, team_id, user_id, role_in_team) VALUES
('tm-01', 'team-db-01', 'u-dev-01', 'Lead DBA'),
('tm-02', 'team-be-01', 'u-dev-01', 'Backend Architect'),
('tm-03', 'team-fe-01', 'u-dev-02', 'Frontend Lead'),
('tm-04', 'team-qa-01', 'u-qa-01', 'QA Lead'),
('tm-05', 'team-ops-01', 'u-ops-01', 'DevOps Lead')
ON CONFLICT (id) DO NOTHING;

-- 6. MILESTONES
INSERT INTO milestones (id, project_id, name, description, due_date, status, progress, order_index) VALUES
('ms-01', 'proj-scms-001', 'UI/UX & Architectural Blueprint', 'Design systems, wireframes, and database ERD validation', CURRENT_DATE - 18, 'COMPLETED', 100, 1),
('ms-02', 'proj-scms-001', 'Database & Storage Layer', 'PostgreSQL tables, indexing, migration scripts, and Redis caching', CURRENT_DATE + 2, 'IN_PROGRESS', 55, 2),
('ms-03', 'proj-scms-001', 'Core Backend Services & Auth', 'REST APIs for students, faculty, courses, and Spring Security JWT', CURRENT_DATE + 7, 'IN_PROGRESS', 60, 3),
('ms-04', 'proj-scms-001', 'Frontend Application & Portals', 'Responsive web portals for role-based execution and dashboards', CURRENT_DATE + 10, 'IN_PROGRESS', 45, 4),
('ms-05', 'proj-scms-001', 'Testing & Security Audit', 'Integration tests, load testing, and OWASP vulnerability scans', CURRENT_DATE + 13, 'PENDING', 10, 5),
('ms-06', 'proj-scms-001', 'Production Cloud Deployment', 'Kubernetes cluster provisioning, SSL setup, and production rollout', CURRENT_DATE + 15, 'PENDING', 0, 6)
ON CONFLICT (id) DO NOTHING;

-- 7. TASKS (Demonstrating Critical Path Delay Chain & Workload Overload)
INSERT INTO tasks (
    id, task_key, project_id, milestone_id, team_id, assignee_id,
    title, description, priority, status, progress,
    start_date, due_date, estimated_hours, actual_hours,
    planned_start, actual_start, planned_end, actual_end,
    initial_estimate, revised_estimate,
    is_blocked, blocker_reason, repository, branch_name, pull_request_url, pr_status, commits_count,
    risk_score, risk_level, created_at, updated_at
) VALUES
-- Task 101: Critical Choke Point (Lagging at 30% progress, due in 2 days)
('t-scms-101', 'SCMS-101', 'proj-scms-001', 'ms-02', 'team-db-01', 'u-dev-01',
 'Database Schema & Partitioning', 'Define relational tables, audit columns, foreign keys, and indexes for 50,000 students and course logs.',
 'HIGH', 'IN_PROGRESS', 30,
 CURRENT_DATE - 15, CURRENT_DATE + 2, 24.0, 12.0,
 CURRENT_DATE - 15, CURRENT_DATE - 14, CURRENT_DATE + 2, NULL,
 24.0, 32.0,
 FALSE, NULL, 'smart-campus/database', 'feature/schema-partitioning', 'https://github.com/demo/smart-campus/pull/18', 'UNDER_REVIEW', 4,
 78, 'HIGH', NOW() - INTERVAL '15 days', NOW()),

-- Task 102: Predecessor dependent on SCMS-101
('t-scms-102', 'SCMS-102', 'proj-scms-001', 'ms-03', 'team-be-01', 'u-dev-01',
 'Core REST APIs & Authentication', 'Spring Security JWT authentication, user registration, role verification, and refresh token flow.',
 'CRITICAL', 'IN_PROGRESS', 45,
 CURRENT_DATE - 13, CURRENT_DATE + 5, 32.0, 16.0,
 CURRENT_DATE - 13, CURRENT_DATE - 12, CURRENT_DATE + 5, NULL,
 32.0, 32.0,
 FALSE, NULL, 'smart-campus/backend', 'feature/auth-services', 'https://github.com/demo/smart-campus/pull/24', 'OPEN', 7,
 65, 'HIGH', NOW() - INTERVAL '13 days', NOW()),

-- Task 103: Frontend Integration (Dependent on SCMS-102)
('t-scms-103', 'SCMS-103', 'proj-scms-001', 'ms-04', 'team-fe-01', 'u-dev-02',
 'Frontend Integration with Auth APIs', 'Integrate React token store, Axios interceptors, login modal, and protected dashboard routing.',
 'HIGH', 'TO_DO', 10,
 CURRENT_DATE, CURRENT_DATE + 7, 20.0, 2.0,
 CURRENT_DATE, NULL, CURRENT_DATE + 7, NULL,
 20.0, 20.0,
 FALSE, NULL, 'smart-campus/frontend', 'feature/auth-integration', NULL, NULL, 1,
 52, 'MEDIUM', NOW() - INTERVAL '5 days', NOW()),

-- Task 104: Testing & OWASP Scan (Dependent on SCMS-103)
('t-scms-104', 'SCMS-104', 'proj-scms-001', 'ms-05', 'team-qa-01', 'u-qa-01',
 'End-to-End Testing & Auth Security Scan', 'Cypress E2E test suites for student login, session timeout, and OWASP Top 10 penetration scanning.',
 'HIGH', 'BACKLOG', 0,
 CURRENT_DATE + 6, CURRENT_DATE + 11, 16.0, 0.0,
 CURRENT_DATE + 6, NULL, CURRENT_DATE + 11, NULL,
 16.0, 16.0,
 FALSE, NULL, 'smart-campus/qa', 'feature/e2e-auth-tests', NULL, NULL, 0,
 45, 'MEDIUM', NOW() - INTERVAL '3 days', NOW()),

-- Task 105: Cloud Deployment (Dependent on SCMS-104)
('t-scms-105', 'SCMS-105', 'proj-scms-001', 'ms-06', 'team-ops-01', 'u-ops-01',
 'Kubernetes Staging & Production Deployment', 'Deploy containerized services to multi-node EKS cluster with Helm charts and Ingress routing.',
 'CRITICAL', 'BACKLOG', 0,
 CURRENT_DATE + 10, CURRENT_DATE + 15, 24.0, 0.0,
 CURRENT_DATE + 10, NULL, CURRENT_DATE + 15, NULL,
 24.0, 24.0,
 FALSE, NULL, 'smart-campus/devops', 'feature/eks-helm-deploy', NULL, NULL, 0,
 60, 'MEDIUM', NOW() - INTERVAL '2 days', NOW()),

-- Task 106: Additional heavy task causing Alex Chen (u-dev-01) overload
('t-scms-106', 'SCMS-106', 'proj-scms-001', 'ms-03', 'team-be-01', 'u-dev-01',
 'Attendance Webhook & Real-time Synchronization', 'Websocket pub/sub service to stream RFID attendance gates directly into teacher dashboards.',
 'HIGH', 'IN_PROGRESS', 25,
 CURRENT_DATE - 10, CURRENT_DATE + 3, 28.0, 6.0,
 CURRENT_DATE - 10, CURRENT_DATE - 9, CURRENT_DATE + 3, NULL,
 28.0, 28.0,
 FALSE, NULL, 'smart-campus/backend', 'feature/attendance-stream', NULL, NULL, 2,
 72, 'HIGH', NOW() - INTERVAL '10 days', NOW()),

-- Task 107: Explicitly Blocked Task
('t-scms-107', 'SCMS-107', 'proj-scms-001', 'ms-06', 'team-ops-01', 'u-ops-01',
 'Campus Network VPC Peering & Firewall Rules', 'Configure cross-VPC peering connection between AWS cloud and internal university fiber network.',
 'HIGH', 'BLOCKED', 15,
 CURRENT_DATE - 8, CURRENT_DATE + 4, 14.0, 4.0,
 CURRENT_DATE - 8, CURRENT_DATE - 7, CURRENT_DATE + 4, NULL,
 14.0, 14.0,
 TRUE, 'University IT NOC has not approved firewall ACL change request ticket #8841.', 'smart-campus/infra', 'infra/vpc-peering', NULL, NULL, 1,
 82, 'HIGH', NOW() - INTERVAL '8 days', NOW()),

-- Task 108: Completed Milestone 1 task
('t-scms-108', 'SCMS-108', 'proj-scms-001', 'ms-01', 'team-ui-01', 'u-dev-02',
 'Design System & Figma Component Library', 'Enterprise dark theme design tokens, typography, and interactive prototype.',
 'MEDIUM', 'COMPLETED', 100,
 CURRENT_DATE - 24, CURRENT_DATE - 18, 16.0, 16.0,
 CURRENT_DATE - 24, CURRENT_DATE - 24, CURRENT_DATE - 18, CURRENT_DATE - 18,
 16.0, 16.0,
 FALSE, NULL, 'smart-campus/design', 'design/system-tokens', NULL, 'MERGED', 5,
 0, 'LOW', NOW() - INTERVAL '24 days', NOW() - INTERVAL '18 days'),

-- Task 109: Completed Milestone 1 task
('t-scms-109', 'SCMS-109', 'proj-scms-001', 'ms-01', 'team-ui-01', 'u-dev-02',
 'Student & Faculty UX User Journey Mapping', 'Validate persona journeys for registration, fee payment, and grade lookup.',
 'MEDIUM', 'COMPLETED', 100,
 CURRENT_DATE - 22, CURRENT_DATE - 19, 12.0, 12.0,
 CURRENT_DATE - 22, CURRENT_DATE - 22, CURRENT_DATE - 19, CURRENT_DATE - 19,
 12.0, 12.0,
 FALSE, NULL, 'smart-campus/design', 'design/ux-flows', NULL, 'MERGED', 3,
 0, 'LOW', NOW() - INTERVAL '22 days', NOW() - INTERVAL '19 days'),

-- Task 110: Completed Milestone 1 task (Alex Chen)
('t-scms-110', 'SCMS-110', 'proj-scms-001', 'ms-01', 'team-db-01', 'u-dev-01',
 'Entity Relationship Architecture & Data Dictionary', 'Formal ERD specification documenting 20 database entities and foreign keys.',
 'HIGH', 'COMPLETED', 100,
 CURRENT_DATE - 23, CURRENT_DATE - 18, 14.0, 14.0,
 CURRENT_DATE - 23, CURRENT_DATE - 23, CURRENT_DATE - 18, CURRENT_DATE - 18,
 14.0, 14.0,
 FALSE, NULL, 'smart-campus/database', 'docs/erd-dictionary', NULL, 'MERGED', 4,
 0, 'LOW', NOW() - INTERVAL '23 days', NOW() - INTERVAL '18 days'),

-- Task 111: Code Review (Alex Chen)
('t-scms-111', 'SCMS-111', 'proj-scms-001', 'ms-02', 'team-db-01', 'u-dev-01',
 'Database Migration Scripts & Seeding', 'Version-controlled Flyway migration scripts and synthetic data generator.',
 'MEDIUM', 'CODE_REVIEW', 85,
 CURRENT_DATE - 12, CURRENT_DATE + 1, 10.0, 9.0,
 CURRENT_DATE - 12, CURRENT_DATE - 12, CURRENT_DATE + 1, NULL,
 10.0, 10.0,
 FALSE, NULL, 'smart-campus/database', 'feature/migrations', 'https://github.com/demo/smart-campus/pull/19', 'OPEN', 3,
 35, 'LOW', NOW() - INTERVAL '12 days', NOW()),

-- Task 112: In Progress (Alex Chen)
('t-scms-112', 'SCMS-112', 'proj-scms-001', 'ms-03', 'team-be-01', 'u-dev-01',
 'Course Registration & Prerequisite Validation Engine', 'Algorithmic prerequisite validation and course capacity seat reservation logic.',
 'HIGH', 'IN_PROGRESS', 60,
 CURRENT_DATE - 10, CURRENT_DATE + 6, 22.0, 14.0,
 CURRENT_DATE - 10, CURRENT_DATE - 10, CURRENT_DATE + 6, NULL,
 22.0, 22.0,
 FALSE, NULL, 'smart-campus/backend', 'feature/course-engine', 'https://github.com/demo/smart-campus/pull/26', 'OPEN', 6,
 48, 'MEDIUM', NOW() - INTERVAL '10 days', NOW()),

-- Task 113: In Progress (Elena)
('t-scms-113', 'SCMS-113', 'proj-scms-001', 'ms-04', 'team-fe-01', 'u-dev-02',
 'Student Timetable & Schedule Grid Component', 'Interactive weekly class timetable with conflict warnings and ICS calendar export.',
 'MEDIUM', 'IN_PROGRESS', 70,
 CURRENT_DATE - 8, CURRENT_DATE + 5, 18.0, 12.0,
 CURRENT_DATE - 8, CURRENT_DATE - 8, CURRENT_DATE + 5, NULL,
 18.0, 18.0,
 FALSE, NULL, 'smart-campus/frontend', 'feature/timetable-grid', 'https://github.com/demo/smart-campus/pull/31', 'OPEN', 4,
 28, 'LOW', NOW() - INTERVAL '8 days', NOW()),

-- Task 114: To Do (Elena)
('t-scms-114', 'SCMS-114', 'proj-scms-001', 'ms-04', 'team-fe-01', 'u-dev-02',
 'Interactive SVG Campus Map & Classroom Finder', 'Searchable campus floorplan with pathfinding and room occupancy status.',
 'LOW', 'TO_DO', 20,
 CURRENT_DATE - 2, CURRENT_DATE + 8, 20.0, 4.0,
 CURRENT_DATE - 2, CURRENT_DATE - 2, CURRENT_DATE + 8, NULL,
 20.0, 20.0,
 FALSE, NULL, 'smart-campus/frontend', 'feature/campus-map', NULL, NULL, 1,
 30, 'LOW', NOW() - INTERVAL '2 days', NOW()),

-- Task 115: In Progress (Alex Chen)
('t-scms-115', 'SCMS-115', 'proj-scms-001', 'ms-03', 'team-be-01', 'u-dev-01',
 'Tuition Fee & Payment Gateway Integration', 'Payment gateway webhooks, receipt generation, and transaction ledger synchronization.',
 'HIGH', 'IN_PROGRESS', 40,
 CURRENT_DATE - 6, CURRENT_DATE + 6, 20.0, 8.0,
 CURRENT_DATE - 6, CURRENT_DATE - 5, CURRENT_DATE + 6, NULL,
 20.0, 20.0,
 FALSE, NULL, 'smart-campus/backend', 'feature/payment-gateway', NULL, NULL, 2,
 62, 'HIGH', NOW() - INTERVAL '6 days', NOW()),

-- Task 116: To Do (Marcus)
('t-scms-116', 'SCMS-116', 'proj-scms-001', 'ms-05', 'team-qa-01', 'u-qa-01',
 'API Load Testing (2,000 Concurrent Requests)', 'Simulate student course registration spike with k6 distributed load generator.',
 'MEDIUM', 'TO_DO', 10,
 CURRENT_DATE + 4, CURRENT_DATE + 12, 12.0, 2.0,
 CURRENT_DATE + 4, NULL, CURRENT_DATE + 12, NULL,
 12.0, 12.0,
 FALSE, NULL, 'smart-campus/qa', 'perf/k6-load-scripts', NULL, NULL, 1,
 32, 'LOW', NOW() - INTERVAL '1 day', NOW()),

-- Task 117: In Progress (Elena)
('t-scms-117', 'SCMS-117', 'proj-scms-001', 'ms-04', 'team-fe-01', 'u-dev-02',
 'Dean & Executive Analytics Dashboard', 'High-level KPI charts for registration rates, faculty workloads, and tuition revenue.',
 'HIGH', 'IN_PROGRESS', 65,
 CURRENT_DATE - 5, CURRENT_DATE + 5, 16.0, 10.0,
 CURRENT_DATE - 5, CURRENT_DATE - 5, CURRENT_DATE + 5, NULL,
 16.0, 16.0,
 FALSE, NULL, 'smart-campus/frontend', 'feature/executive-dashboard', 'https://github.com/demo/smart-campus/pull/34', 'OPEN', 3,
 40, 'MEDIUM', NOW() - INTERVAL '5 days', NOW()),

-- Task 118: Backlog (Elena)
('t-scms-118', 'SCMS-118', 'proj-scms-001', 'ms-04', 'team-fe-01', 'u-dev-02',
 'Mobile Responsive Layout & Dark Mode Polishing', 'Refine touch targets, drawer menus, and WCAG AA accessibility contrast ratios.',
 'LOW', 'TO_DO', 0,
 CURRENT_DATE + 3, CURRENT_DATE + 10, 10.0, 0.0,
 CURRENT_DATE + 3, NULL, CURRENT_DATE + 10, NULL,
 10.0, 10.0,
 FALSE, NULL, 'smart-campus/frontend', 'feature/mobile-responsive', NULL, NULL, 0,
 15, 'LOW', NOW() - INTERVAL '1 day', NOW()),

-- Task 119: Backlog (Marcus)
('t-scms-119', 'SCMS-119', 'proj-scms-001', 'ms-05', 'team-qa-01', 'u-qa-01',
 'Cross-Browser Regression Testing', 'Automated Selenium grid test runs across Chrome, Safari, Firefox, and Edge.',
 'LOW', 'BACKLOG', 0,
 CURRENT_DATE + 7, CURRENT_DATE + 13, 8.0, 0.0,
 CURRENT_DATE + 7, NULL, CURRENT_DATE + 13, NULL,
 8.0, 8.0,
 FALSE, NULL, 'smart-campus/qa', 'test/cross-browser', NULL, NULL, 0,
 15, 'LOW', NOW() - INTERVAL '1 day', NOW()),

-- Task 120: In Progress (Priya)
('t-scms-120', 'SCMS-120', 'proj-scms-001', 'ms-06', 'team-ops-01', 'u-ops-01',
 'Prometheus & Grafana Health Monitoring Dashboards', 'Configure cluster metric alerts for CPU throttle, database connection pools, and JVM heap.',
 'MEDIUM', 'IN_PROGRESS', 50,
 CURRENT_DATE - 4, CURRENT_DATE + 6, 12.0, 6.0,
 CURRENT_DATE - 4, CURRENT_DATE - 4, CURRENT_DATE + 6, NULL,
 12.0, 12.0,
 FALSE, NULL, 'smart-campus/devops', 'infra/grafana-dashboards', 'https://github.com/demo/smart-campus/pull/38', 'OPEN', 2,
 30, 'LOW', NOW() - INTERVAL '4 days', NOW()),

-- Task 121: Completed (Alex Chen)
('t-scms-121', 'SCMS-121', 'proj-scms-001', 'ms-03', 'team-be-01', 'u-dev-01',
 'Push Notification & Email Dispatch Service', 'Asynchronous notification queue via RabbitMQ with HTML email templates.',
 'LOW', 'COMPLETED', 100,
 CURRENT_DATE - 16, CURRENT_DATE - 10, 8.0, 7.5,
 CURRENT_DATE - 16, CURRENT_DATE - 16, CURRENT_DATE - 10, CURRENT_DATE - 10,
 8.0, 8.0,
 FALSE, NULL, 'smart-campus/backend', 'feature/email-dispatch', NULL, 'MERGED', 2,
 0, 'LOW', NOW() - INTERVAL '16 days', NOW() - INTERVAL '10 days'),

-- Task 122: Completed (Alex Chen)
('t-scms-122', 'SCMS-122', 'proj-scms-001', 'ms-02', 'team-db-01', 'u-dev-01',
 'Redis Cache Layer for Course Catalog', 'Distributed in-memory caching reducing database query latency by 85%.',
 'MEDIUM', 'COMPLETED', 100,
 CURRENT_DATE - 14, CURRENT_DATE - 8, 8.0, 8.0,
 CURRENT_DATE - 14, CURRENT_DATE - 14, CURRENT_DATE - 8, CURRENT_DATE - 8,
 8.0, 8.0,
 FALSE, NULL, 'smart-campus/database', 'feature/redis-cache', NULL, 'MERGED', 3,
 0, 'LOW', NOW() - INTERVAL '14 days', NOW() - INTERVAL '8 days')
ON CONFLICT (id) DO NOTHING;

-- 8. TASK DEPENDENCIES (Finish-to-Start Critical Path Chain)
INSERT INTO task_dependencies (id, predecessor_task_id, successor_task_id, dependency_type) VALUES
('dep-01', 't-scms-101', 't-scms-102', 'FINISH_TO_START'),
('dep-02', 't-scms-102', 't-scms-103', 'FINISH_TO_START'),
('dep-03', 't-scms-103', 't-scms-104', 'FINISH_TO_START'),
('dep-04', 't-scms-104', 't-scms-105', 'FINISH_TO_START'),
('dep-05', 't-scms-101', 't-scms-106', 'FINISH_TO_START')
ON CONFLICT (id) DO NOTHING;

-- 9. CHANGE REQUESTS (Client Persona: Dean David Vance)
INSERT INTO change_requests (id, cr_key, project_id, title, description, module, priority, requested_by_id, status, manager_response, linked_task_id, created_at, updated_at) VALUES
('cr-01', 'CR-SCMS-001', 'proj-scms-001', 'Biometric Facial Recognition Integration', 'Dean office requests expanding the attendance module to support AI facial recognition cameras at lecture hall entrances in addition to standard RFID tap cards.', 'Attendance Tracking', 'HIGH', 'u-client-01', 'SUBMITTED', 'Feasibility evaluated: requires 3 additional camera edge nodes and 4 extra sprint days.', NULL, NOW() - INTERVAL '3 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- 10. DELIVERABLE APPROVALS (Pending Client Decision)
INSERT INTO deliverable_approvals (id, project_id, deliverable_name, version, status, submitted_date, decided_by_id, decision_date, comments, milestone_id, milestone_name, task_id) VALUES
('appr-01', 'proj-scms-001', 'Mobile Attendance Module & RFID Tap Service', '1.0-RC1', 'PENDING', NOW() - INTERVAL '2 days', NULL, NULL, 'Ready for client sign-off. Test build installed on campus demo kiosk.', 'ms-03', 'Core Backend Services & Auth', 't-scms-106')
ON CONFLICT (id) DO NOTHING;

-- 11. MEETINGS & COLLABORATION
INSERT INTO meetings (id, project_id, title, organizer_id, scheduled_at, duration_minutes, status, agenda, notes, decisions, created_at) VALUES
('meet-01', 'proj-scms-001', 'Weekly Sprint Sync & Risk Mitigation Review', 'u-manager-01', NOW() + INTERVAL '1 day' + INTERVAL '14 hours', 45, 'SCHEDULED', '1. Review Database Task delay impact on critical path
2. Discuss Client CR-SCMS-001 Facial Recognition scope
3. Unblock Campus VPC network peering with IT NOC
4. Rebalance senior backend engineer workload', 'Pre-meeting note: Sarah to present AI Copilot recommendations to university stakeholders.', 'Action plan to pair program on SCMS-101 schema partitioning.', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

INSERT INTO meeting_participants (id, meeting_id, user_id, status) VALUES
('mp-01', 'meet-01', 'u-manager-01', 'ORGANIZER'),
('mp-02', 'meet-01', 'u-client-01', 'ACCEPTED'),
('mp-03', 'meet-01', 'u-dev-01', 'ACCEPTED'),
('mp-04', 'meet-01', 'u-dev-02', 'ACCEPTED'),
('mp-05', 'meet-01', 'u-ops-01', 'ACCEPTED')
ON CONFLICT (id) DO NOTHING;

INSERT INTO meeting_action_items (id, meeting_id, description, assignee_id, is_converted_to_task, converted_task_id) VALUES
('mai-01', 'meet-01', 'Reallocate senior backend engineer to assist on SCMS-101 database partitioning', 'u-manager-01', FALSE, NULL),
('mai-02', 'meet-01', 'Follow up with Campus IT director regarding firewall change ticket #8841', 'u-ops-01', FALSE, NULL)
ON CONFLICT (id) DO NOTHING;

-- 12. COMMENTS / COLLABORATION THREADS
INSERT INTO comments (id, project_id, task_id, user_id, comment_text, created_at) VALUES
('comm-01', 'proj-scms-001', 't-scms-101', 'u-manager-01', 'Alex, please ensure student enrollment history table is partitioned by semester to maintain sub-50ms query times.', NOW() - INTERVAL '5 days'),
('comm-02', 'proj-scms-001', 't-scms-101', 'u-dev-01', 'Partition strategy implemented using declarative range partitioning on academic_year. PR #18 updated.', NOW() - INTERVAL '3 days'),
('comm-03', 'proj-scms-001', 't-scms-107', 'u-ops-01', 'Campus NOC team is reviewing ticket #8841 today. Will escalate if not signed off by 3 PM.', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- 13. DOCUMENTS / ARTIFACTS
INSERT INTO documents (id, project_id, task_id, filename, file_size, content_type, description, uploaded_by_id, version, uploaded_at) VALUES
('doc-01', 'proj-scms-001', 't-scms-101', 'SCMS_Relational_Architecture_Specification_v2.pdf', 4194304, 'application/pdf', 'Complete PostgreSQL database schema, partitioning blueprint, and migration guide.', 'u-manager-01', '2.1', NOW() - INTERVAL '10 days'),
('doc-02', 'proj-scms-001', 't-scms-106', 'RFID_Gate_Hardware_Interface_Protocol.pdf', 1845120, 'application/pdf', 'Hardware interface documentation for Turnstile RFID scanners and MQTT brokers.', 'u-dev-01', '1.0', NOW() - INTERVAL '6 days')
ON CONFLICT (id) DO NOTHING;

-- 14. NOTIFICATIONS
INSERT INTO notifications (id, user_id, title, message, severity, category, link_url, is_read, created_at) VALUES
('notif-01', 'u-manager-01', 'Critical Risk Alert: SCMS-101 Lagging', 'Database Schema & Partitioning is at 30% progress with 2 days to deadline. Downstream APIs at risk.', 'CRITICAL', 'RISK', '/projects/proj-scms-001/tasks', FALSE, NOW() - INTERVAL '2 hours'),
('notif-02', 'u-manager-01', 'New Change Request from Client', 'David Vance submitted CR-SCMS-001: Biometric Facial Recognition Integration', 'WARNING', 'CHANGE_REQUEST', '/projects/proj-scms-001/change-requests', FALSE, NOW() - INTERVAL '1 day'),
('notif-03', 'u-client-01', 'Deliverable Ready for Sign-Off', 'Mobile Attendance Module & RFID Tap Service v1.0-RC1 is waiting for your review and approval.', 'INFO', 'APPROVAL', '/projects/proj-scms-001/approvals', FALSE, NOW() - INTERVAL '12 hours'),
('notif-04', 'u-dev-01', 'High Workload Warning', 'You currently have 156 estimated hours assigned across active sprints (390% capacity).', 'WARNING', 'WORKLOAD', '/projects/proj-scms-001/workload', FALSE, NOW() - INTERVAL '5 hours')
ON CONFLICT (id) DO NOTHING;

-- 15. RISK ASSESSMENTS (Historical & Active Telemetry)
INSERT INTO risk_assessments (id, project_id, task_id, risk_score, risk_level, progress_risk, deadline_risk, dependency_risk, workload_risk, blocker_risk, confidence_score, confidenceRating, explanation, recommended_action, calculated_at) VALUES
('risk-01', 'proj-scms-001', 't-scms-101', 78, 'HIGH', 22.5, 18.0, 20.0, 12.0, 0.0, 92, 'HIGH', 'Progress lag: 30% actual vs 65% planned. Due in 2 days. 4 downstream dependencies.', 'Pair senior developer with Alex Chen to accelerate partition tests.', NOW() - INTERVAL '1 hour'),
('risk-02', 'proj-scms-001', 't-scms-107', 82, 'HIGH', 15.0, 12.0, 15.0, 5.0, 25.0, 88, 'HIGH', 'Task flagged as blocked: University NOC firewall approval pending ticket #8841.', 'Escalate ticket #8841 to University Director of Infrastructure.', NOW() - INTERVAL '1 hour'),
('risk-03', 'proj-scms-001', 't-scms-106', 72, 'HIGH', 18.0, 14.0, 10.0, 15.0, 0.0, 85, 'GOOD', 'Developer Alex Chen allocated at 390% capacity across active sprints.', 'Rebalance RFID webhook workload to another backend engineer.', NOW() - INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;

-- 16. PROJECT METRICS (Historical Trend for Analytics Charts)
INSERT INTO project_metrics (id, project_id, metric_type, metric_value, recorded_at) VALUES
-- Sprint Health History
('pmtr-01', 'proj-scms-001', 'HEALTH_SCORE', 94.00, CURRENT_DATE - 20),
('pmtr-02', 'proj-scms-001', 'HEALTH_SCORE', 89.00, CURRENT_DATE - 15),
('pmtr-03', 'proj-scms-001', 'HEALTH_SCORE', 82.00, CURRENT_DATE - 10),
('pmtr-04', 'proj-scms-001', 'HEALTH_SCORE', 74.00, CURRENT_DATE - 5),
('pmtr-05', 'proj-scms-001', 'HEALTH_SCORE', 64.00, CURRENT_DATE),

-- Earned Value Management (EVM) Metrics
('pmtr-06', 'proj-scms-001', 'PLANNED_VALUE', 850000.00, CURRENT_DATE),
('pmtr-07', 'proj-scms-001', 'EARNED_VALUE', 720000.00, CURRENT_DATE),
('pmtr-08', 'proj-scms-001', 'ACTUAL_COST', 780000.00, CURRENT_DATE),
('pmtr-09', 'proj-scms-001', 'CPI', 0.92, CURRENT_DATE), -- Cost Performance Index (<1 = Over budget)
('pmtr-10', 'proj-scms-001', 'SPI', 0.85, CURRENT_DATE), -- Schedule Performance Index (<1 = Behind schedule)

-- Burndown Remaining Hours
('pmtr-11', 'proj-scms-001', 'REMAINING_HOURS', 310.00, CURRENT_DATE - 20),
('pmtr-12', 'proj-scms-001', 'REMAINING_HOURS', 255.00, CURRENT_DATE - 15),
('pmtr-13', 'proj-scms-001', 'REMAINING_HOURS', 210.00, CURRENT_DATE - 10),
('pmtr-14', 'proj-scms-001', 'REMAINING_HOURS', 178.00, CURRENT_DATE - 5),
('pmtr-15', 'proj-scms-001', 'REMAINING_HOURS', 156.00, CURRENT_DATE)
ON CONFLICT (id) DO NOTHING;

-- 17. ACTIVITY LOGS (Audit Trail)
INSERT INTO activity_logs (id, project_id, actor_id, action_type, entity_type, entity_id, old_value, new_value, details, created_at) VALUES
('act-01', 'proj-scms-001', 'u-manager-01', 'PROJECT_INITIALIZED', 'PROJECT', 'proj-scms-001', NULL, 'Smart Campus Management System', 'Project chartered with 6 milestones and 6 teams.', NOW() - INTERVAL '25 days'),
('act-02', 'proj-scms-001', 'u-dev-01', 'TASK_COMPLETED', 'TASK', 't-scms-110', 'IN_PROGRESS', 'COMPLETED', 'Completed Entity Relationship Architecture & Data Dictionary.', NOW() - INTERVAL '18 days'),
('act-03', 'proj-scms-001', 'u-client-01', 'CHANGE_REQUEST_SUBMITTED', 'CHANGE_REQUEST', 'cr-01', NULL, 'CR-SCMS-001', 'Submitted formal change request for biometric facial recognition.', NOW() - INTERVAL '3 days'),
('act-04', 'proj-scms-001', 'u-ops-01', 'BLOCKER_REPORTED', 'TASK', 't-scms-107', 'IN_PROGRESS', 'BLOCKED', 'Flagged firewall ACL blocker on SCMS-107 (NOC ticket #8841).', NOW() - INTERVAL '2 days'),
('act-05', 'proj-scms-001', 'u-dev-01', 'PROGRESS_UPDATED', 'TASK', 't-scms-101', '15%', '30%', 'Updated Database Schema & Partitioning progress to 30%.', NOW() - INTERVAL '4 hours')
ON CONFLICT (id) DO NOTHING;

-- 18. GIT COMMITS (VCS Telemetry)
INSERT INTO git_commits (id, task_id, commit_hash, message, author_name, branch_name, commit_date) VALUES
('gc-01', 't-scms-101', 'a1b2c3d', 'feat: create initial PostgreSQL partition table definition', 'Alex Chen', 'feature/schema-partitioning', NOW() - INTERVAL '4 days'),
('gc-02', 't-scms-101', 'e4f5a6b', 'perf: add b-tree composite index on student_id and academic_year', 'Alex Chen', 'feature/schema-partitioning', NOW() - INTERVAL '2 days'),
('gc-03', 't-scms-102', 'c7d8e9f', 'feat: implement JwtTokenProvider and SecurityFilterChain', 'Alex Chen', 'feature/auth-services', NOW() - INTERVAL '6 days'),
('gc-04', 't-scms-102', '1a2b3c4', 'fix: resolve token expiration refresh corner case', 'Alex Chen', 'feature/auth-services', NOW() - INTERVAL '3 days'),
('gc-05', 't-scms-103', '5e6f7a8', 'feat: scaffold auth context and role-based route guards', 'Elena Rostova', 'feature/auth-integration', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;
