# Supabase Database Setup Guide

This guide explains how to set up the required Supabase tables for the AI Study Planner with enrollment-based authentication.

## Prerequisites

1. A Supabase account (https://supabase.com)
2. A new Supabase project created
3. Supabase credentials configured in `.env` file:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Required Tables

### 1. Students Table

This table stores student information and credentials for authentication.

**SQL:**
```sql
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_number VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- bcrypt hashed password
  name VARCHAR(255) NOT NULL,
  course VARCHAR(100) NOT NULL, -- BTech, BBA, NGO, etc.
  department VARCHAR(100),
  semester INTEGER NOT NULL, -- 1-8
  email VARCHAR(255),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX idx_students_enrollment_number ON students(enrollment_number);
CREATE INDEX idx_students_course_semester ON students(course, semester);
```

### 2. Subjects Table

This table stores the subjects offered for each course and semester.

**SQL:**
```sql
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course VARCHAR(100) NOT NULL, -- BTech, BBA, etc.
  semester INTEGER NOT NULL, -- 1-8
  name VARCHAR(255) NOT NULL, -- Subject name
  code VARCHAR(50), -- Subject code
  credits INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint per course and semester
CREATE UNIQUE INDEX idx_subjects_course_semester_code ON subjects(course, semester, code);
CREATE INDEX idx_subjects_course_semester ON subjects(course, semester);
```

### 3. Timetable Table

This table stores the timetable/schedule for each course and semester.

**SQL:**
```sql
CREATE TABLE timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course VARCHAR(100) NOT NULL,
  semester INTEGER NOT NULL,
  subject_id UUID,
  day_of_week INTEGER NOT NULL, -- 0=Monday, 6=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  classroom VARCHAR(100),
  instructor VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL
);

CREATE INDEX idx_timetable_course_semester ON timetable(course, semester);
```

## Setup Steps

### Step 1: Access Supabase Dashboard

1. Go to https://app.supabase.com
2. Select your project
3. Navigate to the "SQL Editor" section

### Step 2: Create Tables

1. Copy the SQL code for each table above
2. Paste into the SQL Editor
3. Click "Run" to execute each query
4. Verify tables are created in the "Table Editor"

### Step 3: Insert Sample Data

**Sample Student:**
```sql
INSERT INTO students (enrollment_number, password, name, course, department, semester)
VALUES (
  'ENG001234',
  '$2b$10$YOUR_BCRYPT_HASHED_PASSWORD_HERE', -- Use bcrypt to hash the password
  'John Doe',
  'BTech',
  'Engineering',
  1
);
```

To generate a bcrypt hash, you can use Node.js:
```bash
npm install bcrypt
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('TestPassword123', 10).then(h => console.log(h));"
```

**Sample Subjects:**
```sql
INSERT INTO subjects (course, semester, name, code, credits)
VALUES 
  ('BTech', 1, 'Programming Fundamentals', 'CS101', 3),
  ('BTech', 1, 'Data Structures', 'CS102', 3),
  ('BTech', 1, 'Database Systems', 'CS103', 4),
  ('BTech', 2, 'Web Development', 'CS201', 3),
  ('BTech', 2, 'Advanced Algorithms', 'CS202', 3);
```

### Step 4: Configure Environment Variables

Make sure your `.env` file has:
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Get these values from:
- Supabase Dashboard → Settings → API
- Copy the Project URL and API Keys

### Step 5: Enable Row Level Security (Optional but Recommended)

For production, enable RLS on tables:

```sql
-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;

-- Create policies if needed
-- (This depends on your security requirements)
```

## Testing the Setup

After setting up the tables, test the login:

1. Start the backend: `npm run start:dev`
2. Go to the login page
3. Use the test credentials:
   - **Enrollment Number:** ENG001234
   - **Password:** TestPassword123

## Troubleshooting

### Connection Issues
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct
- Check that your IP is not blocked by Supabase firewall

### Authentication Fails
- Ensure password in database is bcrypt-hashed
- Verify enrollment_number matches exactly (case-sensitive by default)

### Tables Not Found
- Verify tables were created successfully in Supabase Table Editor
- Check that you're using the correct schema (should be "public")

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase SQL Editor Guide](https://supabase.com/docs/guides/database/tables)
- [Bcrypt Password Hashing](https://www.npmjs.com/package/bcrypt)
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# JWT (Keep secure in production)
JWT_SECRET=your-secret-key-min-32-chars

# Frontend URLs
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Where to find Supabase keys?**
1. Go to https://app.supabase.com
2. Select your project
3. Click Settings (⚙️) in left sidebar
4. Go to API tab
5. Copy:
   - Project URL → `SUPABASE_URL`
   - Anon (public) Key → `SUPABASE_ANON_KEY`
   - Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`

---

## 📊 Database Schema Created

### Models:
- **User** - Stores user accounts, emails, passwords
- **Subject** - Academic subjects (Math, Physics, etc.)
- **Exam** - Exams within subjects (Midterm, Endterm, etc.)
- **Topic** - Topics within exams (Algebra, Geometry, etc.)
- **StudyPlan** - Overall study plan
- **StudyPlanItem** - Daily/weekly study schedule items
- **ProgressRecord** - User's study progress tracking

---

## 🧪 Test Your Connection

### Option 1: Run the application
```bash
npm run start:dev
```

The server will start on port 3000 and connect to Supabase automatically.

### Option 2: View data in Supabase Dashboard
1. Go to https://app.supabase.com
2. Select your project
3. Click "SQL Editor" in left sidebar
4. Run queries to verify data:

```sql
-- Check users
SELECT id, email, "firstName", "lastName" FROM "User";

-- Check subjects
SELECT id, name, "userId" FROM "Subject";

-- Check exams
SELECT id, name, type, "examinationDate" FROM "Exam";

-- Check topics
SELECT id, name, difficulty, "estimatedHours" FROM "Topic";

-- Check study plans
SELECT id, "startDate", "endDate", "isActive" FROM "StudyPlan";

-- Check progress records
SELECT id, "hoursSpent", "confidenceLevel" FROM "ProgressRecord";
```

---

## 🔐 Security Checklist

- ✅ PostgreSQL database running on Supabase
- ✅ JWT authentication configured
- ✅ Password hashing with bcrypt (configured in seed)
- ✅ Email service configured with Nodemailer
- ✅ Environment variables using .env
- ✅ Database connection string using CONNECTION POOL
- ❓ TODO: Update Gmail with actual credentials
- ❓ TODO: Update JWT_SECRET with strong random string (min 32 chars)

---

## 📁 Project Structure

```
src/
├── config/
│   └── configuration.ts          ← Environment variables loader
├── modules/
│   ├── auth/                     ← Authentication (login, register)
│   ├── user/                     ← User management
│   ├── subject/                  ← Subject CRUD
│   ├── exam/                     ← Exam CRUD
│   ├── topic/                    ← Topic CRUD
│   ├── study-plan/               ← Study plan generation
│   └── progress/                 ← Progress tracking
├── common/
│   ├── decorators/               ← Custom decorators (@CurrentUser, etc)
│   ├── guards/                   ← JWT auth guard
│   ├── filters/                  ← Exception filters
│   └── interceptors/             ← Response transformation
└── main.ts                       ← Application entry point

prisma/
├── schema.prisma                 ← Database schema
└── seed.ts                       ← Test data seed
```

---

## 🚀 Running the Application

### Development Mode (with auto-reload)
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Regenerate Prisma Client
```bash
npx prisma generate
```

### Reset Database (Warning: Deletes all data!)
```bash
npx prisma migrate reset
```

### View Database in Studio
```bash
npx prisma studio
```

---

## 📝 API Endpoints Available

### Authentication
- `POST /auth/login` - Login user
- `POST /auth/register` - Register new user
- `POST /auth/verify-email` - Verify email
- `POST /auth/forgot-password` - Forgot password
- `POST /auth/reset-password` - Reset password
- `POST /auth/refresh` - Refresh JWT token

### Users
- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update profile

### Subjects
- `GET /subjects` - List all subjects
- `POST /subjects` - Create subject
- `PATCH /subjects/:id` - Update subject
- `DELETE /subjects/:id` - Delete subject

### Exams
- `GET /exams` - List all exams
- `POST /exams` - Create exam
- `PATCH /exams/:id` - Update exam
- `DELETE /exams/:id` - Delete exam
- `GET /exams/upcoming` - Get upcoming exams

### Topics
- `GET /topics` - List topics
- `POST /topics` - Create topic
- `PATCH /topics/:id` - Update topic
- `DELETE /topics/:id` - Delete topic

### Study Plans
- `POST /study-plans/generate` - Generate new study plan
- `GET /study-plans` - List all study plans
- `GET /study-plans/active` - Get active study plan
- `GET /study-plans/:id` - Get study plan details

### Progress
- `POST /progress` - Log study progress
- `GET /progress` - Get progress history
- `GET /progress/daily-stats` - Get daily statistics
- `GET /progress/streaks` - Get study streaks

---

## 🎯 Test Credentials

**Account 1:**
- Email: `student1@example.com`
- Password: `Password123@`

**Account 2:**
- Email: `student2@example.com`
- Password: `Password123@`

---

## 📞 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:** Check DATABASE_URL in .env is correct for your Supabase project

### JWT Secret Not Set
```
Error: JWT_SECRET is required
```
**Solution:** Add JWT_SECRET to .env with minimum 32 characters

### Email Not Sending
```
Error: Invalid credentials for SMTP
```
**Solution:** 
1. Gmail requires 2FA enabled
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use 16-character password in EMAIL_PASSWORD

### Prisma Type Errors
```
Property 'xxx' does not exist
```
**Solution:** Run `npx prisma generate` to regenerate Prisma types

---

## 📚 Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NestJS Documentation](https://docs.nestjs.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## ✨ Next Steps

1. **Test the API**
   ```bash
   curl -X GET http://localhost:3000
   ```

2. **Create more subjects/exams** via API

3. **Implement additional features**
   - Email notifications
   - Study session tracking
   - AI-based recommendations

4. **Connect frontend** to the API

5. **Deploy to production**
   - Use Docker
   - Deploy to Azure, Heroku, or AWS

---

**Last Updated:** March 5, 2026
**Status:** ✅ Ready for Development
