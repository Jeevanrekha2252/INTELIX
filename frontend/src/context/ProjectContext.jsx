import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateLocalRiskScore } from '../services/mlEngine';
import api, { setAuthToken } from '../services/api';

const ProjectContext = createContext(null);

const INITIAL_PROJECTS = [
  {
    id: 1,
    name: 'Smart Campus 360 — IoT Telemetry Network',
    description: 'Real-time telemetry and IoT sensor network monitoring energy, water grid, and lab infrastructure across university grounds.',
    owner: 'Ishaan Mantri',
    client: 'National University Council',
    health: 72,
    status: 'At Risk',
    priority: 'High',
    deadline: '24 Sep 2026',
    startDate: '01 Aug 2026',
    progress: 68,
    budget: 950000,
    tags: ['IoT Sensors', 'PostgreSQL', 'FastAPI', 'Grafana'],
    tasks: 18,
    done: 12,
    risks: 2,
    members: 6,
    predicted: '28 Sep 2026',
    delayDays: 4,
    category: 'Infrastructure',
    ministry: 'Ministry of Education'
  },
  {
    id: 2,
    name: 'Citizen Service & Civic Portal 2.0',
    description: 'Unified citizen grievance redressal platform with automated NLP routing, SLA monitoring, and WhatsApp notifications.',
    owner: 'Meera Shah',
    client: 'Municipal Administration',
    health: 66,
    status: 'Needs Attention',
    priority: 'Critical',
    deadline: '25 Sep 2026',
    startDate: '10 Aug 2026',
    progress: 60,
    budget: 1400000,
    tags: ['GovTech', 'Spring Boot', 'Kafka', 'React'],
    tasks: 24,
    done: 14,
    risks: 5,
    members: 8,
    predicted: '29 Sep 2026',
    delayDays: 4,
    category: 'Public Administration',
    ministry: 'Ministry of Housing & Urban Affairs'
  },
  {
    id: 3,
    name: 'Green Mobility — Urban EV Transit Telematics',
    description: 'Electric bus fleet tracking, smart depot charging schedule optimization, and passenger load prediction.',
    owner: 'Rohan Kulkarni',
    client: 'State Transport Dept',
    health: 91,
    status: 'On Track',
    priority: 'Medium',
    deadline: '05 Oct 2026',
    startDate: '15 Aug 2026',
    progress: 88,
    budget: 780000,
    tags: ['CleanTech', 'TimescaleDB', 'GIS / GPS', 'Python'],
    tasks: 16,
    done: 14,
    risks: 1,
    members: 5,
    predicted: '03 Oct 2026',
    delayDays: 0,
    category: 'Urban Transport',
    ministry: 'Transport Corporation'
  },
  {
    id: 4,
    name: 'Unified Electronic Health Record Vault',
    description: 'Decentralized citizen electronic health records conforming to ABDM standards, FHIR v4 compliance, and biometric authentication.',
    owner: 'Ananya Sharma',
    client: 'National Health Authority',
    health: 80,
    status: 'On Track',
    priority: 'High',
    deadline: '15 Oct 2026',
    startDate: '20 Aug 2026',
    progress: 72,
    budget: 1250000,
    tags: ['HealthTech', 'ABDM / FHIR', 'OAuth 2.1', 'AWS'],
    tasks: 20,
    done: 14,
    risks: 2,
    members: 7,
    predicted: '17 Oct 2026',
    delayDays: 2,
    category: 'Healthcare',
    ministry: 'National Health Authority'
  }
];

const INITIAL_TASKS = [
  {
    id: 118,
    title: 'Implement Backend API & REST Integration',
    project: 'Smart Campus 360 — IoT Telemetry Network',
    projectId: 1,
    assignee: 'Kabir Singh',
    avatar: 'KS',
    status: 'In Progress',
    priority: 'Critical',
    progress: 62,
    expectedProgress: 85,
    daysRemaining: 2,
    due: '20 Sep',
    risk: 87,
    riskLevel: 'CRITICAL',
    blocked: false,
    dependencyDelayed: true,
    estimatedHours: 40,
    actualHours: 28,
    tags: ['Backend', 'FastAPI'],
    description: 'Construct fault-tolerant REST and webhook ingestion bridge for multi-district telemetry nodes.'
  },
  {
    id: 1,
    title: 'Database schema migration & telemetry partitioning',
    project: 'Smart Campus 360 — IoT Telemetry Network',
    projectId: 1,
    assignee: 'Ishaan Mantri',
    avatar: 'IM',
    status: 'Blocked',
    priority: 'Critical',
    progress: 42,
    expectedProgress: 75,
    daysRemaining: 1,
    due: '19 Sep',
    risk: 92,
    riskLevel: 'CRITICAL',
    blocked: true,
    blockerReason: 'Database migration is 3 days behind expected progress due to high-volume index contention',
    estimatedHours: 48,
    actualHours: 32,
    tags: ['Database', 'PostgreSQL'],
    description: 'Partition the 14M row sensor telemetry events by datetime range to maintain queries <60ms.'
  },
  {
    id: 2,
    title: 'Frontend integration & live chart streaming',
    project: 'Smart Campus 360 — IoT Telemetry Network',
    projectId: 1,
    assignee: 'Marcus Vance',
    avatar: 'MV',
    status: 'Pending',
    priority: 'High',
    progress: 25,
    expectedProgress: 45,
    daysRemaining: 4,
    due: '22 Sep',
    risk: 68,
    riskLevel: 'CRITICAL',
    blocked: false,
    dependencyDelayed: true,
    estimatedHours: 36,
    actualHours: 10,
    tags: ['Frontend', 'React'],
    description: 'Stream live WebSocket readings to the operator UI with WebGL accelerated area charts.'
  },
  {
    id: 3,
    title: 'Automated cross-browser UI & accessibility testing (WCAG)',
    project: 'Smart Campus 360 — IoT Telemetry Network',
    projectId: 1,
    assignee: 'Diya Patel',
    avatar: 'DP',
    status: 'Pending',
    priority: 'Medium',
    progress: 15,
    expectedProgress: 30,
    daysRemaining: 6,
    due: '24 Sep',
    risk: 42,
    riskLevel: 'MEDIUM',
    blocked: false,
    dependencyDelayed: true,
    estimatedHours: 24,
    actualHours: 4,
    tags: ['QA', 'Playwright'],
    description: 'Verify accessibility contrast standards and mobile layout on field technician tablet devices.'
  },
  {
    id: 4,
    title: 'Production release & container rollout',
    project: 'Smart Campus 360 — IoT Telemetry Network',
    projectId: 1,
    assignee: 'Rahul Verma',
    avatar: 'RV',
    status: 'Pending',
    priority: 'High',
    progress: 5,
    expectedProgress: 20,
    daysRemaining: 8,
    due: '26 Sep',
    risk: 35,
    riskLevel: 'LOW',
    blocked: false,
    dependencyDelayed: true,
    estimatedHours: 20,
    actualHours: 1,
    tags: ['DevOps', 'Kubernetes'],
    description: 'Final multi-zone canary deployment and telemetry health verification.'
  },
  {
    id: 5,
    title: 'Grievance classification NLP pipeline & SLA router',
    project: 'Citizen Service & Civic Portal 2.0',
    projectId: 2,
    assignee: 'Priya Sharma',
    avatar: 'PS',
    status: 'In Progress',
    priority: 'High',
    progress: 54,
    expectedProgress: 70,
    daysRemaining: 5,
    due: '23 Sep',
    risk: 58,
    riskLevel: 'MEDIUM',
    blocked: false,
    estimatedHours: 40,
    actualHours: 22,
    tags: ['NLP', 'Python'],
    description: 'Train classification model on historical complaints to auto-assign nodal departments.'
  },
  {
    id: 6,
    title: 'SMS & WhatsApp citizen notification worker service',
    project: 'Citizen Service & Civic Portal 2.0',
    projectId: 2,
    assignee: 'Sana Khan',
    avatar: 'SK',
    status: 'In Progress',
    priority: 'High',
    progress: 45,
    expectedProgress: 65,
    daysRemaining: 3,
    due: '21 Sep',
    risk: 66,
    riskLevel: 'CRITICAL',
    blocked: false,
    estimatedHours: 32,
    actualHours: 16,
    tags: ['Backend', 'Kafka'],
    description: 'Build queue consumer to dispatch automated status updates whenever ticket state changes.'
  },
  {
    id: 7,
    title: 'EV battery telematics ingestion & CAN bus parser',
    project: 'Green Mobility — Urban EV Transit Telematics',
    projectId: 3,
    assignee: 'Ishaan Mantri',
    avatar: 'IM',
    status: 'In Progress',
    priority: 'High',
    progress: 88,
    expectedProgress: 85,
    daysRemaining: 4,
    due: '22 Sep',
    risk: 18,
    riskLevel: 'LOW',
    blocked: false,
    estimatedHours: 28,
    actualHours: 24,
    tags: ['Telemetry', 'TimescaleDB'],
    description: 'High-throughput CAN bus stream parser calculating real-time state of charge and cell temperature.'
  },
  {
    id: 8,
    title: 'ABDM Consent Manager & OAuth 2.1 integration',
    project: 'Unified Electronic Health Record Vault',
    projectId: 4,
    assignee: 'Ananya Sharma',
    avatar: 'AS',
    status: 'Completed',
    priority: 'High',
    progress: 100,
    expectedProgress: 100,
    daysRemaining: 0,
    due: '15 Sep',
    risk: 5,
    riskLevel: 'LOW',
    blocked: false,
    estimatedHours: 32,
    actualHours: 30,
    tags: ['Security', 'OAuth2.1'],
    description: 'PKCE flow and ABDM Health Information Provider (HIP) token exchange endpoints.'
  }
];

