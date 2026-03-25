# SaaS Backend - Installation and Setup Guide

This document provides step-by-step instructions to install and run the AI Study Planner SaaS backend.

## Prerequisites

Before starting, ensure you have installed:

1. **Node.js & npm**
   - Download from [nodejs.org](https://nodejs.org)
   - Verify installation: `node --version` and `npm --version`
   - Requirements: Node.js 18+ and npm 9+

2. **PostgreSQL**
   - Download from [postgresql.org](https://www.postgresql.org)
   - Create a database for the project
   - Note your connection details

3. **Git** (optional, for version control)
   - Download from [git-scm.com](https://git-scm.com)

## Quick Start Guide

### Step 1: Install Dependencies

```bash
cd d:\saas
npm install
```

This will install all the required packages listed in package.json.

### Step 2: Configure Environment Variables

```bash
# Copy the example env file
copy .env.example .env

# Edit .env with your configuration
# Use a text editor to update the following:
```

Update these values in `.env`:
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ai_study_planner
JWT_SECRET=your_super_secret_key_min_32_characters
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
FRONTEND_URL=http://localhost:3000
```

### Step 3: Database Setup

Option A: Using Docker (Recommended for quick setup)
```bash
# Start PostgreSQL and pgAdmin using Docker Compose
docker-compose up -d

# pgAdmin will be available at http://localhost:5050
# Default credentials: admin@example.com / admin
```

Option B: Using Local PostgreSQL
```bash
# Create database
createdb ai_study_planner -U postgres

# Create .env with correct connection string
```

### Step 4: Initialize Database Schema

```bash
# Run Prisma migrations
npx prisma migrate dev --name init

# This will:
# - Create all database tables
# - Generate Prisma Client
# - Apply migrations
```

### Step 5: Start Development Server

```bash
# Start the application in development mode with auto-reload
npm run start:dev

# Server will start on http://localhost:3000
# You should see: "🚀 Application is running on: http://localhost:3000"
```

## Available Commands

```bash
# Development
npm run start:dev          # Run with hot reload
npm run start:debug        # Run with debugger

# Production
npm run build              # Build for production
npm run start:prod         # Run production build

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format with Prettier
npm run test               # Run unit tests
npm run test:cov           # Run tests with coverage

# Database
npm run prisma:migrate     # Create new migration
npm run prisma:generate   # Generate Prisma Client
npm run prisma:studio     # Open Prisma Studio GUI (http://localhost:5555)
npm run prisma:seed       # Run seed script
```

## Testing the API

Once the server is running, test the endpoints:

### 1. Health Check
```bash
curl http://localhost:3000
```

### 2. Register a New User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123"
  }'
```

### 4. Get User Profile (requires token)
```bash
curl http://localhost:3000/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Troubleshooting

### Issue: Database connection fails
**Solution:**
- Check DATABASE_URL format in .env
- Verify PostgreSQL is running
- Check username and password are correct

### Issue: Port 3000 already in use
**Solution:**
```bash
# Change APP_PORT in .env
# Or kill the process using port 3000:
lsof -i :3000  # On Mac/Linux
netstat -ano | findstr :3000  # On Windows
```

### Issue: Email verification not working
**Solution:**
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- For Gmail: Use App-specific password, not account password
- Enable "Less secure app access" if using Gmail

## Project Structure Overview

```
saas/
├── src/
│   ├── modules/        # Feature modules
│   ├── common/         # Shared utilities
│   ├── libs/           # External service integrations
│   ├── main.ts         # Entry point
│   └── app.module.ts   # Main module
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── migrations/     # Database migrations
├── package.json        # Dependencies
└── README.md           # Documentation
```

## Next Steps

1. **Create a Subject**: `POST /subjects`
2. **Add Exams**: `POST /exams`
3. **Add Topics**: `POST /topics`
4. **Generate Study Plan**: `POST /study-plans/generate`
5. **Track Progress**: `POST /progress`

## Production Deployment

### Using Docker

```bash
# Build image
docker build -t ai-study-planner-backend .

# Run container
docker run -p 3000:3000 \
  --env-file .env \
  ai-study-planner-backend
```

### Using PM2 (Node Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Run application
npm run build
pm2 start dist/main.js --name "saas-backend"

# Monitor
pm2 monit
```

## Security Reminders

⚠️ **Before going to production:**

1. Change all placeholder values in .env
2. Use strong JWT_SECRET (minimum 32 characters)
3. Enable HTTPS in production
4. Configure proper CORS origin
5. Set NODE_ENV=production
6. Use environment-specific databases
7. Implement rate limiting appropriately
8. Set up error monitoring (e.g., Sentry)
9. Enable database backups
10. Use managed database services

## Getting Help

- Check [NestJS Documentation](https://docs.nestjs.com)
- See [Prisma Documentation](https://www.prisma.io/docs)
- Review API endpoints in README.md
- Check application logs in `/logs` directory

---

**Happy coding! 🚀**
