# LedgerFlow Studio - Complete Repository

**Enterprise-Grade Financial Ledger & Audit Infrastructure Platform**

A production-ready, immutable financial ledger system designed for South African fintechs, SMEs, and compliance teams. This is not a CRUD app — it's a **financial truth engine** with cryptographic integrity.

## 🎯 Core Features

### ✨ Immutable Ledger with Cryptographic Integrity
- **Hash-Chained Entries**: Every ledger entry contains a SHA-256 hash of its data plus the previous entry's hash
- **Tamper Detection**: Any modification breaks the chain and is immediately detectable
- **Append-Only Design**: Entries can never be deleted or modified, only reversed
- **Ownership**: Created by UUID + timestamp ensures complete audit trail

### 💰 Double-Entry Accounting
- **ACID Compliance**: All transactions use SERIALIZABLE isolation level
- **Always Balanced**: Ledger always balances by design (every debit has matching credit)
- **Multi-Currency Support**: Track transactions in any currency (default: ZAR)
- **Atomic Operations**: Both entries commit together or both rollback

### 🔐 Enterprise Security
- **JWT Authentication**: Stateless token-based auth with 24h expiration
- **Role-Based Access Control (RBAC)**:
  - **ADMIN**: Full system access
  - **ACCOUNTANT**: Create transactions, view ledger
  - **AUDITOR**: View-only audit trails, reconciliation
  - **VIEWER**: Read-only access
- **Password Security**: BCrypt hashing with 10 rounds
- **Attack Prevention**: SQL injection, XSS, CSRF protections via NestJS

### 📊 Audit & Compliance
- **Complete Audit Trail**: Every action logged with user attribution
- **Regulatory Ready**: SARB (South African Reserve Bank) & FICA compliance
- **Export Capabilities**: Generate compliance reports
- **Reconciliation Tools**: Account reconciliation workflows
- **Balance Verification**: Real-time account balance calculations

### 🎛 Advanced Operations
- **Transaction Reversal**: Creates offsetting entries preserving audit trail
- **Integrity Verification**: On-demand cryptographic chain validation
- **Point-in-Time Balance**: Historical balance calculations
- **Filtering & Search**: Advanced query capabilities
- **Multi-Entity Support**: Track transactions across multiple entities

## 🏗 Architecture

### Technology Stack

**Backend**
- **NestJS 10** - Enterprise-grade Node.js framework
- **TypeORM 0.3** - Type-safe database ORM
- **PostgreSQL 16** - Enterprise RDBMS
- **JWT** - Stateless authentication
- **Passport** - Authentication middleware
- **Swagger** - API documentation

**Frontend**
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Query** - Data fetching & caching
- **React Router v6** - Client-side routing

**DevOps**
- **Docker & Docker Compose** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **PostgreSQL** - Data persistence
- **Nginx** - Reverse proxy & static serving

### Directory Structure

```
LedgerFlow-Studio/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Authentication & authorization
│   │   │   ├── ledger/        # Core ledger operations
│   │   │   ├── audit/         # Audit logging
│   │   │   ├── reconciliation/# Account reconciliation
│   │   │   ├── compliance/    # Compliance reporting
│   │   │   └── user/          # User management
│   │   ├── common/            # Shared utilities
│   │   ├── app.module.ts      # Root module
│   │   └── main.ts            # Bootstrap
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── contexts/          # Auth context
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── infra/
│   └── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci.yml             # CI/CD pipeline
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16 (or Docker)
- npm/yarn

### 1. Clone & Install

```bash
git clone <your-repo>
cd LedgerFlow-Studio

# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### 2. Database Setup

Option A - Using Docker:
```bash
docker-compose up -d postgres
```

Option B - Using local PostgreSQL:
```bash
createdb ledgerflow
```

### 3. Environment Configuration

Create `backend/.env`:
```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ledgerflow
JWT_SECRET=your-super-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=debug
```

### 4. Seed Database

```bash
cd backend
npm run seed
```

### 5. Start Development Servers

Backend:
```bash
cd backend
npm run start:dev
```

Frontend (new terminal):
```bash
cd frontend
npm start
```

### 6. Access Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs

## 🔑 Default Users

| Email | Password | Role | Access |
|-------|----------|------|--------|
| admin@ledgerflow.com | admin123 | ADMIN | Full system access |
| accountant@ledgerflow.com | pass123 | ACCOUNTANT | Create transactions, view ledger |
| auditor@ledgerflow.com | pass123 | AUDITOR | View audit trails, reconciliation |
| viewer@ledgerflow.com | pass123 | VIEWER | Read-only access |

## 📡 API Endpoints

### Authentication
```
POST   /api/v1/auth/login          - Login user
POST   /api/v1/auth/register       - Register new user
GET    /api/v1/auth/me             - Get current user
GET    /api/v1/auth/validate       - Validate token
```