const INITIAL_DEPS = [
  { id: 'dep-1', fromId: 1, toId: 118, fromTitle: 'Database schema migration', toTitle: 'Implement Backend API', severity: 'Critical', delayHours: 48, downstreamDelayDays: 2 },
  { id: 'dep-2', fromId: 118, toId: 2, fromTitle: 'Implement Backend API', toTitle: 'Frontend integration', severity: 'High', delayHours: 36, downstreamDelayDays: 2 },
  { id: 'dep-3', fromId: 2, toId: 3, fromTitle: 'Frontend integration', toTitle: 'Automated UI & testing (WCAG)', severity: 'High', delayHours: 24, downstreamDelayDays: 2 },
  { id: 'dep-4', fromId: 3, toId: 4, fromTitle: 'Automated UI & testing (WCAG)', toTitle: 'Production release & rollout', severity: 'Medium', delayHours: 20, downstreamDelayDays: 2 },
  { id: 'dep-5', fromId: 6, toId: 5, fromTitle: 'SMS & WhatsApp worker', toTitle: 'Grievance classification NLP', severity: 'Medium', delayHours: 12, downstreamDelayDays: 1 }
];

const INITIAL_WORKLOAD = [
  { name: 'Rahul Verma', avatar: 'RV', role: 'DevOps & Cloud Lead', load: 92, loadStr: '92%', activeTasks: 3, completedTasks: 12, capacityHours: 40, loggedHours: 36.8, status: 'Overloaded' },
  { name: 'Priya Sharma', avatar: 'PS', role: 'Data & ML Engineer', load: 74, loadStr: '74%', activeTasks: 2, completedTasks: 10, capacityHours: 40, loggedHours: 29.6, status: 'Optimal' },
  { name: 'Marcus Vance', avatar: 'MV', role: 'Senior Frontend Architect', load: 125, loadStr: '125%', activeTasks: 4, completedTasks: 7, capacityHours: 40, loggedHours: 50.0, status: 'Overloaded' },
  { name: 'Ananya Sharma', avatar: 'AS', role: 'Security & Platform Architect', load: 61, loadStr: '61%', activeTasks: 2, completedTasks: 15, capacityHours: 40, loggedHours: 24.4, status: 'Optimal' },
  { name: 'Kabir Singh', avatar: 'KS', role: 'Senior Systems Engineer', load: 88, loadStr: '88%', activeTasks: 3, completedTasks: 8, capacityHours: 40, loggedHours: 35.2, status: 'Watch' },
  { name: 'Diya Patel', avatar: 'DP', role: 'QA & Compliance Lead', load: 52, loadStr: '52%', activeTasks: 1, completedTasks: 14, capacityHours: 40, loggedHours: 20.8, status: 'Optimal' }
];

const INITIAL_DELIVERABLES = [
  { id: 1, name: 'Website Prototype & Shell UI', project: 'Smart Campus 360', milestone: 'Sprint 3 Milestone', owner: 'Marcus Vance', status: 'Completed', dueDate: '14 Sep 2026', reviewStatus: 'Approved', clientFacing: true },
  { id: 2, name: 'Database Schema & Partition Spec', project: 'Smart Campus 360', milestone: 'Core Data Engine', owner: 'Ishaan Mantri', status: 'At Risk', dueDate: '19 Sep 2026', reviewStatus: 'Pending Review', clientFacing: false },
  { id: 3, name: 'Security Specification & ABDM Compliance', project: 'Unified EHR Record Vault', milestone: 'Security Gateway', owner: 'Ananya Sharma', status: 'In Review', dueDate: '22 Sep 2026', reviewStatus: 'Pending Review', clientFacing: true },
  { id: 4, name: 'Citizen Mobile Redressal App (React Native)', project: 'Citizen Service Portal', milestone: 'Public Beta', owner: 'Meera Shah', status: 'In Progress', dueDate: '28 Sep 2026', reviewStatus: 'In Review', clientFacing: true },
  { id: 5, name: 'EV Telematics Real-Time Streaming Pipeline', project: 'Green Mobility Transit', milestone: 'Telemetry Feed', owner: 'Rohan Kulkarni', status: 'Completed', dueDate: '16 Sep 2026', reviewStatus: 'Approved', clientFacing: true }
];

const INITIAL_CHANGE_REQUESTS = [
  {
    id: 'CR-104',
    title: 'Add WhatsApp OTP fallback for citizen identity login',
    project: 'Citizen Service Portal',
    submittedBy: 'Municipal Administration Client',
    date: '17 Sep 2026',
    step: 3, // 1: Submitted, 2: Manager Review, 3: Approved, 4: Task Created, 5: Development, 6: Testing, 7: Client Review
    stepLabel: 'APPROVED / TASK CREATION',
    impactHours: 18,
    priority: 'Medium',
    description: 'Allow citizens without SMS coverage to verify OTP via WhatsApp Business API gateway.'
  },
  {
    id: 'CR-105',
    title: 'Expand telemetry sensor polling frequency to 5 seconds',
    project: 'Smart Campus 360',
    submittedBy: 'Field Engineering Director',
    date: '18 Sep 2026',
    step: 2,
    stepLabel: 'MANAGER REVIEW',
    impactHours: 32,
    priority: 'High',
    description: 'High-frequency telemetry requires revised TimescaleDB chunk sizes and Kafka partition buffers.'
  }
];

