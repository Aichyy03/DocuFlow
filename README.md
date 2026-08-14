@"
# DocuFlow — Distributed Asynchronous Data Pipeline & Analytics Engine

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Celery](https://img.shields.io/badge/Celery-37814A?style=for-the-badge&logo=celery&logoColor=white)](https://docs.celeryq.dev/)

**DocuFlow** is a cloud-native, high-throughput asynchronous data ingestion and text extraction pipeline. It is engineered to process large payloads, extract structural metrics, and execute analytical tasks in the background without blocking I/O operations or degrading gateway performance.

---

## 🏗 Architecture Overview

The system decouples synchronous client requests from computationally expensive data parsing tasks via an event-driven task queue.

\`\`\`text
┌─────────────────────────┐
│ React 18 + Vite Web App │
└───────────┬─────────────┘
            │  (Multipart Upload / Polling)
            ▼
┌─────────────────────────┐
│  FastAPI Gateway Layer  │
└───────────┬─────────────┘
            │  (Task Dispatch)
            ▼
┌─────────────────────────┐
│   Redis Message Broker  │
└───────────┬─────────────┘
            │  (Worker Consumption)
            ▼
┌─────────────────────────┐
│ Celery Worker Pipeline  │ ──► [ Metric Evaluation & Extraction ]
└─────────────────────────┘
\`\`\`

---

## ✨ Core Features

* **Asynchronous Task Offloading:** Heavy file decoding, text parsing, and metric calculation are queued and executed via Celery background workers.
* **Non-Blocking Gateway:** Built on top of FastAPI and Uvicorn for ultra-low latency request handling.
* **Real-Time Polling & Status Tracking:** Live tracking of task states (\`PENDING\`, \`PROGRESS\`, \`COMPLETED\`, \`FAILURE\`).
* **Containerized Microservices:** Ready-to-deploy multi-container environment orchestrated with Docker Compose.
* **Reactive Monitoring Dashboard:** Clean, responsive UI with metrics breakdown and real-time execution logs.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Axios, Lucide Icons |
| **Backend API** | FastAPI, Python 3.11, Uvicorn, Pydantic |
| **Task Queue & Broker** | Celery, Redis |
| **DevOps & Infrastructure** | Docker, Docker Compose |

---

## 🚀 Quick Start Guide

### Prerequisites
* Docker Desktop (Running)
* Node.js (v18+)

---

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/Aichyy03/DocuFlow.git
cd DocuFlow
\`\`\`

---

### 2. Launch the Backend Pipeline (Docker)
\`\`\`bash
cd backend
docker compose up --build
\`\`\`
* **Interactive API Documentation (Swagger UI):** \`http://localhost:8000/docs\`
* **Health Check Endpoint:** \`http://localhost:8000/\`

---

### 3. Launch the Frontend Dashboard
\`\`\`bash
cd ../frontend
npm install
npm run dev
\`\`\`
* **Web UI Dashboard:** \`http://localhost:5173\`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| \`GET\` | \`/\` | Service health check |
| \`POST\` | \`/api/v1/ingest\` | Upload file & dispatch async task to queue |
| \`GET\` | \`/api/v1/tasks/{task_id}\` | Fetch current execution state and extracted metrics |

---

## 📄 License
This project is licensed under the MIT License.
"@ | [System.IO.File]::WriteAllText("$PWD\README.md", $_, [System.Text.Encoding]::UTF8)