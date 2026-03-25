# AI Study Planner SaaS - Complete Running Guide

This guide explains how to run the **complete AI Study Planner SaaS** system (Backend + Frontend) using **Supabase Cloud PostgreSQL**.

## 📋 Project Structure

```
D:/saas/                           ← Main project folder
├── src/                           ← Backend NestJS source code
├── prisma/                        ← Database schema & migrations
├── package.json                   ← Backend dependencies
├── .env                           ← Supabase configuration
│
└── frontend/                       ← Frontend Next.js application
    ├── src/
    ├── package.json               ← Frontend dependencies
    └── ...
```

## 🔧 Prerequisites Check

Before running, make sure you have:

```bash
# Check Node.js version (need v18+)
node --version

# Check npm version
npm --version

# Verify git is available
git --version
```

**Note:** Docker is **NOT required** anymore. We use Supabase Cloud PostgreSQL.

## 🔑 Supabase Setup (One-Time)

### 1. Create Supabase Project

1. Go to https://supabase.com and sign up/login
2. Create a new project
3. Save your credentials:
   - `SUPABASE_URL` - Project URL
   - `SUPABASE_ANON_KEY` - Anon Public Key
   - `SUPABASE_SERVICE_ROLE_KEY` - Service Role Key

### 2. Configure `.env` File

```bash
cd D:/saas

# Copy example to create your .env
copy .env.example .env
```

Edit `.env` and set these values:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres"
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 🚀 Quick Start (3 Steps)

### Step 1: Initialize Database Schema

```bash
cd D:/saas

# Generate Prisma client
npx prisma generate

# Push schema to Supabase (creates tables)
npx prisma db push

# Seed test data
npx prisma db seed
```

### Step 2: Start Backend

```bash
cd D:/saas
npm install
npm run start:dev

# Output should show:
# 🚀 Application is running on: http://localhost:3000
```

### Step 3: Start Frontend

```bash
cd D:/saas/frontend
npm install
npm run dev

# Output should show:
# ▲ Next.js 14.0.0
# - Local: http://localhost:3001
```

Then visit:
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:3001

---

### Option B: Using npm Concurrently (All in One Window)

**Step 1:** Install concurrently

```bash
cd D:/saas
npm install -D concurrently
```

**Step 2:** Add startup scripts in package.json if not present

```bash
# Add these scripts to package.json:
# "dev:backend": "npm run start:dev",
# "dev:frontend": "cd frontend && npm run dev", 
# "dev:all": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\""
```

**Step 3:** Run both together

```bash
cd D:/saas
npm run dev:all
```

---

## 🧪 Testing the Setup

### 1. Check Backend is Running

```bash
curl http://localhost:3000
# Should return: {"message":"Welcome to AI Study Planner API"}
```

### 2. Open Frontend in Browser

```
http://localhost:3001
# Should show login page
```

### 3. Test Login

Use test credentials:
- **Student**: Enrollment `ENG001234` / Password `TestPassword123`
- **Admin**: Email `admin@test.com` / Password `AdminPassword123`

---

## 📋 Complete Workflow

### First Time Setup:

```bash
# 1. Clone/navigate to project
cd D:/saas

# 2. Configure .env with Supabase credentials
# (Edit .env file with your Supabase URL and keys)

# 3. Install dependencies
npm install

# 4. Setup database
npx prisma generate
npx prisma db push
npx prisma db seed

# 5. Install frontend dependencies  
cd frontend && npm install && cd ..

# 6. Start backend (Terminal 1)
npm run start:dev

# 7. Start frontend (Terminal 2)
cd frontend && npm run dev
```

### Subsequent Runs:

```bash
# Terminal 1 - Backend
cd D:/saas
npm run start:dev

# Terminal 2 - Frontend  
cd D:/saas/frontend
npm run dev
```

---

## 🔌 API Integration

The frontend connects to backend automatically:

- **Frontend running on**: http://localhost:3001
- **Backend running on**: http://localhost:3000
- **Database**: Supabase Cloud PostgreSQL

