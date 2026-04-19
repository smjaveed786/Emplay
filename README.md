# 🚀 Promptly (Full Stack)

A professional, high-performance platform for managing and tracking AI prompts. Built with a robust **Django** backend, a premium **Angular** frontend, and real-time **Redis** analytics.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Angular 18+, Reactive Forms, Signals, RxJS, Outfit Typography |
| **Backend** | Python 3.11, Django 5.2, Standard JsonResponse Views |
| **Database** | PostgreSQL 15 (Relational Data & Tags) |
| **Cache** | Redis 7 (Atomic View Count Source-of-Truth) |
| **Task Queue** | Celery & Celery Beat (Redis -> DB Persistence) |
| **DevOps** | Docker, Docker Compose, Multi-stage Builds |

---

## ✨ Key Features

### 1. Real-Time Redis View Counter
- Every view on a prompt detail page triggers an atomic `INCR` operation in Redis.
- Redis acts as the **high-speed source of truth**, decoupling read-heavy analytics from the primary database.
- A **Celery Beat** task periodically syncs these counts back to PostgreSQL once an hour.

### 2. Secure User Authentication (Bonus A)
- **Session-based Security**: Only logged-in users can contribute new prompts.
- **Auth Guards**: Frontend routes are protected, redirecting unauthenticated users to a premium login portal.
- **Live Navbar**: Real-time user state management using Angular Signals.

### 3. Premium Tagging System (Bonus B)
- Categorize prompts with dynamic, color-coded tags.
- Support for multi-tag filtering and dynamic creation during prompt submission.

### 4. Create, Edit, & Delete (Full CRUD)
- Fully featured prompt management system allowing you to update typos and modify metadata seamlessly.
- **Ownership Verification**: Protected edit and delete routes guarantee that only the original author of the prompt can modify or destroy it.

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose installed.

### Installation & Launch

1. **Launch with one command**:
   ```powershell
   docker-compose up --build
   ```
2. **Setup Admin User** (To use the Login feature):
   ```powershell
   docker-compose exec backend python manage.py createsuperuser
   ```

### Accessing the System
- **Dashboard**: [http://localhost:4200/prompts](http://localhost:4200/prompts)
- **Login**: [http://localhost:4200/login](http://localhost:4200/login)

---

## 🗺️ Architectural Explanation

### The "Smart Settings" Engine
The application intelligently detects its environment. If it sees a `DATABASE_URL`, it connects to **PostgreSQL**. Otherwise, it fails over to **SQLite**, making local development and agent audits effortless without manual configuration changes.

### Security Assumptions
- **CORS**: Configured for development using `django-cors-headers`. In production, origins should be restricted to the frontend domain.
- **CSRF**: `@csrf_exempt` is utilized for the demo; for production, ensure `CSRFToken` headers are passed through the Angular `HttpClient` interceptors.

---

Built with ❤️ for AI enthusiasts and prompt engineers.