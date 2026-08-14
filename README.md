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

```text
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