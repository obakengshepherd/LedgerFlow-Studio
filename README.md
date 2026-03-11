# LedgerFlow Studio

**Enterprise-Grade Financial Ledger & Audit Infrastructure Platform**

> _"This is not just a CRUD app, it's a financial truth engine."_

A production-grade, immutable financial ledger system built with cryptographic integrity at its core. Designed for South African fintechs, SMEs, and compliance teams requiring tamper-proof transaction records, complete audit trails, and regulatory readiness.

**🎯 Built to demonstrate:** Enterprise architecture · Financial domain expertise · Security-first development · Full-stack TypeScript mastery

---

## 🔥 What Makes This Different

### Not Your Average Portfolio Project

While others build todo apps and weather dashboards, **LedgerFlow Studio** tackles real-world financial infrastructure challenges:

- **Cryptographic Hash Chaining** - Every transaction is cryptographically linked, making tampering mathematically detectable
- **ACID-Compliant Operations** - Uses SERIALIZABLE isolation to prevent race conditions in concurrent financial operations
- **Double-Entry Accounting** - Implements the 500-year-old foundation of financial systems, enforced at the code level
- **Regulatory Awareness** - Built with SARB (South African Reserve Bank) and FICA compliance in mind
- **Immutable Audit Trail** - Append-only design means every action is permanently recorded

**This project answers:** _"Can you build systems that handle money safely?"_

---

## ⚡ Core Capabilities

### 1. **Immutable Ledger Architecture**

Every entry contains a SHA-256 hash of its data plus the previous entry's hash. Like blockchain, but optimized for relational databases. Any modification breaks the chain instantly.

```typescript
// Hash Chain Verification
{
  "entry_1": { hash: "a7f8d...", previousHash: null },
  "entry_2": { hash: "9e2c1...", previousHash: "a7f8d..." },
  "entry_3": { hash: "b4c3f...", previousHash: "9e2c1..." }
}
// Tamper one entry → entire chain becomes invalid
```

### 2. **Double-Entry Transaction Engine**

Every transaction creates two balanced entries atomically. If one fails, both rollback. Zero tolerance for unbalanced books.

```typescript
POST /ledger/transaction
{
  "debitAccount": "ACC-1001",   // Customer receives
  "creditAccount": "ACC-2001",  // Revenue account
  "amount": 15000.00,
  "currency": "ZAR"
}
// Creates 2 entries, both succeed or both fail (ACID)
```

### 3. **Enterprise Authentication & RBAC**

JWT-based auth with four role levels. BCrypt password hashing. Role-specific endpoint protection.

| Role           | Capabilities                             |
| -------------- | ---------------------------------------- |
| **ADMIN**      | Full system access, transaction reversal |
| **ACCOUNTANT** | Create transactions, view ledger         |
| **AUDITOR**    | Read-only access to audit trails         |
| **VIEWER**     | Dashboard and reports only               |

### 4. **Tamper Detection & Integrity Verification**

On-demand cryptographic verification of the entire ledger chain.

```typescript
GET /ledger/verify
{
  "valid": true,
  "totalEntries": 12487,
  "errors": []
}
// Verifies every hash in the chain
```

---

## 🏗️ Technical Architecture

### Stack Choices (and Why)

**Backend: NestJS + TypeORM + PostgreSQL**

- NestJS → Enterprise architecture patterns (modules, dependency injection)
- TypeORM → Type-safe database operations with migration support
- PostgreSQL → ACID compliance, SERIALIZABLE isolation, battle-tested reliability

**Frontend: React + TypeScript + Tailwind**

- React 18 → Modern, component-based UI
- TypeScript → Type safety from API to UI
- Tailwind CSS → Rapid, maintainable styling without CSS bloat

**Security: JWT + Passport + BCrypt**

- Stateless authentication (horizontal scaling ready)
- Industry-standard password hashing
- Role-based guards at controller level

**DevOps: Docker + GitHub Actions**

- Multi-stage builds for optimal image sizes
- Automated CI/CD pipeline
- Production-ready containerization