const INITIAL_APPROVALS = [
  { id: 1, deliverable: 'Website Prototype & Shell UI', project: 'Smart Campus 360', submittedBy: 'Marcus Vance', date: '16 Sep 2026', status: 'Pending Review', reviewer: 'Client / Director', canApprove: true },
  { id: 2, deliverable: 'Security Specification & ABDM Compliance', project: 'Unified EHR Record Vault', submittedBy: 'Ananya Sharma', date: '17 Sep 2026', status: 'Pending Review', reviewer: 'Executive Reviewer', canApprove: true },
  { id: 3, deliverable: 'EV Telematics Gateway Architecture', project: 'Green Mobility Transit', submittedBy: 'Rohan Kulkarni', date: '15 Sep 2026', status: 'Approved', reviewer: 'Ishaan Mantri', approvedAt: '16 Sep 2026 11:30 AM', outcome: 'Approved without conditions' }
];

const INITIAL_MEETINGS = [
  { id: 1, title: 'Sprint 4 Delivery Risk & Critical Path Sync', project: 'Smart Campus 360', date: 'Today, 3:30 PM', participants: ['Ishaan Mantri', 'Kabir Singh', 'Marcus Vance', 'Rahul Verma'], agenda: 'Resolve Database index delay and prevent API cascade slip', notes: 'Agreed to pair Sana Khan on gateway mocking.', decisions: ['Reallocate 1 backend engineer to schema migration.'], status: 'Upcoming' },
  { id: 2, title: 'Ministry Stakeholder Milestone Demo', project: 'Unified EHR Vault', date: 'Tomorrow, 11:00 AM', participants: ['Dr. Rajesh Nair', 'Meera Shah', 'Ananya Sharma'], agenda: 'Demonstrate ABDM FHIR validator and consent manager flow.', notes: 'Client demo slides verified.', decisions: ['Signed off on Phase 1 FHIR parser.'], status: 'Upcoming' },
  { id: 3, title: 'Sprint Retrospective & Velocity Review', project: 'Citizen Service Portal', date: 'Yesterday, 4:00 PM', participants: ['Meera Shah', 'Priya Sharma', 'Sana Khan'], agenda: 'Review NLP grievance routing accuracy and Kafka lag.', notes: 'NLP accuracy increased from 82% to 91%.', decisions: ['Deploy model update to staging.'], status: 'Past' }
];

const INITIAL_DOCUMENTS = [
  { id: 1, name: 'System Architecture & Critical Path Spec.pdf', type: 'PDF', project: 'Smart Campus 360', owner: 'Ishaan Mantri', updated: '18 Sep 2026', size: '3.4 MB', access: 'Internal Stakeholders' },
  { id: 2, name: 'ABDM FHIR v4 Implementation Guide.pdf', type: 'SPEC', project: 'Unified EHR Vault', owner: 'Ananya Sharma', updated: '15 Sep 2026', size: '5.1 MB', access: 'Public & Ministry' },
  { id: 3, name: 'Database Partitioning & Range Schema.sql', type: 'SCHEMA', project: 'Smart Campus 360', owner: 'Kabir Singh', updated: '17 Sep 2026', size: '420 KB', access: 'Engineering Team' },
  { id: 4, name: 'SLA Redressal Escalation Matrix.xlsx', type: 'SHEET', project: 'Citizen Service Portal', owner: 'Meera Shah', updated: '12 Sep 2026', size: '1.2 MB', access: 'All Members' }
];

const INITIAL_ACTIVITY = [
  { id: 1, time: '10:45 AM', user: 'Ishaan Mantri', text: 'Partitioned sensor telemetry database to 42% completion', type: 'progress', category: 'Sprint' },
  { id: 2, time: '10:12 AM', user: 'Risk Engine', text: 'Detected Critical Path delay: Database schema migration is 3 days behind', type: 'risk', category: 'Early Warning' },
  { id: 3, time: '09:30 AM', user: 'Ananya Sharma', text: 'Delivered ABDM Consent Manager milestone ahead of sprint schedule', type: 'done', category: 'Milestone' },
  { id: 4, time: '08:45 AM', user: 'System', text: 'Portfolio delivery outlook recalculation: Expected delay +4 days', type: 'health', category: 'Forecast' },
  { id: 5, time: 'Yesterday', user: 'Kabir Singh', text: 'Flagged dependency on database migration for Backend API integration', type: 'risk', category: 'Blocker' }
];

const INITIAL_RECOMMENDATIONS = [
  {
    id: 1,
    title: 'Move one available backend engineer to the database migration task',
    type: 'workload',
    severity: 'critical',
    tag: 'Saves 2.5 Days',
    description: 'Database migration is 3 days behind expected progress, shifting downstream Backend API and Frontend integration by approximately 2 days. Moving an available backend engineer immediately restores critical path velocity.',
    actionText: 'Apply Recommendation',
    applied: false
  },
  {
    id: 2,
    title: 'Rebalance Marcus Vance capacity (125% overloaded)',
    type: 'dependency',
    severity: 'warning',
    tag: 'Prevents Burnout',
    description: 'Marcus has 4 active deliverables totaling 50 hours. Offloading the WCAG review to Diya Patel balances team bandwidth below 90%.',
    actionText: 'Rebalance Sprint Tasks',
    applied: false
  },
  {
    id: 3,
    title: 'Pull QA verification forward for Civic Portal NLP router',
    type: 'risk',
    severity: 'info',
    tag: 'Health Boost: +4 Pts',
    description: 'NLP classification model is at 54% progress. Early automated integration testing protects end-of-sprint delivery deadline.',
    actionText: 'Schedule Early QA',
    applied: false
  }
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'Critical Dependency Blocker', message: 'Backend API may delay release. Database migration is 3 days behind.', time: '12m ago', unread: true, type: 'danger' },
  { id: 2, title: 'Client Review Required', message: 'Client approved Website Prototype. Security Specification pending review.', time: '35m ago', unread: true, type: 'info' },
  { id: 3, title: 'Overloaded Team Member', message: 'Marcus Vance is at 125% sprint capacity. Recommendation available.', time: '1h ago', unread: true, type: 'warning' },
  { id: 4, title: 'Milestone Achieved', message: 'Ananya completed ABDM Consent Manager (100%).', time: '2h ago', unread: false, type: 'success' }
];

