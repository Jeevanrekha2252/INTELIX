# Intelix Pro — National Project Intelligence & Monitoring Platform
> SIH 2026 Problem Statement: **SIH26103** — Integrated Project Monitoring and Early Warning Decision Support System

---

## ⚡ Fastest Way to Run (Frontend Quick Start)

Your friend can run the complete interactive platform in **3 quick commands**:

```bash
# 1. Clone the repository
git clone <YOUR-GITHUB-REPO-URL>
cd Intelix-SIH-Project-Monitoring-Full-Stack

# 2. Go to frontend and install dependencies
cd frontend
npm install

# 3. Start development server
npm run dev
```

Open your browser at **`http://localhost:5173/`**.

The frontend includes a built-in state engine and client-side ML calculation layer, so all features (Kanban, Delay Cascade Simulator, Workload Rebalancer, What-If Risk Sandbox, EVM Analytics, and Copilot) are 100% operational immediately.

---

## 🐳 Full Stack Deployment (Docker Compose)

To run the full stack with PostgreSQL, Spring Boot REST APIs, and Python FastAPI ML service:

```bash
docker compose up --build
```

- **Frontend App**: `http://localhost:5173`
- **Spring Boot Backend**: `http://localhost:8080`
- **FastAPI ML Service**: `http://localhost:8000`
- **PostgreSQL Database**: `localhost:5432`

---

## ⌨️ Shortcuts
- `Ctrl + K`: Universal Search Command Palette
- `Ctrl + /`: Intelix Project Assistant
- `Palette Icon`: Switch between 5 curated color themes
