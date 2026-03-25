# Authentication Update - Quick Start Checklist

Complete these steps to get the new enrollment-based authentication system running.

## Phase 1: Setup Supabase ⚙️

- [ ] **Create Supabase Project**
  - Go to https://supabase.com and create a new project
  - Save your project credentials

- [ ] **Create Students Table**
  - Open Supabase SQL Editor
  - Execute SQL from `SUPABASE_SETUP_GUIDE.md` → "1. Students Table"
  - Verify table created in Table Editor

- [ ] **Create Subjects Table**
  - In SQL Editor, execute SQL for "2. Subjects Table"
  - Verify table created

- [ ] **Create Timetable Table**
  - In SQL Editor, execute SQL for "3. Timetable Table"
  - Verify table created

- [ ] **Create Indexes** (Recommended)
  - Execute index creation SQL from the guide
  - This improves query performance

## Phase 2: Insert Test Data 📊

- [ ] **Generate Bcrypt Hash for Password**
  ```bash
  npm install -D bcrypt-cli
  npx bcrypt "TestPassword123"
  # Copy the hash output
  ```

- [ ] **Insert Test Student**
  - In Supabase SQL Editor, run:
  ```sql
  INSERT INTO students (enrollment_number, password, name, course, department, semester)
  VALUES (
    'ENG001234',
    'PASTE_YOUR_BCRYPT_HASH_HERE',
    'Test Student',
    'BTech',
    'Computer Science',
    1
  );
  ```

- [ ] **Insert Sample Subjects**
  - Copy SQL from "Sample Subjects" section in guide
  - Execute in SQL Editor

- [ ] **Insert Sample Timetable** (Optional)
  - Add timetable entries if needed for testing

## Phase 3: Configure Environment 🔐

- [ ] **Update .env File**
  ```env
  # Add these from Supabase Settings → API
  SUPABASE_URL=https://your-project-id.supabase.co
  SUPABASE_ANON_KEY=your_anon_key_from_supabase
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  
  # Keep existing email config for notifications
  EMAIL_HOST=smtp.gmail.com
  EMAIL_PORT=587
  EMAIL_USER=your-email@gmail.com
  EMAIL_PASSWORD=your-app-password
  EMAIL_FROM=noreply@yourdomain.com
  ```

- [ ] **Verify All Required Variables**
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  - DATABASE_URL
  - JWT_SECRET
  - EMAIL_* variables

## Phase 4: Database Migration 🗄️

- [ ] **Backup Current Database** ⚠️
  - Export your current data if you have any
  - This migration will remove email-related fields

- [ ] **Run Prisma Migration**
  ```bash
  npx prisma migrate dev --name update_user_for_enrollment_auth
  ```

- [ ] **Verify Migration**
  - Check that User table schema updated correctly
  - Old email fields should be removed

- [ ] **Regenerate Prisma Client**
  ```bash
  npx prisma generate
  ```

## Phase 5: Deploy Backend 🚀

- [ ] **Install Dependencies** (if needed)
  ```bash
  npm install @supabase/supabase-js
  ```

- [ ] **Build Backend**
  ```bash
  npm run build
  ```

- [ ] **Start Backend in Dev Mode**
  ```bash
  npm run start:dev
  ```

- [ ] **Verify No Errors**
  - Check console for any error messages
  - Should see "Application is running"

## Phase 6: Test Login Flow 🧪

- [ ] **Open Login Page**
  - Go to http://localhost:3000/auth/login
  - (Or wherever your frontend is running)

- [ ] **Select College**
  - Click on a college to proceed
  - This navigates to the login page

- [ ] **Enter Test Credentials**
  - Enrollment Number: `ENG001234`
  - Password: `TestPassword123`

- [ ] **Login**
  - Click "Continue" button
  - Should show success toast message
  - Should redirect to dashboard

- [ ] **Verify Dashboard**
  - Check that student data is displayed
  - Subjects should load from Supabase
  - Timetable should load from Supabase

## Phase 7: Verify Frontend Changes ✅