export const INITIAL_USERS = [
  {
    id: 'u-1',
    fullName: 'Sarah Jenkins',
    email: 'manager@demo.com',
    role: 'PROJECT_MANAGER',
    title: 'Lead Project Manager',
    capacityHoursPerWeek: 40,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-2',
    fullName: 'Alex Chen',
    email: 'developer@demo.com',
    role: 'EMPLOYEE',
    title: 'Senior Backend Engineer',
    capacityHoursPerWeek: 40,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-3',
    fullName: 'Elena Rostova',
    email: 'frontend.dev@demo.com',
    role: 'EMPLOYEE',
    title: 'Frontend Architect',
    capacityHoursPerWeek: 40,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-4',
    fullName: 'David Vance (Dean)',
    email: 'client@demo.com',
    role: 'CLIENT',
    title: 'University Client Sponsor',
    capacityHoursPerWeek: 20,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-5',
    fullName: 'Chancellor Thorne',
    email: 'executive@demo.com',
    role: 'EXECUTIVE',
    title: 'VP Academic Operations',
    capacityHoursPerWeek: 10,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-6',
    fullName: 'System Administrator',
    email: 'admin@demo.com',
    role: 'ADMIN',
    title: 'Platform Administrator',
    capacityHoursPerWeek: 40,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-7',
    fullName: 'Marcus Brody',
    email: 'qa.lead@demo.com',
    role: 'EMPLOYEE',
    title: 'QA & Security Engineer',
    capacityHoursPerWeek: 40,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-8',
    fullName: 'Priya Sharma',
    email: 'devops@demo.com',
    role: 'EMPLOYEE',
    title: 'DevOps & Cloud Engineer',
    capacityHoursPerWeek: 40,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

export const THEMES = [
  { id: 'indigo', name: 'Intelix Command Dark', color: '#4F7CFF', badge: 'Official' },
  { id: 'emerald', name: 'Cyber Emerald', color: '#18C997', badge: 'Clean Tech' },
  { id: 'crimson', name: 'Crimson Risk Alert', color: '#FF4D6D', badge: 'Alert Mode' },
  { id: 'sapphire', name: 'Deep Sapphire', color: '#2563EB', badge: 'Cobalt' }
];

export const ROLES = [
  {
    id: 'manager',
    name: 'Ishaan Mantri',
    roleTitle: 'Engineering Manager & Tech Lead',
    badge: 'Manager',
    dashboardTitle: 'PROJECT CONTROL CENTER',
    dashboardSubtitle: 'Everything you need to keep delivery on track.',
    permissions: 'Full Management, Task Allocations & Interventions'
  },
  {
    id: 'dev',
    name: 'Kabir Singh',
    roleTitle: 'Senior Systems Developer',
    badge: 'Developer',
    dashboardTitle: 'DEVELOPER WORKSPACE',
    dashboardSubtitle: 'Your active sprint tasks, blockers, and dependencies.',
    permissions: 'Task Execution, Blocker Reports & Technical Context'
  },
  {
    id: 'client',
    name: 'Meera Shah',
    roleTitle: 'Client Representative / Stakeholder',
    badge: 'Client',
    dashboardTitle: 'CLIENT PORTAL',
    dashboardSubtitle: 'Transparent progress, milestone tracking, and pending approvals.',
    permissions: 'Milestone Progress, Deliverables & Change Approvals'
  },
  {
    id: 'exec',
    name: 'Dr. Rajesh Nair',
    roleTitle: 'Executive Director / Portfolio Lead',
    badge: 'Executive',
    dashboardTitle: 'PORTFOLIO COMMAND CENTER',
    dashboardSubtitle: 'Portfolio health, strategic delivery forecast, and intervention summary.',
    permissions: 'Portfolio Health, Strategic Forecasts & Executive Decisions'
  },
  {
    id: 'admin',
    name: 'Ananya Sharma',
    roleTitle: 'Platform Administrator',
    badge: 'Admin',
    dashboardTitle: 'SYSTEM CONTROL',
    dashboardSubtitle: 'Manage users, access permissions, audit logs, and platform configurations.',
    permissions: 'Users, Roles, Security, System Config & Audit Logs'
  }
];

export const ROLE_CREDENTIALS = {
  manager: { email: 'manager@demo.com', password: 'password123' },
  dev: { email: 'developer@demo.com', password: 'password123' },
  client: { email: 'client@demo.com', password: 'password123' },
  exec: { email: 'executive@demo.com', password: 'password123' },
  admin: { email: 'admin@demo.com', password: 'password123' }
};

export function ProjectProvider({ children }) {
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('intelix_theme') || 'indigo';
  });

  useEffect(() => {
    localStorage.setItem('intelix_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Authentication & session state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('intelix_authenticated') === 'true';
  });

  const [activeRole, setActiveRole] = useState(() => {
    const savedRole = localStorage.getItem('intelix_role');
    const matched = ROLES.find(r => r.id === savedRole);
    return matched || ROLES[0];
  });

  // App mode: 'app' | 'landing' | 'login'
  // The root route must always default to 'login' unless an authenticated session exists
  const [appMode, setAppMode] = useState(() => {
    const isAuth = localStorage.getItem('intelix_authenticated') === 'true';
    if (!isAuth) return 'login';
    return localStorage.getItem('intelix_app_mode') || 'app';
  });

  useEffect(() => {
    localStorage.setItem('intelix_app_mode', appMode);
  }, [appMode]);

  // Local storage hydrated states
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('intelix_projects_v3');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('intelix_tasks_v3');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [dependencies, setDependencies] = useState(() => {
    const saved = localStorage.getItem('intelix_dependencies_v3');
    return saved ? JSON.parse(saved) : INITIAL_DEPS;
  });

  const [teamWorkload, setTeamWorkload] = useState(() => {
    const saved = localStorage.getItem('intelix_workload_v3');
    return saved ? JSON.parse(saved) : INITIAL_WORKLOAD;
  });

  const [deliverables, setDeliverables] = useState(() => {
    const saved = localStorage.getItem('intelix_deliverables_v3');
    return saved ? JSON.parse(saved) : INITIAL_DELIVERABLES;
  });

  const [changeRequests, setChangeRequests] = useState(() => {
    const saved = localStorage.getItem('intelix_change_requests_v3');
    return saved ? JSON.parse(saved) : INITIAL_CHANGE_REQUESTS;
  });

  const [approvals, setApprovals] = useState(() => {
    const saved = localStorage.getItem('intelix_approvals_v3');
    return saved ? JSON.parse(saved) : INITIAL_APPROVALS;
  });

  const [meetings, setMeetings] = useState(() => {
    const saved = localStorage.getItem('intelix_meetings_v3');
    return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
  });

  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('intelix_documents_v3');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [activity, setActivity] = useState(() => {
    const saved = localStorage.getItem('intelix_activity_v3');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY;
  });

  const [recommendations, setRecommendations] = useState(() => {
    const saved = localStorage.getItem('intelix_recs_v3');
    return saved ? JSON.parse(saved) : INITIAL_RECOMMENDATIONS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('intelix_notifs_v3');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('intelix_users_v3');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [toasts, setToasts] = useState([]);

  // UI Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [drilldownProject, setDrilldownProject] = useState(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [activeView, setActiveView] = useState('Overview');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('intelix_projects_v3', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('intelix_tasks_v3', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('intelix_dependencies_v3', JSON.stringify(dependencies));
  }, [dependencies]);

  useEffect(() => {
    localStorage.setItem('intelix_workload_v3', JSON.stringify(teamWorkload));
  }, [teamWorkload]);

  useEffect(() => {
    localStorage.setItem('intelix_deliverables_v3', JSON.stringify(deliverables));
  }, [deliverables]);

  useEffect(() => {
    localStorage.setItem('intelix_change_requests_v3', JSON.stringify(changeRequests));
  }, [changeRequests]);

  useEffect(() => {
    localStorage.setItem('intelix_approvals_v3', JSON.stringify(approvals));
  }, [approvals]);

  useEffect(() => {
    localStorage.setItem('intelix_meetings_v3', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('intelix_documents_v3', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('intelix_activity_v3', JSON.stringify(activity));
  }, [activity]);

  useEffect(() => {
    localStorage.setItem('intelix_recs_v3', JSON.stringify(recommendations));
  }, [recommendations]);

  useEffect(() => {
    localStorage.setItem('intelix_notifs_v3', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('intelix_users_v3', JSON.stringify(users));
  }, [users]);

  // Toast Helper
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const addActivity = (text, type = 'progress', category = 'Sprint') => {
    const newEntry = {
      id: Date.now(),
      time: 'Just now',
      user: activeRole.name,
      text,
      type,
      category
    };
    setActivity(prev => [newEntry, ...prev.slice(0, 25)]);
  };

  // Backend Synchronizer
  const syncFromBackend = async () => {
    try {
      const backendProjects = await api.getProjects();
      if (Array.isArray(backendProjects) && backendProjects.length > 0) {
        setIsBackendConnected(true);
        const mappedProjects = backendProjects.map((bp, idx) => ({
          id: bp.id,
          name: bp.name,
          description: bp.description || 'Enterprise project initiative managed via Spring Boot',
          owner: bp.owner?.fullName || 'Sarah Jenkins',
          client: bp.clientName || 'University Council',
          health: bp.overallHealthScore ? Math.round(bp.overallHealthScore) : 82,
          status: bp.status === 'ACTIVE' ? 'On Track' : bp.status === 'AT_RISK' ? 'At Risk' : bp.status || 'On Track',
          priority: bp.priority === 'CRITICAL' ? 'Critical' : bp.priority === 'HIGH' ? 'High' : 'Medium',
          deadline: bp.targetCompletionDate || '30 Oct 2026',
          startDate: bp.startDate || '01 Aug 2026',
          progress: 68,
          budget: bp.allocatedBudget || 1200000,
          tags: ['Spring Boot', 'PostgreSQL', 'AI Engine', 'React'],
          tasks: 18,
          done: 12,
          risks: 2,
          members: 6,
          predicted: '02 Nov 2026',
          delayDays: 2,
          category: 'Enterprise Platform',
          ministry: 'National Platform Initiative'
        }));

        try {
          const backendTasks = await api.getProjectTasks(backendProjects[0].id);
          if (Array.isArray(backendTasks) && backendTasks.length > 0) {
            const mappedTasks = backendTasks.map(bt => ({
              id: bt.id,
              title: bt.title,
              project: backendProjects[0].name,
              projectId: backendProjects[0].id,
              assignee: bt.assignee?.fullName || 'Alex Chen',
              avatar: bt.assignee?.fullName ? bt.assignee.fullName.split(' ').map(n => n[0]).join('') : 'AC',
              status: bt.status === 'IN_PROGRESS' ? 'In Progress' : bt.status === 'DONE' ? 'Completed' : bt.status === 'BLOCKED' ? 'Blocked' : 'Pending',
              priority: bt.priority === 'CRITICAL' ? 'Critical' : bt.priority === 'HIGH' ? 'High' : 'Medium',
              progress: bt.progressPercentage || 0,
              expectedProgress: 75,
              daysRemaining: bt.daysRemaining || 5,
              due: bt.dueDate ? bt.dueDate.substring(5) : '25 Sep',
              risk: bt.riskScore ? Math.round(bt.riskScore) : 42,
              riskLevel: bt.riskLevel || 'MEDIUM',
              blocked: !!bt.isBlocked,
              blockerReason: bt.blockerReason || '',
              estimatedHours: bt.estimatedHours || 24,
              actualHours: bt.loggedHours || 8,
              tags: [bt.priority || 'Sprint'],
              description: bt.description || ''
            }));

            setTasks(prev => {
              const remaining = prev.filter(p => !mappedTasks.some(mt => mt.id === p.id));
              return [...mappedTasks, ...remaining];
            });
          }
        } catch (taskErr) {
          console.warn('Backend tasks query notice:', taskErr.message);
        }

        try {
          const backendUsers = await api.getUsers();
          if (Array.isArray(backendUsers) && backendUsers.length > 0) {
            setUsers(backendUsers);
          }
        } catch (uErr) {
          console.warn('Backend users sync note:', uErr.message);
        }

        setProjects(prev => {
          const remaining = prev.filter(p => !mappedProjects.some(mp => mp.id === p.id));
          return [...mappedProjects, ...remaining];
        });
      }
    } catch (err) {
      console.warn('Backend sync unavailable, using local cache:', err.message);
      setIsBackendConnected(false);
    }
  };

  // Initial Backend Health & Auto-Sync
  useEffect(() => {
    const initBackend = async () => {
      const isHealthy = await api.checkHealth();
      if (isHealthy) {
        setIsBackendConnected(true);
        const savedRole = localStorage.getItem('intelix_role') || 'manager';
        const creds = ROLE_CREDENTIALS[savedRole] || ROLE_CREDENTIALS.manager;
        try {
          await api.login(creds.email, creds.password);
          await syncFromBackend();
        } catch (e) {
          console.warn('Background auto-login info:', e.message);
        }
      } else {
        setIsBackendConnected(false);
      }
    };
    initBackend();
  }, []);

  // Auth / Role Navigation Helpers - Connected to live backend
  const loginAsRole = async (roleId) => {
    const target = ROLES.find(r => r.id === roleId) || ROLES[0];
    setActiveRole(target);
    setIsAuthenticated(true);
    setAppMode('app');
    setActiveView('Overview');
    localStorage.setItem('intelix_authenticated', 'true');
    localStorage.setItem('intelix_role', target.id);
    localStorage.setItem('intelix_app_mode', 'app');
    showToast(`Authenticated as ${target.name} (${target.badge})`, 'success');

    // Live backend authentication & synchronization
    const creds = ROLE_CREDENTIALS[roleId] || ROLE_CREDENTIALS.manager;
    try {
      const loginResp = await api.login(creds.email, creds.password);
      if (loginResp?.token) {
        setIsBackendConnected(true);
        showToast('Connected to live Spring Boot backend (Port 8080)', 'success');
        await syncFromBackend();
      }
    } catch (authErr) {
      console.warn('Spring Boot live auth fallback:', authErr.message);
      setIsBackendConnected(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAppMode('login');
    setIsBackendConnected(false);
    setAuthToken(null);
    localStorage.removeItem('intelix_authenticated');
    localStorage.removeItem('intelix_role');
    localStorage.removeItem('intelix_app_mode');
    showToast('Signed out of Intelix workspace', 'info');
  };

  // Task Operations
  const addTask = (taskData) => {
    const project = projects.find(p => p.id === taskData.projectId || p.name === taskData.project) || projects[0];
    const riskAnalysis = calculateLocalRiskScore({
      progress: taskData.progress || 0,
      expectedProgress: taskData.expectedProgress || 70,
      daysRemaining: taskData.daysRemaining || 5,
      dependencyRisk: taskData.dependencyRisk || 0,
      workload: 80,
      blocked: !!taskData.blocked
    });

    const newTask = {
      id: Date.now(),
      title: taskData.title,
      project: project.name,
      projectId: project.id,
      assignee: taskData.assignee || 'Ishaan Mantri',
      avatar: taskData.assignee ? taskData.assignee.split(' ').map(n => n[0]).join('').toUpperCase() : 'IM',
      status: taskData.status || 'Pending',
      priority: taskData.priority || 'Medium',
      progress: taskData.progress || 0,
      expectedProgress: taskData.expectedProgress || 70,
      daysRemaining: taskData.daysRemaining || 5,
      due: taskData.due || '25 Sep',
      risk: riskAnalysis.score,
      riskLevel: riskAnalysis.level,
      blocked: !!taskData.blocked,
      blockerReason: taskData.blockerReason || '',
      estimatedHours: taskData.estimatedHours || 24,
      actualHours: taskData.actualHours || 0,
      tags: taskData.tags || ['Task'],
      description: taskData.description || ''
    };

    setTasks(prev => [newTask, ...prev]);
    showToast(`Task "${newTask.title}" assigned to ${newTask.assignee}`, 'success');
    addActivity(`Created task "${newTask.title}" on ${project.name}`, 'done', 'Sprint');

    recalculateProjectHealth(project.id);

    // Sync to Spring Boot backend if connected
    if (isBackendConnected) {
      const targetProjId = project.id && typeof project.id === 'string' && project.id.includes('-')
        ? project.id
        : projects.find(p => typeof p.id === 'string' && p.id.includes('-'))?.id;

      if (targetProjId) {
        api.createTask(targetProjId, {
          title: newTask.title,
          description: newTask.description || newTask.title,
          priority: (newTask.priority || 'MEDIUM').toUpperCase(),
          dueDate: '2026-10-30',
          estimatedHours: newTask.estimatedHours || 24
        }).then(created => {
          if (created?.id) {
            setTasks(prev => prev.map(t => t.id === newTask.id ? { ...t, id: created.id } : t));
          }
        }).catch(err => console.warn('Backend task create notice:', err));
      }
    }
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== id) return task;
      const merged = { ...task, ...updates };
      
      const riskAnalysis = calculateLocalRiskScore({
        progress: merged.progress,
        expectedProgress: merged.expectedProgress ?? 75,
        daysRemaining: merged.daysRemaining ?? 5,
        dependencyRisk: merged.dependencyRisk ?? 0,
        workload: 80,
        blocked: merged.blocked
      });
      merged.risk = riskAnalysis.score;
      merged.riskLevel = riskAnalysis.level;
      return merged;
    }));

    showToast('Task details saved', 'info');
    addActivity(`Updated task "${updates.title || 'Task'}"`, 'progress', 'Sprint');

    // Sync progress to Spring Boot backend
    if (isBackendConnected && typeof id === 'string' && id.includes('-') && updates.progress !== undefined) {
      api.updateTaskProgress(id, updates.progress, updates.actualHours || 0).catch(err => console.warn('Backend progress sync:', err));
    }
  };

  const moveTaskStatus = (id, newStatus) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updates = { status: newStatus };
    if (newStatus === 'Completed') {
      updates.progress = 100;
      updates.risk = 5;
      updates.riskLevel = 'LOW';
      updates.blocked = false;
    } else if (newStatus === 'Blocked') {
      updates.blocked = true;
    } else if (task.blocked && newStatus !== 'Blocked') {
      updates.blocked = false;
    }

    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    showToast(`Moved "${task.title}" → ${newStatus}`, 'success');
    addActivity(`Moved "${task.title}" to ${newStatus}`, newStatus === 'Completed' ? 'done' : 'progress', 'Kanban');

    // Sync status change to Spring Boot backend
    if (isBackendConnected && typeof id === 'string' && id.includes('-')) {
      const backendStatus = newStatus === 'Completed' ? 'DONE' : newStatus === 'Blocked' ? 'BLOCKED' : newStatus === 'In Progress' ? 'IN_PROGRESS' : 'TO_DO';
      api.updateTaskStatus(id, backendStatus).catch(err => console.warn('Backend status sync:', err));
    }
  };

  const toggleTaskBlocker = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Sync blocker to Spring Boot backend
    if (isBackendConnected && typeof id === 'string' && id.includes('-')) {
      api.toggleTaskBlocker(id, !task.blocked ? 'Flagged blocker from Kanban' : '').catch(err => console.warn('Backend blocker sync:', err));
    }

    const newBlocked = !task.blocked;
    const updates = {
      blocked: newBlocked,
      status: newBlocked ? 'Blocked' : (task.status === 'Blocked' ? 'In Progress' : task.status)
    };
    
    const riskAnalysis = calculateLocalRiskScore({
      progress: task.progress,
      expectedProgress: task.expectedProgress,
      daysRemaining: task.daysRemaining,
      dependencyRisk: task.dependencyRisk,
      workload: 80,
      blocked: newBlocked
    });
    updates.risk = riskAnalysis.score;
    updates.riskLevel = riskAnalysis.level;

    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    showToast(newBlocked ? `Flagged blocker on "${task.title}"` : `Resolved blocker on "${task.title}"`, newBlocked ? 'danger' : 'success');
    addActivity(`${newBlocked ? 'Flagged blocker on' : 'Resolved blocker on'} "${task.title}"`, newBlocked ? 'risk' : 'done', 'Blocker');
  };

  const deleteTask = (id) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    setDependencies(prev => prev.filter(d => d.fromId !== id && d.toId !== id));
    showToast(`Task removed`, 'info');
    if (task) addActivity(`Deleted task "${task.title}"`, 'progress', 'Sprint');
  };

  const addProject = (proj) => {
    const newProj = {
      id: Date.now(),
      name: proj.name,
      description: proj.description || 'Monitored Initiative',
      owner: proj.owner || activeRole.name,
      client: proj.client || 'Enterprise Stakeholder',
      health: 88,
      status: 'On Track',
      priority: proj.priority || 'Medium',
      deadline: proj.deadline || '30 Oct 2026',
      startDate: proj.startDate || '01 Sep 2026',
      progress: 0,
      budget: proj.budget || 800000,
      tags: proj.tags || ['Cloud', 'Intelligence'],
      tasks: 0,
      done: 0,
      risks: 0,
      members: proj.members || 5,
      predicted: proj.deadline || '30 Oct 2026',
      delayDays: 0,
      category: proj.category || 'General',
      ministry: proj.ministry || 'Strategic Initiative'
    };

    setProjects(prev => [newProj, ...prev]);
    showToast(`Initiative "${newProj.name}" launched!`, 'success');
    addActivity(`Launched initiative "${newProj.name}"`, 'done', 'Project');
  };

  const recalculateProjectHealth = (projectId) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const projTasks = tasks.filter(t => t.projectId === projectId || t.project === p.name);
      if (projTasks.length === 0) return p;

      const totalProgress = projTasks.reduce((acc, t) => acc + t.progress, 0);
      const avgProgress = Math.round(totalProgress / projTasks.length);
      const riskCount = projTasks.filter(t => t.risk >= 60).length;
      const doneCount = projTasks.filter(t => t.status === 'Completed').length;
      
      const health = Math.max(25, Math.min(100, Math.round(100 - (riskCount * 10) + (avgProgress * 0.12))));
      const status = health >= 75 ? 'On Track' : health >= 55 ? 'Needs Attention' : 'Critical';

      return {
        ...p,
        tasks: projTasks.length,
        done: doneCount,
        progress: avgProgress,
        risks: riskCount,
        health,
        status
      };
    }));
  };

  const addDependency = (dep) => {
    const newDep = {
      id: `dep-${Date.now()}`,
      fromId: dep.fromId,
      toId: dep.toId,
      fromTitle: dep.fromTitle,
      toTitle: dep.toTitle,
      severity: dep.severity || 'High',
      delayHours: dep.delayHours || 12,
      downstreamDelayDays: dep.downstreamDelayDays || 2
    };
    setDependencies(prev => [...prev, newDep]);
    showToast(`Linked: "${dep.fromTitle}" → "${dep.toTitle}"`, 'success');
    addActivity(`Added dependency link: ${dep.fromTitle} → ${dep.toTitle}`, 'progress', 'Dependency');
  };

  const deleteDependency = (depId) => {
    setDependencies(prev => prev.filter(d => d.id !== depId));
    showToast('Dependency link removed', 'info');
  };

  const applyRecommendation = (recId) => {
    const rec = recommendations.find(r => r.id === recId);
    if (!rec) return;

    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, applied: true } : r));

    // Specifically handle the signature recommendation: Move 1 backend engineer to database migration
    if (recId === 1) {
      setTasks(prev => prev.map(t => {
        if (t.id === 1) { // Database schema task
          return {
            ...t,
            progress: Math.min(100, t.progress + 25),
            risk: 35,
            riskLevel: 'LOW',
            blocked: false,
            blockerReason: ''
          };
        }
        if (t.id === 118) { // Backend API task
          return {
            ...t,
            risk: 42,
            riskLevel: 'MEDIUM',
            dependencyDelayed: false
          };
        }
        return t;
      }));

      // Update project delivery forecast
      setProjects(prev => prev.map(p => {
        if (p.id === 1) {
          return {
            ...p,
            health: 84,
            status: 'On Track',
            predicted: '25 Sep 2026',
            delayDays: 1
          };
        }
        return p;
      }));
    }

    showToast(`Action executed: "${rec.title}"`, 'success');
    addActivity(`Executed action: ${rec.title}`, 'done', 'Sprint Action');
  };

  const applyRebalancePlan = (suggestions) => {
    if (!suggestions || suggestions.length === 0) return;

    setTasks(prev => prev.map(t => {
      const match = suggestions.find(s => s.taskId === t.id);
      if (!match) return t;
      return {
        ...t,
        assignee: match.toMember,
        avatar: match.toMember.split(' ').map(n => n[0]).join('').toUpperCase(),
        risk: Math.max(15, t.risk - match.riskReduction)
      };
    }));

    setTeamWorkload(prev => {
      const copy = prev.map(m => ({ ...m }));
      suggestions.forEach(s => {
        const from = copy.find(m => m.name === s.fromMember);
        const to = copy.find(m => m.name === s.toMember);
        if (from) {
          from.load = Math.max(45, from.load - 18);
          from.loadStr = `${from.load}%`;
          from.status = from.load > 80 ? 'Overloaded' : from.load > 70 ? 'Watch' : 'Optimal';
        }
        if (to) {
          to.load = Math.min(80, to.load + 18);
          to.loadStr = `${to.load}%`;
          to.status = to.load > 80 ? 'Overloaded' : to.load > 70 ? 'Watch' : 'Optimal';
        }
      });
      return copy;
    });

    showToast(`Workload rebalanced: ${suggestions.length} task(s) reassigned!`, 'success');
    addActivity(`Rebalanced sprint workload across ${suggestions.length} team members`, 'done', 'Resource Plan');
  };

  // Deliverables & Formal Sign-Off
  const approveDeliverable = async (id, outcomeNote = 'Approved without conditions', signature = '') => {
    const sig = signature || `SHA256:${Math.random().toString(16).substring(2, 10).toUpperCase()}`;
    setApprovals(prev => prev.map(a => a.id === id ? {
      ...a,
      status: 'Approved',
      outcome: outcomeNote,
      reviewer: activeRole.name,
      signature: sig,
      approvedAt: 'Just now'
    } : a));
    setDeliverables(prev => prev.map(d => d.id === id ? { ...d, reviewStatus: 'Approved' } : d));
    try {
      if (isBackendConnected) {
        await api.submitApprovalDecision(id, 'APPROVED', outcomeNote);
      }
    } catch (e) {
      console.warn('Backend approval sync:', e.message);
    }
    showToast('Deliverable sign-off approved and logged in immutable ledger', 'success');
    addActivity(`Approved deliverable #${id} (${outcomeNote})`, 'done', 'Approvals');
  };

  const requestChangesDeliverable = async (id, outcomeNote = 'Revision and clarification requested', signature = '') => {
    const sig = signature || `SHA256:${Math.random().toString(16).substring(2, 10).toUpperCase()}`;
    setApprovals(prev => prev.map(a => a.id === id ? {
      ...a,
      status: 'Changes Requested',
      outcome: outcomeNote,
      reviewer: activeRole.name,
      signature: sig,
      approvedAt: 'Just now'
    } : a));
    setDeliverables(prev => prev.map(d => d.id === id ? { ...d, reviewStatus: 'Changes Requested' } : d));
    try {
      if (isBackendConnected) {
        await api.submitApprovalDecision(id, 'REVISE_REQUESTED', outcomeNote);
      }
    } catch (e) {
      console.warn('Backend request changes sync:', e.message);
    }
    showToast('Formal revision requested. Deliverable owner alerted.', 'warning');
    addActivity(`Requested changes on deliverable #${id}`, 'risk', 'Approvals');
  };

  // Change Requests Lifecycle & 1-Click Task Conversion
  const submitChangeRequest = async (crData) => {
    const newCr = {
      id: `CR-SCMS-00${changeRequests.length + 1}`,
      title: crData.title,
      project: crData.project || projects[0]?.name || 'Smart Campus 360',
      projectId: crData.projectId || projects[0]?.id || 1,
      description: crData.description,
      submittedBy: activeRole.name,
      scheduleImpact: crData.scheduleImpact || '+3 days',
      budgetImpact: crData.budgetImpact || '₹45,000',
      step: 1,
      stepLabel: 'SUBMITTED',
      date: 'Today',
      status: 'Pending Review'
    };
    setChangeRequests(prev => [newCr, ...prev]);
    try {
      if (isBackendConnected && newCr.projectId) {
        await api.createChangeRequest(newCr.projectId, {
          title: newCr.title,
          description: newCr.description,
          impactAnalysis: `Schedule: ${newCr.scheduleImpact}, Budget: ${newCr.budgetImpact}`,
          estimatedEffortHours: 24
        });
      }
    } catch (e) {
      console.warn('Backend change request create:', e.message);
    }
    showToast(`Change Request ${newCr.id} submitted for governance review`, 'success');
    addActivity(`Submitted change request: ${newCr.title}`, 'risk', 'Change Governance');
  };

  const advanceChangeRequest = (id) => {
    setChangeRequests(prev => prev.map(cr => {
      if (cr.id !== id) return cr;
      const nextStep = Math.min(7, cr.step + 1);
      const labels = [
        'SUBMITTED',
        'MANAGER REVIEW',
        'APPROVED / CLARIFICATION',
        'TASK CREATED',
        'DEVELOPMENT',
        'TESTING',
        'CLIENT REVIEW'
      ];
      return {
        ...cr,
        step: nextStep,
        stepLabel: labels[nextStep - 1]
      };
    }));
    showToast(`Change request ${id} transitioned to next stage`, 'info');
  };

  const convertChangeRequestToTask = async (crId) => {
    const cr = changeRequests.find(c => c.id === crId);
    if (!cr) return;

    const newTask = {
      id: tasks.length + 1,
      taskKey: `CR-${Date.now().toString().slice(-3)}`,
      title: `[CR Implementation] ${cr.title}`,
      description: `Formal Change Request approved: ${cr.description}. Schedule impact: ${cr.scheduleImpact}`,
      project: cr.project || projects[0]?.name,
      projectId: cr.projectId || projects[0]?.id,
      assignee: 'Alex Chen',
      avatar: 'AC',
      status: 'In Progress',
      priority: 'High',
      progress: 10,
      due: '29 Sep',
      estimatedHours: 28,
      actualHours: 0,
      risk: 42,
      riskLevel: 'MEDIUM',
      blocked: false,
      branchName: `feature/cr-${cr.id.toLowerCase()}`,
      pullRequestUrl: 'https://github.com/Jeevanrekha2252/INTELIX/pull/19',
      prStatus: 'OPEN',
      commitsCount: 1
    };

    setTasks(prev => [newTask, ...prev]);
    setChangeRequests(prev => prev.map(c => c.id === crId ? { ...c, step: 4, stepLabel: 'TASK CREATED', status: 'Converted to Task' } : c));

    try {
      if (isBackendConnected) {
        await api.convertChangeRequestToTask(crId);
      }
    } catch (e) {
      console.warn('Backend convert CR error:', e.message);
    }

    showToast(`Change Request ${cr.id} converted into active sprint task!`, 'success');
    addActivity(`Converted Change Request ${cr.id} to sprint task`, 'done', 'Sprint Plan');
  };

  // Meetings Collaboration & 1-Click Action Conversion
  const scheduleMeeting = async (meetingData) => {
    const newMeeting = {
      id: meetings.length + 1,
      title: meetingData.title,
      project: meetingData.project || projects[0]?.name,
      date: meetingData.date || 'Tomorrow, 2:00 PM',
      participants: meetingData.participants || ['Sarah Jenkins', 'Alex Chen', 'David Vance (Dean)'],
      agenda: meetingData.agenda || 'Review sprint deliverables and unblock critical path items.',
      decisions: meetingData.decisions || ['Schedule regular pair programming for database migration.'],
      status: 'Upcoming'
    };
    setMeetings(prev => [newMeeting, ...prev]);
    try {
      if (isBackendConnected && projects[0]?.id) {
        await api.scheduleMeeting(projects[0].id, {
          title: newMeeting.title,
          agenda: newMeeting.agenda,
          scheduledTime: new Date(Date.now() + 86400000).toISOString()
        });
      }
    } catch (e) {
      console.warn('Backend schedule meeting error:', e.message);
    }
    showToast(`Meeting "${newMeeting.title}" scheduled and synchronized with calendar`, 'success');
    addActivity(`Scheduled project meeting: ${newMeeting.title}`, 'progress', 'Collaboration');
  };

  const convertMeetingActionToTask = async (actionText, projectTitle, actionId = null) => {
    const newTask = {
      id: tasks.length + 1,
      taskKey: `ACT-${Date.now().toString().slice(-3)}`,
      title: `[Action Item] ${actionText}`,
      description: `Formal action item decided during stakeholder sync: ${actionText}`,
      project: projectTitle || projects[0]?.name,
      assignee: 'Alex Chen',
      avatar: 'AC',
      status: 'In Progress',
      priority: 'High',
      progress: 0,
      due: '25 Sep',
      estimatedHours: 16,
      actualHours: 0,
      risk: 35,
      riskLevel: 'LOW',
      blocked: false,
      branchName: 'feature/meeting-action',
      pullRequestUrl: '',
      commitsCount: 0
    };
    setTasks(prev => [newTask, ...prev]);
    try {
      if (isBackendConnected && actionId) {
        await api.convertActionItemToTask(actionId);
      }
    } catch (e) {
      console.warn('Backend convert action error:', e.message);
    }
    showToast('Meeting action item converted into active sprint deliverable!', 'success');
    addActivity(`Converted meeting action item into active task`, 'done', 'Action Items');
  };

  // Documents & Artifacts
  const uploadDocument = async (docData) => {
    const newDoc = {
      id: documents.length + 1,
      name: docData.name || 'Architecture Specification.pdf',
      type: docData.type || 'PDF',
      project: docData.project || projects[0]?.name,
      owner: activeRole.name,
      updated: 'Just now',
      size: docData.size || '2.4 MB',
      access: docData.access || 'Internal Stakeholders',
      description: docData.description || 'Versioned project technical artifact.'
    };
    setDocuments(prev => [newDoc, ...prev]);
    try {
      if (isBackendConnected && projects[0]?.id) {
        await api.uploadDocument(projects[0].id, {
          filename: newDoc.name,
          description: newDoc.description,
          fileSize: 2400000,
          contentType: 'application/pdf'
        });
      }
    } catch (e) {
      console.warn('Backend upload document error:', e.message);
    }
    showToast(`Document "${newDoc.name}" uploaded to project repository`, 'success');
    addActivity(`Uploaded project artifact: ${newDoc.name}`, 'done', 'Documents');
  };

  // User Administration & Governance
  const toggleUserStatus = async (userId) => {
    let updatedStatus = false;
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        updatedStatus = !(u.isActive !== false);
        return { ...u, isActive: updatedStatus };
      }
      return u;
    }));
    try {
      if (isBackendConnected) {
        await api.toggleUserStatus(userId, updatedStatus);
      }
    } catch (err) {
      console.warn('Backend toggleUserStatus error:', err.message);
    }
    showToast(`User status updated to ${updatedStatus ? 'Active' : 'Deactivated'}`, 'info');
    addActivity(`Updated user status for account #${userId}`, 'progress', 'Governance');
  };

  const addUser = (userData) => {
    const newUser = {
      id: `u-${Date.now()}`,
      fullName: userData.fullName,
      email: userData.email,
      role: userData.role || 'EMPLOYEE',
      title: userData.title || 'Team Member',
      capacityHoursPerWeek: userData.capacityHoursPerWeek || 40,
      isActive: true,
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    };
    setUsers(prev => [newUser, ...prev]);
    showToast(`Provisioned account for ${newUser.fullName} (${newUser.role})`, 'success');
    addActivity(`Provisioned new platform account: ${newUser.fullName}`, 'done', 'Governance');
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast('All notifications marked as read', 'info');
  };

  const resetToDefaults = () => {
    localStorage.removeItem('intelix_projects_v3');
    localStorage.removeItem('intelix_tasks_v3');
    localStorage.removeItem('intelix_dependencies_v3');
    localStorage.removeItem('intelix_workload_v3');
    localStorage.removeItem('intelix_deliverables_v3');
    localStorage.removeItem('intelix_change_requests_v3');
    localStorage.removeItem('intelix_approvals_v3');
    localStorage.removeItem('intelix_meetings_v3');
    localStorage.removeItem('intelix_documents_v3');
    localStorage.removeItem('intelix_activity_v3');
    localStorage.removeItem('intelix_recs_v3');
    localStorage.removeItem('intelix_notifs_v3');

    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    setDependencies(INITIAL_DEPS);
    setTeamWorkload(INITIAL_WORKLOAD);
    setDeliverables(INITIAL_DELIVERABLES);
    setChangeRequests(INITIAL_CHANGE_REQUESTS);
    setApprovals(INITIAL_APPROVALS);
    setMeetings(INITIAL_MEETINGS);
    setDocuments(INITIAL_DOCUMENTS);
    setActivity(INITIAL_ACTIVITY);
    setRecommendations(INITIAL_RECOMMENDATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast('Reset to default project intelligence data', 'info');
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <ProjectContext.Provider
      value={{
        projects,
        tasks,
        dependencies,
        teamWorkload,
        deliverables,
        changeRequests,
        approvals,
        meetings,
        documents,
        activity,
        recommendations,
        notifications,
        unreadCount,
        users,
        toggleUserStatus,
        addUser,
        activeRole,
        setActiveRole,
        theme,
        setTheme,
        appMode,
        setAppMode,
        isAuthenticated,
        loginAsRole,
        logout,
        toasts,
        showToast,
        activeView,
        setActiveView,
        isBackendConnected,
        setIsBackendConnected,

        // Modals
        isSearchOpen,
        setIsSearchOpen,
        isCopilotOpen,
        setIsCopilotOpen,
        isCreateTaskOpen,
        setIsCreateTaskOpen,
        editingTask,
        setEditingTask,
        isCreateProjectOpen,
        setIsCreateProjectOpen,
        drilldownProject,
        setDrilldownProject,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,

        // Actions
        addTask,
        updateTask,
        moveTaskStatus,
        toggleTaskBlocker,
        deleteTask,
        addProject,
        addDependency,
        deleteDependency,
        applyRecommendation,
        applyRebalancePlan,
        approveDeliverable,
        requestChangesDeliverable,
        submitChangeRequest,
        advanceChangeRequest,
        convertChangeRequestToTask,
        scheduleMeeting,
        convertMeetingActionToTask,
        uploadDocument,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDefaults
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