Configuration in `frontend/.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 📊 Available Endpoints

### Backend (Port 3000)

```
GET    http://localhost:3000/               # Health check
POST   http://localhost:3000/auth/login     # Login
POST   http://localhost:3000/auth/register  # Register
GET    http://localhost:3000/subjects       # Get subjects
POST   http://localhost:3000/subjects       # Create subject
GET    http://localhost:3000/exams          # Get exams
POST   http://localhost:3000/exams          # Create exam
```

### Frontend (Port 3001)

```
http://localhost:3001/                      # Home (redirects to login)
http://localhost:3001/auth/login            # Login page
http://localhost:3001/auth/register         # Register page
http://localhost:3001/dashboard             # Dashboard
```

---

## 🛠️ Useful Commands

### Backend Commands

```bash
cd D:/saas

# Development
npm run start:dev              # Hot reload mode
npm run start:debug            # With debugger
npm run build                  # Build for production
npm run start:prod             # Run production build

# Database (Supabase)
npx prisma studio            # GUI database viewer
npx prisma db push           # Sync schema to Supabase
npx prisma db pull           # Pull schema from Supabase
npx prisma generate          # Generate types
npx prisma db seed           # Seed test data

# Code Quality
npm run lint                  # ESLint
npm run format                # Prettier
npm run test                  # Run tests
```

### Frontend Commands

```bash
cd D:/saas/frontend

# Development
npm run dev                   # Development server
npm run build                 # Build for production
npm run start                 # Production server
npm run lint                  # ESLint
```

---

## 🐛 Troubleshooting

### Backend won't start?

```bash
# Check if port 3000 is available
netstat -ano | findstr :3000

# Check Supabase connection
lsof -i :3000

# Kill process if needed
taskkill /PID <PID> /F
```

### Frontend won't start?

```bash
# Check if port 3001 is available
netstat -ano | findstr :3001

# Or try different port
cd frontend && npm run dev -- -p 3002
```

### Database won't start?

```bash
# Check Docker status
docker ps
docker logs postgres

# Restart Docker
docker-compose down
docker-compose up -d

# Clean volumes and restart
docker-compose down -v
docker-compose up -d
```

### API Connection Issues?

Check network tab in browser (F12 → Network) for failed requests.

Common issues:
- ❌ CORS error → Backend CORS config
- ❌ 404 error → Wrong API URL in .env.local
- ❌ 401 error → Token expired or invalid

**Solution:**
```bash
# Verify API URL in frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000

# Restart both servers
```

---

## 📱 LPU Student Features

### Supported Exam Types:
- **CA-1, CA-2, CA-3** - Continuous Assessment
- **Midterm** - Mid-semester exam
- **Endterm** - Final semester exam
- **Lab Practicals** - Practical exams
- **Projects** - Project assignments
- **Assignments** - Homework

### Student Workflow:

1. **Register** with LPU email (@lpu.in)
2. **Add Subjects** for current semester
3. **Add Exams** with dates and weightages
4. **Mark Weak Topics**
5. **Generate Study Plan** (AI does this automatically)
6. **Follow Daily Schedule** and track progress
7. **Monitor Progress** with analytics

---

## 🚀 Production Deployment

### Backend Deployment:

```bash
# Build
npm run build

# Set environment variables
export NODE_ENV=production
export DATABASE_URL=your_db_url
export JWT_SECRET=your_secret_key

# Run
npm start
```

### Frontend Deployment:

```bash
# Build
npm run build

# Set environment
export NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Run
npm start
```

### Using Docker:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## ✅ Verification Checklist

- [ ] Node.js 18+ installed
- [ ] Docker installed (for PostgreSQL)
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] PostgreSQL running (docker-compose up -d)
- [ ] Database initialized (prisma migrate dev --name init)
- [ ] Backend starts successfully (npm run start:dev)
- [ ] Frontend starts successfully (npm run dev)
- [ ] Can access http://localhost:3001 in browser
- [ ] Login page loads
- [ ] Network requests work (API connected)

---

## 📞 Support

If you have issues:

1. **Check logs**: Look at terminal output
2. **Check ports**: Ensure 3000 and 3001 are free
3. **Restart services**: Stop and start again
4. **Clear cache**: Delete node_modules and reinstall
5. **Check database**: `npx prisma studio`

---

## 🎓 Quick Start Command

**One-line setup** (after first install):

```bash
# Terminal 1
cd D:/saas && npm run start:dev

# Terminal 2
cd D:/saas/frontend && npm run dev
```

Then visit: **http://localhost:3001**

---

**Happy Studying! 🎓**

Last Updated: February 25, 2026