### System Design

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │─────▶│   NestJS     │─────▶│ PostgreSQL  │
│  Frontend   │ JWT  │   Backend    │ ORM  │  Database   │
│  (Port 3000)│      │  (Port 3001) │      │  (Port 5432)│
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ├── Swagger API Docs
                            ├── Hash Chain Verification
                            └── RBAC Guards
```

---

## 🚀 Quick Start

### Prerequisites

```bash
node --version    # v20+
docker --version  # v20+
psql --version    # v16+
```

### Installation (5 Minutes)

```bash
# 1. Clone repository
git clone <your-repo-url>
cd LedgerFlow-Studio

# 2. Start database
cd infra
docker-compose up -d postgres

# 3. Install backend dependencies
cd ../backend
npm install

# 4. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 5. Start backend (keep this terminal open)
npm run start:dev

# 6. Install frontend dependencies (new terminal)
cd ../frontend
npm install

# 7. Start frontend
npm start
```

### Access Points

- **Application**: http://localhost:3000
- **API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api/docs

### Demo Credentials

```
Email: admin@ledgerflow.com
Password: admin123
Role: ADMIN
```

---

## 📡 API Highlights

### Create Double-Entry Transaction

```http
POST /ledger/transaction
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "debitAccountId": "ACC-1001",
  "creditAccountId": "ACC-2001",
  "entityId": "ENTITY-001",
  "amount": 15000.00,
  "description": "Customer payment",
  "metadata": {
    "invoiceNumber": "INV-2026-001"
  }
}

Response: 201 Created
[
  { "id": "...", "type": "DEBIT", "hash": "a7f8d...", ... },
  { "id": "...", "type": "CREDIT", "hash": "9e2c1...", "previousHash": "a7f8d..." }
]
```

### Verify Ledger Integrity

```http
GET /ledger/verify
Authorization: Bearer {jwt_token}

Response: 200 OK
{
  "valid": true,
  "errors": []
}
```

### Reverse Transaction

```http
POST /ledger/transaction/{id}/reverse
Authorization: Bearer {jwt_token}

{
  "reason": "Customer refund - duplicate payment"
}

Response: 201 Created
// Creates offsetting entries, preserves audit trail
```

Full API documentation: http://localhost:3001/api/docs

---

## 🐳 Docker Deployment

### One-Command Deploy

```bash
docker-compose up --build -d

# All services now running:
# ✅ PostgreSQL on :5432
# ✅ Backend API on :3001
# ✅ Frontend on :3000
```

### Production Deployment

```bash
# Build production images
docker build -t ledgerflow-backend:latest ./backend
docker build -t ledgerflow-frontend:latest ./frontend

# Deploy to your cloud provider
# AWS ECS | Azure Container Instances | GCP Cloud Run | Kubernetes
```

---

## 🧪 Testing Guide

Comprehensive testing documentation available in `docs/testing-guide.html` - covers:

1. ✅ **Environment Setup** - Database, dependencies, configuration
2. ✅ **Authentication Flow** - Registration, login, JWT validation
3. ✅ **Ledger Operations** - Transactions, balances, reversals
4. ✅ **Integrity Verification** - Hash chain validation
5. ✅ **Security Testing** - Auth guards, RBAC, input validation
6. ✅ **Performance Tests** - Bulk operations, concurrent transactions
7. ✅ **Edge Cases** - Error handling, tamper detection

**Open `docs/testing-guide.html` in your browser for the full interactive guide.**

---

## 🔐 Security Features

- ✅ **JWT Authentication** - Stateless, scalable auth
- ✅ **BCrypt Password Hashing** - Industry standard (10 rounds)
- ✅ **Role-Based Access Control** - Endpoint-level protection
- ✅ **SQL Injection Prevention** - Parameterized queries via TypeORM
- ✅ **CORS Protection** - Configurable origin whitelist
- ✅ **Input Validation** - Class-validator on all DTOs
- ✅ **Cryptographic Integrity** - Tamper-proof hash chains
- ✅ **Audit Trail** - Complete action logging with user attribution

---

## 📊 Project Structure

```
LedgerFlow-Studio/
├── backend/                    # NestJS API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # JWT + Passport + RBAC
│   │   │   ├── ledger/        # Core financial engine
│   │   │   ├── audit/         # Audit trails (planned)
│   │   │   ├── reconciliation/# Account reconciliation (planned)
│   │   │   └── compliance/    # Regulatory reports (planned)
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── pages/             # Dashboard, Ledger, Transactions, Audit
│   │   ├── components/        # Reusable UI components
│   │   ├── contexts/          # Auth state management
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
│
├── infra/
│   └── docker-compose.yml     # Multi-container orchestration
│
├── .github/
│   └── workflows/
│       └── ci.yml             # Automated testing pipeline
│
└── docs/
    └── testing-guide.html     # Interactive testing documentation
