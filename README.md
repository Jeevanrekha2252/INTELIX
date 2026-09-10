# WEB-BASED INTEGRATED PROJECT MONITORING & COLLABORATION PLATFORM

> **“One Project. One Source of Truth. Three Role-Based Experiences. Intelligent Project Decisions.”**

---

## 🌟 Executive Summary

The **Web-Based Integrated Project Monitoring & Collaboration Platform (CIP-Monitor)** is an enterprise-grade, intelligence-driven software delivery platform designed to resolve the fundamental disconnect between project managers, external clients, engineering teams, and executive leadership.

Traditional project management tools act as passive digital ledgers. CIP-Monitor functions as an **active intelligence platform**, continuously analyzing project telemetry—commit velocity, dependency choke points, workload imbalances, and deadline proximities—to forecast delays before they manifest, calculate quantifiable risk scores, and propose 1-click corrective interventions.

---

## 🔄 Core Intelligence Loop

```
  ┌─────────┐      ┌──────────┐      ┌───────────┐      ┌─────────────┐
  │  PLAN   │ ───► │  ASSIGN  │ ───► │  EXECUTE  │ ───► │ COLLABORATE │
  └─────────┘      └──────────┘      └───────────┘      └─────────────┘
                                                               │
                                                               ▼
  ┌─────────┐      ┌──────────┐      ┌───────────┐      ┌─────────────┐
  │ DELIVER │ ◄─── │ APPROVE  │ ◄─── │ RECOMMEND │ ◄─── │   MONITOR   │
  └─────────┘      └──────────┘      └───────────┘      └─────────────┘
                                           ▲                   │
                                           │                   ▼
                                     ┌───────────┐      ┌─────────────┐
                                     │  PREDICT  │ ◄─── │   DETECT    │
                                     └───────────┘      └─────────────┘
```

1. **PLAN**: Multi-level Work Breakdown Structure (WBS) with milestones, tasks, and finish-to-start (FS) dependency constraints.
2. **ASSIGN**: Capacity-aware task assignment respecting developer bandwidth and skill matrices.
3. **EXECUTE**: Engineering execution with status tracking, effort logging, and live VCS / Git branch & commit linkages.
4. **COLLABORATE**: Cross-functional discussions, meeting synchronization with action items, and versioned document repositories.
5. **MONITOR**: Real-time aggregation of task status, sprint velocity, and blocker logs.
6. **DETECT**: Automated identification of stalled tasks, overloaded team members, and blocked critical paths.
7. **PREDICT**: Velocity-adjusted Monte Carlo/trend completion forecasting and cascading delay estimation.
8. **RECOMMEND**: AI Project Copilot synthesizing telemetry into actionable 1-click interventions.
9. **APPROVE**: Formal client gatekeeping with cryptographic audit trails for deliverables and change requests.
10. **DELIVER**: Transparent, milestone-gated project handover with zero information asymmetry.

---

## 👥 Three Core Role-Based Experiences (+ Executive & Admin)

| Persona | Demo Account | Default View & Capabilities |
| :--- | :--- | :--- |
| **Project Manager** | `manager@demo.com` / `password123` | **Full Tactical Cockpit**: Project health KPIs, 5-factor risk score breakdown, AI Copilot recommendations, interactive Gantt timeline, Kanban board, workload allocation matrix, and dependency cascade graph. |
| **Client / Stakeholder** | `client@demo.com` / `password123` | **Executive Deliverable Portal**: High-level milestone progress, formal deliverable sign-off (Approve / Request Changes), Change Request (CR) initiation and budget/schedule impact tracking. |
| **Developer / Engineer** | `developer@demo.com` / `password123` | **Execution Cockpit**: Assigned task list, capacity meter (`156h / 40h` overload alert), blocker reporting drawer, Git branch & pull request linkage, and hour logging. |
| **Executive / Leadership**| `executive@demo.com` / `password123` | **Portfolio Strategy Overview**: Cross-project health indices, budget burn rates, risk distributions, and milestone completion confidence. |
| **Platform Administrator**| `admin@demo.com` / `password123` | **Governance & RBAC**: User provisioning, role assignments, system audit logs, and integration settings. |

*Quick 1-Click Role Switcher is available in the application header for instant demonstration.*

---

## 🧠 Algorithmic Intelligence Engines

