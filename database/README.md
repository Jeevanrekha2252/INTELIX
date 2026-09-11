# INTELIX Temporary Synthetic PostgreSQL Database (`project_monitoring_dev`)

This directory contains the database migration scripts and configuration for the temporary synthetic PostgreSQL database designed specifically for the **Web-Based Integrated Project Monitoring & Collaboration Platform (CIP-Monitor / INTELIX)**.

---

## 📋 Database Overview

- **Database Name**: `project_monitoring_dev`
- **Target Engine**: PostgreSQL 16
- **Primary Key Format**: UUID / `VARCHAR(36)` (aligned with Spring Boot JPA entities)
- **Status**: Temporary development & testing database

---

## 🗂️ Migration Files

| Migration File | Description |
| :--- | :--- |
| `migrations/V1__initial_schema.sql` | Creates all 20 relational tables, columns, check constraints, and UUID primary keys. |
| `migrations/V2__constraints_and_indexes.sql` | Establishes foreign-key constraints (with cascade/set-null policies) and performance B-Tree indexes. |
| `migrations/V3__seed_data.sql` | Populates the realistic **Smart Campus Management System (SCMS)** scenario with critical path delay chain, overloaded developer, blocked tasks, change requests, deliverable approvals, and historical EVM analytics. |

---

## 🏗️ Entity Relationship Summary (20 Tables)

```
[ users ]
   │
   ├── (client_id) ──────────────► [ projects ]
   ├── (manager_id) ─────────────► [ projects ]
   │                                   │
   │  ┌────────────────────────────────┼──────────────────────────────┐
   │  ▼                                ▼                              ▼
[ project_members ]               [ milestones ]                   [ teams ]
   │                                   │                              │
   │                                   ▼                              ▼
   │                                [ tasks ] ◄───────────────── [ team_members ]
   │                                   │
   │       ┌───────────────────────────┼──────────────────────────────┐
   │       ▼                           ▼                              ▼
   │ [ task_dependencies ]       [ git_commits ]             [ deliverable_approvals ]
   │
   ├── [ change_requests ] ──────► [ projects ]
   ├── [ meetings ] ─────────────► [ projects ]
   │     ├── [ meeting_participants ]
   │     └── [ meeting_action_items ]
   ├── [ comments ] ─────────────► [ tasks / projects ]
   ├── [ documents ] ────────────► [ projects ]
   ├── [ notifications ]
   ├── [ risk_assessments ] ─────► [ projects / tasks ]
   ├── [ project_metrics ] ──────► [ projects ]
   └── [ activity_logs ] ────────► [ projects ]
```

---

## 🚀 How to Run the Database

### Option 1: Using Docker Compose (Recommended)

From the project root directory:
```bash
docker compose up sih-postgres -d
```
The PostgreSQL container automatically runs all scripts in `database/migrations/` in order on initial startup.

### Option 2: Using Local PostgreSQL (`psql` CLI)

If you have PostgreSQL installed locally on port 5432:

```bash
# 1. Create the database
psql -U postgres -h localhost -c "CREATE DATABASE project_monitoring_dev;"

# 2. Execute migrations in sequence
psql -U postgres -h localhost -d project_monitoring_dev -f database/migrations/V1__initial_schema.sql
psql -U postgres -h localhost -d project_monitoring_dev -f database/migrations/V2__constraints_and_indexes.sql
psql -U postgres -h localhost -d project_monitoring_dev -f database/migrations/V3__seed_data.sql
```

---

## 🔑 Demo User Accounts (Pre-Seeded)

All demo accounts use password: `password123`

| Email | Persona / Role | Description |
| :--- | :--- | :--- |
| `manager@demo.com` | `PROJECT_MANAGER` | Lead Project Manager (Tactical Cockpit & AI Copilot) |
| `client@demo.com` | `CLIENT` | University Client Sponsor (Deliverable Sign-Off & Change Requests) |
| `developer@demo.com` | `EMPLOYEE` | Alex Chen (Senior Backend Engineer — Overloaded Scenario) |
| `developer2@demo.com` | `EMPLOYEE` | Elena Rostova (Frontend Architect) |
| `qa@demo.com` | `EMPLOYEE` | Marcus Brody (QA & Security Lead) |
| `devops@demo.com` | `EMPLOYEE` | Priya Sharma (DevOps & Cloud Engineer) |
| `executive@demo.com` | `EXECUTIVE` | Chancellor Thorne (Portfolio Strategy & Risk Distribution) |
| `admin@demo.com` | `ADMIN` | System Administrator (RBAC & User Governance) |

---

## ⚙️ Environment Variables Configuration

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `project_monitoring_dev` | Target database name |
| `DB_USERNAME` | `postgres` | Database username |
| `DB_PASSWORD` | `postgres` | Database password |