```

---

## 💡 Why This Project Stands Out

### Technical Sophistication

Most portfolio projects demonstrate basic CRUD operations. This demonstrates:

- **Financial domain modeling** (double-entry accounting isn't trivial)
- **Data integrity mechanisms** (cryptographic hash chains)
- **Concurrency handling** (SERIALIZABLE transactions)
- **Enterprise patterns** (NestJS modules, dependency injection)
- **Security best practices** (JWT, RBAC, password hashing)

### Business Value Alignment

This isn't "another React app" - it solves real problems:

- Fintechs need immutable transaction records
- Auditors need tamper-proof audit trails
- Compliance teams need regulatory exports
- CFOs need accurate, real-time balance calculations

### Code Quality

- TypeScript everywhere (type safety from database to UI)
- Clean architecture (separation of concerns)
- SOLID principles (single responsibility, dependency injection)
- Comprehensive error handling
- Production-ready Docker setup
- Automated CI/CD pipeline

---

## 🎯 Perfect For

**Industries:**

- 🏦 Fintech startups
- 💼 Enterprise accounting systems
- 🏢 Corporate finance departments
- 📊 Audit & compliance firms
- 💳 Payment processors

**Roles:**

- Full-Stack Engineer (Financial Services)
- Backend Engineer (Fintech)
- Solutions Architect
- Senior Software Engineer
- Tech Lead

---

## 🚦 Current Status

### ✅ Completed

- [x] Immutable ledger with hash chaining
- [x] Double-entry transaction engine
- [x] JWT authentication & RBAC
- [x] Account balance calculations
- [x] Transaction reversal workflow
- [x] Ledger integrity verification
- [x] React frontend with Tailwind UI
- [x] Docker containerization
- [x] Swagger API documentation
- [x] CI/CD pipeline foundation
- [x] Comprehensive testing guide

### 🔄 In Progress

- [ ] Audit trail logging module
- [ ] Reconciliation workflows
- [ ] Compliance report exports

### 🎯 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Real-time WebSocket updates
- [ ] Multi-currency exchange rates
- [ ] Integration with banking APIs (Open Banking)
- [ ] Advanced reconciliation algorithms
- [ ] Mobile app (React Native)

---

## 📚 Documentation

- **[Testing Guide](docs/testing-guide.html)** - Step-by-step validation
- **[API Documentation](http://localhost:3001/api/docs)** - Swagger UI (when running)
- **[Architecture Decisions](#)** - Coming soon
- **[Deployment Guide](#)** - Coming soon

---

## 📞 Questions?

**For recruiters/hiring managers:**  
This project demonstrates production-level capabilities in financial software development. Happy to walk through the architecture, security decisions, or any technical aspect in detail.

**For developers:**  
Feel free to explore the code. The hash chaining implementation is in `backend/src/modules/ledger/ledger.service.ts`, and the RBAC system is in `backend/src/modules/auth/guards/`.

---

## 📄 License

MIT License - Free to use, modify, and showcase.

---

<div align="center">

**LedgerFlow Studio**  
_Where Financial Truth Lives_ 🔐💰

Built to showcase enterprise-grade full-stack development capabilities.

</div>