### 1. 5-Factor Weighted Risk Engine
Computes a normalized Project & Task Risk Index ($R \in [0, 100]$):
$$R = (0.25 \times \text{Lag}) + (0.20 \times \text{Proximity}) + (0.25 \times \text{DependencyImpact}) + (0.15 \times \text{Workload}) + (0.15 \times \text{Blockers})$$

- **Progress Lag (25%)**: Discrepancy between elapsed calendar duration and actual execution percentage.
- **Deadline Proximity (20%)**: Inverse time remaining until scheduled milestone cutoff.
- **Dependency Cascade (25%)**: Downstream impact on dependent tasks in the Finish-to-Start directed acyclic graph (DAG).
- **Workload Imbalance (15%)**: Ratio of assigned hours to weekly developer capacity ($>100\%$ triggers high risk).
- **Blocker Factor (15%)**: Presence of active impediment flags and unresolved blocker reasons.

### 2. Velocity-Based Predictive Completion Engine
- Calculates historical sprint completion velocity ($v = \Delta \text{StoryPoints} / \Delta \text{Day}$).
- Projects completion dates: $\text{ProjectedCompletion} = \text{CurrentDate} + (\text{RemainingWork} / v) + \text{DependencySlack}$.
- Computes predicted delay days (e.g., $+8\text{ days}$) and flags milestone breach risks.

### 3. Data Confidence Layer
Scores the trustworthiness of project metrics ($[0, 100\%]$) based on:
- Git activity recency vs. logged task status.
- Developer check-in frequency.
- Requirement ambiguity and change request velocity.

### 4. Finish-to-Start (FS) Dependency Cascade Graph
- Models predecessors and successors as a Directed Graph.
- Dynamically calculates cascading slip days when critical path tasks are delayed.

### 5. AI Project Copilot
- Evaluates telemetry triggers and generates structured, prioritized recommendations:
  - *"Allocate additional backend developer to SCMS-101 to recover 4 days of slip."*
  - *"Rebalance workload for Alex Chen (currently allocated at 390% capacity)."*
  - *"Escalate blocked task SCMS-104 to DevOps infrastructure team."*
- Features **1-Click Execution**: Instantly performs rebalancing and updates project state.

---

## 🏗️ Technology Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 18 + Vite)                      │
│  - Tailwind CSS Deep Enterprise Theme   - Lucide React Iconography     │
│  - React Query Data Fetching            - Recharts Analytics           │
│  - HTML5 Canvas & SVG Gantt / DAG       - Role-Based Dynamic Routing   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ HTTP / REST / JSON (JWT Bearer)
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   BACKEND (Spring Boot 3 + Java 21)                    │
│  - Spring Security (Stateless JWT)      - Spring Data JPA (Hibernate)  │
│  - Heuristic Risk Engine Service        - Predictive Analytics Service │
│  - Dependency Topology Processor        - AI Copilot Rule Evaluator    │
│  - Transactional Audit Logging          - Centralized Exception Mesh   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ JDBC
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      DATABASE & PERSISTENCE LAYER                      │
│  - Production: PostgreSQL 16 Relational Engine                         │
│  - Development Fallback: In-Memory H2 (PostgreSQL Dialect Compatible)  │
│  - Automated Relational Seeding: Realistic Multi-Entity Demo Dataset   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Java**: Microsoft OpenJDK 21 or Eclipse Temurin 21
- **Node.js**: v18+ or v20+ with `npm`
- **Maven**: 3.9+ (pre-configured local wrapper provided)
- **Docker & Docker Compose** (Optional, for containerized run)

---

### Option A: Local Development Run (Fastest)

#### 1. Start Backend
Open a terminal in `backend/`:
```bash
# Windows Batch Script (included)
run-backend.bat

# Or using Maven wrapper
mvnw.cmd spring-boot:run
```
*Backend initializes on `http://localhost:8080/api` with seed data automatically populated.*

#### 2. Start Frontend
Open a second terminal in `frontend/`:
```bash
npm install
npm run dev
```
*Frontend runs on `http://127.0.0.1:5173/`.*

---

### Option B: Docker Compose (Full Stack Containerized)

From the project root directory:
```bash
docker compose up --build -d
```

| Service | Port | Description |
| :--- | :--- | :--- |
| **Frontend** | `http://localhost:3000` | Nginx reverse-proxying SPA & API |
| **Backend** | `http://localhost:8080` | Spring Boot 3 Java 21 REST API |
| **Postgres** | `localhost:5432` | PostgreSQL 16 Database |