- [ ] **Check Login Page Field**
  - Should say "Enrollment Number" (not Email Address)
  - Placeholder should show example enrollment format

- [ ] **Check Register Page**
  - Accessing `/auth/register` should redirect to `/auth/login`

- [ ] **Check API Calls**
  - Open browser DevTools → Network tab
  - Login request should send `enrollmentNumber` and `password`
  - Should NOT have `email` field

## Phase 8: Add More Users 👥

- [ ] **Insert Additional Test Students**
  ```sql
  INSERT INTO students (enrollment_number, password, name, course, department, semester)
  VALUES 
    ('ENG001235', 'HASH', 'Student 2', 'BTech', 'CS', 2),
    ('BBA001001', 'HASH', 'Student 3', 'BBA', 'Business', 1);
  ```

- [ ] **Test Each Login**
  - Verify each user can login
  - Check their specific data loads correctly

## Phase 9: Production Preparation 🏭

- [ ] **Remove Test Data** (Before going live)
  - Delete test students
  - Keep sample subjects and timetable

- [ ] **Enable Row Level Security** (Optional but recommended)
  - See "Step 5" in SUPABASE_SETUP_GUIDE.md

- [ ] **Update Test Credentials Display**
  - Edit login page to show real test student credentials

- [ ] **Test Email Notifications** (Optional)
  - Send a study plan to verify emails still work
  - Email service is independent of authentication

- [ ] **Security Checklist**
  - [ ] JWT_SECRET is strong (32+ chars)
  - [ ] SUPABASE_SERVICE_ROLE_KEY is secured
  - [ ] Environment variables not in version control
  - [ ] Passwords stored with bcrypt (min 10 rounds)

## Troubleshooting 🔧

### Login Fails with "Invalid credentials"
- [ ] Verify enrollment_number in Supabase matches exactly (case-sensitive)
- [ ] Verify password is bcrypt-hashed in database
- [ ] Check SUPABASE_SERVICE_ROLE_KEY is correct

### Connection Error to Supabase
- [ ] Verify SUPABASE_URL is correct format
- [ ] Check internet connection
- [ ] Ensure Supabase project is active
- [ ] Check if IP is blocked by Supabase firewall

### Prisma Migration Fails
- [ ] Ensure DATABASE_URL is correct
- [ ] Backup and clear database if needed
- [ ] Run: `npx prisma migrate reset` (⚠️ will delete data)

### Students Table Not Found
- [ ] Verify table created in Supabase Table Editor
- [ ] Check schema is "public" (default)
- [ ] Verify table name is lowercase: `students`

### Frontend Not Updating
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Restart frontend dev server
- [ ] Check `frontend/src/api/client.ts` is updated

## Documentation Files

📚 **Important Files to Review:**
- `SUPABASE_SETUP_GUIDE.md` - Complete Supabase setup instructions
- `AUTH_UPDATE_SUMMARY.md` - Detailed list of all changes made
- `.env.example` - Example environment variables

## Video Tutorial (Optional)

Would be helpful to create a video showing:
1. Supabase setup
2. Creating tables
3. Running migrations
4. Testing login

## Final Verification ✨

Once everything is configured:

```bash
# 1. Run tests
npm run test

# 2. Build for production
npm run build

# 3. Check no TypeScript errors
npx tsc --noEmit
```

## Success Indicators ✅

You're done when:
- ✅ You can login with enrollment number
- ✅ Student data loads from Supabase
- ✅ Subjects display correctly
- ✅ Timetable loads
- ✅ Dashboard shows personalized data
- ✅ No email authentication references remain
- ✅ All tests pass
- ✅ Build is successful

---

**Having Issues?** 
1. Check `SUPABASE_SETUP_GUIDE.md` troubleshooting section
2. Review backend server logs
3. Check browser DevTools → Network/Console for frontend errors
4. Verify environment variables are correct

**Need Help?**
- See `AUTH_UPDATE_SUMMARY.md` for comprehensive change documentation
- Review Supabase docs: https://supabase.com/docs
- Check JWT strategy: `src/modules/auth/strategies/jwt.strategy.ts`