### Ledger Operations
```
POST   /api/v1/ledger/transaction                      - Create double-entry transaction
POST   /api/v1/ledger/transaction/:id/reverse          - Reverse transaction
GET    /api/v1/ledger/entries                          - Get ledger entries
GET    /api/v1/ledger/transaction/:id/entries          - Get transaction entries
GET    /api/v1/ledger/account/:id/balance              - Get account balance
GET    /api/v1/ledger/verify                           - Verify ledger integrity
```

## 🐳 Docker Deployment

### Single Command Deployment

```bash
# Start all services (database, backend, frontend)
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f backend frontend postgres

# Stop all services
docker-compose down

# Destroy everything
docker-compose down -v
```

### Environment Variables (Production)

Create `.env.production`:
```env
NODE_ENV=production
JWT_SECRET=your-production-super-secret-key
DB_HOST=your-db-host
DB_PASSWORD=your-secure-password
LOG_LEVEL=info
```

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov
```

### Frontend Build
```bash
cd frontend

# Production build
npm run build

# Test build
npm test
```

## 🔐 Security Features

- ✅ **HTTPS Ready** - Configure SSL/TLS in nginx
- ✅ **CORS Protection** - Configurable origin whitelist
- ✅ **CSRF Protection** - Token validation
- ✅ **Rate Limiting** - Protect against abuse
- ✅ **SQL Injection Prevention** - Parameterized queries via TypeORM
- ✅ **XSS Protection** - Input validation & escaping
- ✅ **Password Security** - BCrypt with config rounds
- ✅ **Audit Trail** - Complete action logging
- ✅ **Access Control** - Role-based restrictions
- ✅ **Data Encryption** - Hash chaining ensures data integrity

## 📈 Scalability Features

- **Connection Pooling** - PostgreSQL connection pool management
- **Query Optimization** - Indexed queries with EXPLAIN ANALYZE
- **Caching** - React Query for client-side caching
- **Pagination** - Efficient data retrieval
- **Horizontal Scaling** - Stateless backend design
- **Load Balancing** Ready - Nginx reverse proxy
- **Database Replication** Ready - PostgreSQL native support

## 🎓 Why This Destroys Competition

### Technical Excellence
- ✅ Enterprise-grade architecture (NestJS + TypeORM + PostgreSQL)
- ✅ Cryptographic integrity at the core
- ✅ ACID-compliant financial operations
- ✅ Full-stack type safety (TypeScript everywhere)
- ✅ Professional error handling & logging
- ✅ Comprehensive API documentation (Swagger)
- ✅ Production-ready Docker setup
- ✅ Automated CI/CD pipeline

### Domain Expertise
- ✅ Financial accounting knowledge (double-entry bookkeeping)
- ✅ Regulatory compliance awareness (SARB, FICA)
- ✅ Audit trail & traceability
- ✅ Data integrity & immutability
- ✅ South African context (ZAR currency, RSA compliance)

### Code Quality
- ✅ Clean architecture principles
- ✅ SOLID design patterns
- ✅ DRY (Don't Repeat Yourself)
- ✅ Meaningful variable names
- ✅ Comprehensive JSDoc comments
- ✅ Error handling best practices
- ✅ Security hardening throughout

### Portfolio Impact
This project demonstrates:
- Deep understanding of fintech requirements
- Enterprise software architecture
- Data integrity & security expertise
- Full-stack development proficiency
- DevOps & containerization knowledge
- Regulatory compliance awareness
- Professional code quality
- Business acumen (financial domain)

## 🚀 Deployment Options

### AWS (ECS + RDS)
- Backend → ECS Fargate
- Frontend → CloudFront + S3
- Database → RDS PostgreSQL
- Load Balancer → ALB

### GCP (Cloud Run + Cloud SQL)
- Backend → Cloud Run
- Frontend → Cloud Storage + Cloud CDN
- Database → Cloud SQL PostgreSQL

### Azure (Container Instances + Database)
- Backend → Container Instances
- Frontend → Static Web App
- Database → Azure Database for PostgreSQL

### Kubernetes
```bash
# Build images
docker build -t ledgerflow-backend ./backend
docker build -t ledgerflow-frontend ./frontend

# Deploy using k8s manifests
kubectl apply -f k8s/
```

## 📚 Additional Documentation

- **Architecture Decision Records**: See `docs/adr/`
- **API Documentation**: http://localhost:3001/api/docs (Swagger UI)
- **Database Schema**: See `docs/schema/`
- **Deployment Guide**: See `docs/deployment/`
- **Security Policy**: See `SECURITY.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] Transaction notifications (email/SMS)
- [ ] Advanced analytics & reporting
- [ ] Multi-currency exchange rates
- [ ] Blockchain integration (optional)
- [ ] Mobile app (React Native)
- [ ] Advanced reconciliation AI
- [ ] Real-time WebSocket updates
- [ ] Integration with banking APIs

## 📞 Support

For issues or questions:
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@ledgerflow.studio

---

**LedgerFlow Studio** - *Where Financial Truth Lives* 🔐💰

Built with ❤️ for fintechs, SMEs, and compliance teams.