To tear down:
```bash
docker compose down -v
```

---

## 🎯 Realistic Demo Scenario: "Smart Campus Management System (SCMS)"

When launching the platform, it is pre-seeded with a production-grade enterprise scenario:
- **Project**: *Smart Campus Management System (SCMS)*
- **Status**: `AT RISK` | **Overall Progress**: `68%`
- **Predicted Finish Date**: `2026-09-24` (+8 days variance against contractual milestone)
- **Critical Path Choke Point**:
  - `SCMS-101`: *Database Schema & Partitioning* (Alex Chen, 30% complete, 2 days to deadline, blocks Backend Core Services `SCMS-102`).
- **Overloaded Developer Alert**:
  - Alex Chen has 156 hours assigned against a 40-hour capacity (>390% workload).
- **Active Blocked Task**:
  - `SCMS-104`: *SSO & Active Directory Federation* (Blocked: "Awaiting Campus IT LDAP endpoint credentials").
- **Pending Client Change Request**:
  - `CR-SCMS-001`: *Biometric Facial Recognition Integration* by Dean David Vance.
- **Pending Deliverable Approval**:
  - `Version 1.0-RC1`: *Mobile Attendance Module & RFID Tap Service*.

---

## 📡 REST API Endpoint Specification

### Authentication & RBAC
- `POST /api/auth/login` - Authenticate user, return JWT and user profile
- `GET /api/auth/me` - Retrieve current authenticated principal
- `GET /api/users` - List system users and roles

### Projects & Milestones
- `GET /api/projects` - List all projects
- `GET /api/projects/{id}` - Detailed project metrics and WBS
- `GET /api/milestones/project/{id}` - Milestone gates and progress

### Tasks & Dependencies
- `GET /api/tasks/project/{id}` - Full task list with blockers and progress
- `POST /api/tasks` - Create task with estimates and assignees
- `PUT /api/tasks/{id}` - Update progress, status, logged hours, or blocker reason
- `GET /api/dependencies/project/{id}` - Finish-to-Start dependency network
- `POST /api/dependencies` - Add dependency constraint

### Intelligence, Risk & Analytics
- `GET /api/risk/project/{id}` - 5-factor weighted risk score and breakdown
- `GET /api/predictions/project/{id}` - Predicted completion date and delay days
- `GET /api/workload/project/{id}` - Team member capacity allocation matrix
- `GET /api/copilot/recommendations/{id}` - AI Project Copilot recommendations
- `POST /api/copilot/execute` - Execute 1-click recommendation action

### Governance, Collaboration & Audit
- `GET /api/change-requests/project/{id}` - Client Change Requests (CRs)
- `POST /api/change-requests` - Submit new client change request
- `PUT /api/change-requests/{id}/status` - Approve / Reject CR
- `GET /api/approvals/project/{id}` - Formal deliverable sign-offs
- `POST /api/approvals/{id}/action` - Client Sign-Off / Request Changes
- `GET /api/meetings/project/{id}` - Synchronized meetings and action items
- `GET /api/documents/project/{id}` - Versioned project documentation
- `GET /api/audit/project/{id}` - Immutable chronological audit trail

---

## 🧪 Automated Testing

### Backend Unit Tests
Automated JUnit 5 tests validate the algorithmic correctness of the Risk Engine and Velocity Prediction Service:
```bash
cd backend
mvn test
```
**Test Results:**
- `RiskEngineTest`: Validates weighted multi-factor calculation, progress lag, proximity factors, and risk tier categorization.
- `PredictionServiceTest`: Validates velocity calculation, remaining days prediction, and delay estimations.
- **Pass Rate**: 100% (4 tests, 0 failures).

---

## 🔒 Security & Governance
- **Stateless Authentication**: Cryptographically signed HMAC-SHA256 JWT tokens.
- **Role-Based Access Control**: Strict method-level and endpoint authorization (`MANAGER`, `CLIENT`, `DEVELOPER`, `EXECUTIVE`, `ADMIN`).
- **Audit Logging**: Every state-altering action is recorded with actor ID, timestamp, and modification payload.
- **CORS & CSRF**: Configured for cross-origin security with credentials support.

---

## 📄 License
Enterprise MIT License - Developed for the Integrated Project Monitoring & Collaboration Platform.
