${QUICK_START_GUIDE}

# 🚀 QUICK START - Run Everything in 60 Seconds!

## Prerequisites

**Make sure you have completed:**
- ✅ Supabase Project created at https://supabase.com
- ✅ `.env` file configured with Supabase credentials
- ✅ `DATABASE_URL` set in `.env`
- ✅ Node.js v18+ installed

## Copy-Paste These Commands

### Command Set 1: Install Dependencies & Setup Database

```bash
cd D:/saas
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
```

**This will:**
- Install all backend dependencies
- Setup Prisma with Supabase
- Sync database schema to Supabase
- Seed test data

### Command Set 2: Start Backend (Terminal 1)

```bash
cd D:/saas
npm run start:dev
```

**You should see:**
```
🚀 Application is running on: http://localhost:3000
```

### Command Set 3: Start Frontend (Terminal 2 or 3)

```bash
cd D:/saas/frontend
npm install
npm run dev
```

**You should see:**
```
▲ Next.js
- Local: http://localhost:3001
```

---

## ✅ Verify Everything Works

1. **Open Browser**: http://localhost:3001
2. **See**: Login page for "AI Study Planner"
3. **Use Test Credentials**:
   - **Student**: Enrollment `ENG001234` / Password `TestPassword123`
   - **Admin**: Email `admin@test.com` / Password `AdminPassword123`
5. **Login**: With same credentials
6. **See**: Dashboard with charts and statistics

---

## 🔗 Important URLs After Starting

| Service | URL |
|---------|-----|
| **Frontend App** | http://localhost:3001 |
| **Backend API** | http://localhost:3000 |
| **Database Admin** | http://localhost:5050 (admin@example.com / admin) |
| **Prisma Studio** | Run: `cd D:/saas && npx prisma studio` |

---

## 🆘 Troubleshooting

### Port 3000 or 3001 Already in Use?

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
cd D:/saas/frontend && npm run dev -- -p 3002
```

### Docker Not Running?

```bash
docker ps
# If error, start Docker Desktop manually
```

### Backend Won't Connect to Database?

```bash
# Check if database is running
docker ps

# If not, restart
docker-compose down
docker-compose up -d
```

### Frontend Blank Page?

```bash
# Check browser console (F12)
# Look for errors, usually CORS or API connection
# Verify backend is running on :3000
```

---

## 📁 Project Files

Everything is in: **D:\saas\**

- Backend source: `src/`
- Backend config: `package.json`, `docker-compose.yml`
- Frontend source: `frontend/src/`
- Frontend config: `frontend/package.json`
- Database schema: `prisma/schema.prisma`

---

## 🎯 Test Features

After login, you can:

1. **View Dashboard** - See statistics and charts
2. **Check Data** - Open http://localhost:5050 (pgAdmin)
3. **Inspect API** - DevTools Network tab (F12)
4. **View Database** - Run: `npx prisma studio`

---

## 📚 Complete Guides

- **Full Setup**: Read `D:/saas/RUN_GUIDE.md`
- **Backend Details**: Read `D:/saas/README.md`
- **Frontend Details**: Read `D:/saas/frontend/README.md`
- **Setup Summary**: Read `D:/saas/SETUP_COMPLETE.md`

---

## ⚡ One-Line Quick Test

```bash
cd D:/saas && npm run start:dev &
cd D:/saas/frontend && npm run dev
```

Then open: http://localhost:3001

---

## 💾 Database Reset (If Needed)

```bash
cd D:/saas
npx prisma migrate reset
# Answer 'y' to confirm
```

This resets all data. Use only for development.

---

## ✨ You're Ready!

**Everything is installed and ready to run.**

Start your 3 services (Database, Backend, Frontend) and you're done! 🎉

**Next Step**: Run the commands above and visit http://localhost:3001

---

**Questions?** Check the comprehensive guides in the saas folder.  
**Happy studying!** 🎓📚
