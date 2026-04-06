# Database Migration Setup Guide

## Overview
The Prisma schema has been updated with new models for the complete SaaS system:
- **Degree**: Academic degree programs (BCA, MCA, BTech, MTech)
- **AdminTimetable**: Class schedules per degree
- **Notification**: User notifications (auto-generated when timetable updates)
- **Message**: Messages to specific users or entire degrees
- **Updated Subject**: Now linked to Degree instead of User
- **Updated User**: Added degreeId foreign key

## Migration Status

### Current Environment
- **Database**: Supabase PostgreSQL
- **Host**: `db.osbcrswpxgpycfrrjglu.supabase.co`
- **Port**: 5432
- **Database Name**: postgres

### What Needs to Be Done

#### Option 1: Via Supabase Dashboard (Recommended)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `osbcrswpxgpycfrrjglu`
3. Navigate to **SQL Editor**
4. Create a new query and paste the following SQL:

```sql
-- Create Degree table
CREATE TABLE "Degree" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "code" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX "Degree_code_idx" ON "Degree"("code");

-- Create AdminTimetable table
CREATE TABLE "AdminTimetable" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "degreeId" TEXT NOT NULL,
  "day" TEXT NOT NULL DEFAULT 'Monday',
  "time" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "room" TEXT,
  "type" TEXT NOT NULL DEFAULT 'Lecture',
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AdminTimetable_degreeId_fkey" FOREIGN KEY ("degreeId") REFERENCES "Degree" ("id") ON DELETE CASCADE
);

CREATE INDEX "AdminTimetable_degreeId_idx" ON "AdminTimetable"("degreeId");
CREATE INDEX "AdminTimetable_day_idx" ON "AdminTimetable"("day");

-- Create Notification table
CREATE TABLE "Notification" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'announcement',
  "read" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- Create Message table
CREATE TABLE "Message" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT,
  "degreeId" TEXT,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'message',
  "read" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
  CONSTRAINT "Message_degreeId_fkey" FOREIGN KEY ("degreeId") REFERENCES "Degree" ("id") ON DELETE CASCADE
);

CREATE INDEX "Message_userId_idx" ON "Message"("userId");
CREATE INDEX "Message_degreeId_idx" ON "Message"("degreeId");

-- Alter existing tables
ALTER TABLE "User" ADD COLUMN "degreeId" TEXT;
ALTER TABLE "User" ADD CONSTRAINT "User_degreeId_fkey" FOREIGN KEY ("degreeId") REFERENCES "Degree" ("id") ON DELETE SET NULL;
CREATE INDEX "User_degreeId_idx" ON "User"("degreeId");

-- Update Subject table constraints
-- First, drop the old unique constraint and add new one
ALTER TABLE "Subject" DROP CONSTRAINT IF EXISTS "Subject_userId_name_academicYear_key";
ALTER TABLE "Subject" ADD COLUMN "degreeId" TEXT;
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_degreeId_fkey" FOREIGN KEY ("degreeId") REFERENCES "Degree" ("id") ON DELETE CASCADE;
ALTER TABLE "Subject" ADD CONSTRAINT "degreeSubjectUnique" UNIQUE("degreeId", "name", "academicYear");
CREATE INDEX "Subject_degreeId_idx" ON "Subject"("degreeId");
```

5. Execute the query
6. Verify all tables are created by checking the **Table Editor**

#### Option 2: Via Local Migration (If Network Access Available)
```bash
# In the project root directory
npx prisma db push --accept-data-loss
```

#### Option 3: Via Prisma Migrate (With Network Fix)
```bash
# 1. Update .env DATABASE_URL to use connection pooler
# 2. Run migration
npx prisma migrate dev --name add_degree_timetable_notification
```

### Database Connection Troubleshooting

If you experience connectivity issues:

1. **Check Firewall**: Ensure port 5432 is not blocked
2. **Use Connection Pooler**: Update DATABASE_URL to:
   ```
   postgresql://postgres.osbcrswpxgpycfrrjglu:PASSWORD@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
3. **Verify Credentials**: Confirm password matches Supabase settings
4. **Use Supabase Dashboard**: Execute SQL directly in the dashboard

### Seed Data (Optional)

After migration, populate initial degrees:

```sql
-- Insert sample degrees
INSERT INTO "Degree" ("id", "name", "code", "createdAt", "updatedAt") VALUES
  (gen_random_uuid()::text, 'Bachelor of Computer Applications', 'BCA', NOW(), NOW()),
  (gen_random_uuid()::text, 'Master of Computer Applications', 'MCA', NOW(), NOW()),
  (gen_random_uuid()::text, 'Bachelor of Technology', 'BTECH', NOW(), NOW()),
  (gen_random_uuid()::text, 'Master of Technology', 'MTECH', NOW(), NOW());
```

## Verification

To verify the migration was successful:

1. Open SQL Editor in Supabase
2. Run:
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
```

You should see:
- AdminTimetable
- Degree
- Exam
- Message
- Notification
- ProgressRecord
- StudyPlan
- StudyPlanItem
- Subject
- Topic
- User

## Next Steps

1. ✅ Schema Updated
2. ⏳ Run Prisma Migration (Complete above steps)
3. ⏳ Generate Prisma Client: `npx prisma generate`
4. ⏳ Start Backend: `npm run start:dev`
5. ⏳ Test Endpoints

## API Endpoints Available After Migration

### Degrees
- `GET /api/degrees` - List all degrees
- `POST /api/degrees` - Create new degree (Admin only)

### Admin Users (Create Students)
- `POST /api/admin/users` - Create student account

### Subjects
- `POST /api/subjects` - Add subject to degree
- `GET /api/subjects?degreeId=...` - Get subjects by degree

### Timetable
- `GET /api/timetable/degree?degreeId=...` - Get timetable for degree
- `GET /api/timetable/user` - Get authenticated user's timetable
- `POST /api/timetable` - Create timetable entry (Admin)

### Notifications
- `GET /api/notifications` - Get user's notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read

## Support

If you encounter any issues:
1. Check Supabase status: https://status.supabase.com
2. Verify database credentials in Supabase settings
3. Try using Supabase SQL Editor directly
4. Check JWT_SECRET is set correctly in .env
