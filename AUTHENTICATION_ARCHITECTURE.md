# Authentication System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Frontend)                        │
│                     (Next.js React Application)                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Login Page                                              │   │
│  │  ├─ Enrollment Number Input                              │   │
│  │  ├─ Password Input                                       │   │
│  │  └─ Continue Button                                      │   │
│  └──────────────────────────┬───────────────────────────────┘   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                     POST /auth/login
                    {enrollmentNumber, password}
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Backend (NestJS Application)                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ AuthController                                           │   │
│  │ └─ login(loginDto)                                       │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                       │
│  ┌────────────────────────▼─────────────────────────────────┐   │
│  │ AuthService                                              │   │
│  │ ├─ Authenticate against Supabase students table          │   │
│  │ ├─ Create/Update local User record                       │   │
│  │ ├─ Fetch student subjects                               │   │
│  │ ├─ Fetch student timetable                              │   │
│  │ └─ Generate JWT tokens                                  │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                       │
│  ┌────────────────────────▼─────────────────────────────────┐   │
│  │ SupabaseService                                          │   │
│  │ ├─ authenticateStudent(enrollmentNumber, password)       │   │
│  │ │  └─ Query students table by enrollment_number         │   │
│  │ │  └─ Verify bcrypt password                            │   │
│  │ ├─ getStudentSubjects(course, semester)                 │   │
│  │ └─ getStudentTimetable(course, semester)                │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                       │
│  ┌────────────────────────▼─────────────────────────────────┐   │
│  │ PrismaService (Local PostgreSQL)                         │   │
│  │ └─ User table (enrollment-based)                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└────┬────────────────────────────────────────────┬────────────────┘
     │                                            │
     │                  ┌──────────────────────────┘
     │                  │
     ▼                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                    External Services                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Supabase PostgreSQL Database                              │   │
│  │ ├─ students table (enrollment credentials)                │   │
│  │ ├─ subjects table (course offerings)                      │   │
│  │ └─ timetable table (class schedules)                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ App PostgreSQL Database                                   │   │
│  │ ├─ users table (local auth records)                       │   │
│  │ ├─ subjects table (user-specific data)                    │   │
│  │ ├─ exams table                                            │   │
│  │ ├─ topics table                                           │   │
│  │ ├─ study_plans table                                      │   │
│  │ └─ progress_records table                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

### 1. Login Request

```
User Input:
  - Enrollment Number: "ENG001234"
  - Password: "TestPassword123"

HTTP POST /auth/login
{
  "enrollmentNumber": "ENG001234",
  "password": "TestPassword123"
}
```

### 2. Supabase Verification

```
SupabaseService.authenticateStudent():
  1. Query: SELECT * FROM students WHERE enrollment_number = 'ENG001234'
  2. Found student record: {
       id: "uuid-123",
       enrollment_number: "ENG001234",
       password: "$2b$10$...", // bcrypt hash
       name: "John Doe",
       course: "BTech",
       department: "Engineering",
       semester: 1
     }
  3. Verify: bcrypt.compare("TestPassword123", "$2b$10$...")
  4. Result: ✅ Password matches
```

### 3. Local User Sync

```
AuthService.login():
  1. Check if user exists locally:
     SELECT * FROM users WHERE enrollmentNumber = 'ENG001234'
  
  2. If not exists:
     CREATE User {
       enrollmentNumber: "ENG001234",
       name: "John Doe",
       course: "BTech",
       department: "Engineering",
       semester: 1,
       supabaseId: "uuid-123"
     }
  
  3. If exists:
     UPDATE User { lastLogin, course, semester, ... }
```

### 4. Load Related Data

```
AuthService.login():
  1. Get Subjects:
     SELECT * FROM subjects WHERE course='BTech' AND semester=1
     Returns: [programing, data structures, databases, ...]
  
  2. Get Timetable:
     SELECT * FROM timetable WHERE course='BTech' AND semester=1
     Returns: [Monday 9AM, Tuesday 10AM, ...]
```

### 5. Generate JWT Tokens

```
AuthService.login():
  1. accessToken = JWT.sign({
       sub: "user-uuid-456",
       enrollmentNumber: "ENG001234"
     }, SECRET, { expiresIn: "24h" })
  
  2. refreshToken = JWT.sign({
       sub: "user-uuid-456",
       enrollmentNumber: "ENG001234"
     }, REFRESH_SECRET, { expiresIn: "7d" })
```

### 6. Response to Client

```
HTTP 200 OK
{
  "data": {
    "user": {
      "id": "user-uuid-456",
      "enrollmentNumber": "ENG001234",
      "name": "John Doe",
      "course": "BTech",
      "department": "Engineering",
      "semester": 1
    },
    "subjects": [
      { "id": "subj-1", "name": "Programming", "code": "CS101", ... },
      { "id": "subj-2", "name": "Data Structures", "code": "CS102", ... }
    ],
    "timetable": [
      { "day": "Monday", "startTime": "09:00", "endTime": "10:30", ... }
    ],
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 7. Frontend Storage

```
localStorage:
  ├─ ai_study_planner_token = "eyJhbGc..."
  ├─ ai_study_planner_refresh_token = "eyJhbGc..."
  └─ selectedCollege = "Engineering College"

Zustand Store:
  ├─ user = { id, enrollmentNumber, name, ... }
  ├─ token = "eyJhbGc..."
  └─ isLoading = false
```

### 8. Authenticated Requests

```
Subsequent requests include JWT:

GET /auth/profile
Authorization: Bearer eyJhbGc...

JwtStrategy.validate():
  1. Extract JWT from header
  2. Verify signature using JWT_SECRET
  3. Query: SELECT * FROM users WHERE id = payload.sub
  4. Return user data to controller
  5. Controller uses @CurrentUser() to access user info
```

## Data Models

### Supabase - Students Table

```
students
├─ id: UUID (PK)
├─ enrollment_number: VARCHAR(50) UNIQUE
├─ password: VARCHAR(255) // bcrypt hash
├─ name: VARCHAR(255)
├─ course: VARCHAR(100) // BTech, BBA, etc.
├─ department: VARCHAR(100)
├─ semester: INTEGER // 1-8
├─ email: VARCHAR(255) [optional]
├─ phone: VARCHAR(20) [optional]
├─ is_active: BOOLEAN
├─ created_at: TIMESTAMP
└─ updated_at: TIMESTAMP

Indexes:
  ├─ PK: id
  ├─ UNIQUE: enrollment_number
  └─ INDEX: course, semester
```

### Local Database - User Table

```
users
├─ id: UUID (PK)
├─ enrollmentNumber: VARCHAR(255) UNIQUE
├─ supabaseId: UUID [optional]
├─ name: VARCHAR(255) [optional]
├─ course: VARCHAR(100) [optional]
├─ department: VARCHAR(100) [optional]
├─ semester: INTEGER [optional]
├─ profilePicture: VARCHAR(255) [optional]
├─ lastLogin: TIMESTAMP
├─ isActive: BOOLEAN
├─ createdAt: TIMESTAMP
└─ updatedAt: TIMESTAMP

Indexes:
  ├─ PK: id
  ├─ UNIQUE: enrollmentNumber
  ├─ INDEX: course
  └─ INDEX: semester

Relations:
  ├─ subjects: User 1→∞ Subject
  ├─ exams: User 1→∞ Exam
  ├─ topics: User 1→∞ Topic
  ├─ studyPlans: User 1→∞ StudyPlan
  └─ progressRecords: User 1→∞ ProgressRecord
```

### Supabase - Subjects Table

```
subjects
├─ id: UUID (PK)
├─ course: VARCHAR(100) // BTech, BBA
├─ semester: INTEGER // 1-8
├─ name: VARCHAR(255)
├─ code: VARCHAR(50)
├─ credits: INTEGER
├─ description: TEXT
├─ created_at: TIMESTAMP
└─ updated_at: TIMESTAMP

Indexes:
  ├─ PK: id
  ├─ UNIQUE: (course, semester, code)
  └─ INDEX: (course, semester)
```

### Supabase - Timetable Table

```
timetable
├─ id: UUID (PK)
├─ course: VARCHAR(100)
├─ semester: INTEGER
├─ subject_id: UUID [FK → subjects]
├─ day_of_week: INTEGER // 0=Mon, 6=Sun
├─ start_time: TIME
├─ end_time: TIME
├─ classroom: VARCHAR(100)
├─ instructor: VARCHAR(255)
├─ created_at: TIMESTAMP
└─ updated_at: TIMESTAMP

Indexes:
  ├─ PK: id
  └─ INDEX: (course, semester)
```

## Key Components

### 1. SupabaseService (`src/libs/supabase/supabase.service.ts`)

**Responsibilities:**
- Authenticate students against Supabase
- Fetch student subjects by course/semester
- Fetch timetable by course/semester
- Verify bcrypt passwords
- Query student information

**Key Methods:**
```typescript
authenticateStudent(enrollmentNumber, password): Promise<Student>
getStudentByEnrollmentNumber(enrollmentNumber): Promise<Student>
getStudentById(id): Promise<Student>
getStudentSubjects(course, semester): Promise<Subject[]>
getStudentTimetable(course, semester): Promise<Timetable[]>
hashPassword(password): Promise<string>
verifyPassword(password, hash): Promise<boolean>
studentExists(enrollmentNumber): Promise<boolean>
```

### 2. AuthService (`src/modules/auth/auth.service.ts`)

**Responsibilities:**
- Orchestrate authentication flow
- Manage local user records
- Generate JWT tokens
- Return authenticated user data

**Key Methods:**
```typescript
login(loginDto): Promise<AuthResponse>
  ├─ Call SupabaseService.authenticateStudent()
  ├─ Sync user to local database
  ├─ Fetch subjects and timetable
  ├─ Generate JWT tokens
  └─ Return complete response

getProfile(userId): Promise<UserProfile>
  ├─ Fetch user from local database
  ├─ Fetch Supabase student data
  ├─ Fetch subjects and timetable
  └─ Return profile data
```

### 3. AuthController (`src/modules/auth/auth.controller.ts`)

**Endpoints:**
- `POST /auth/login` - Authenticate and get tokens
- `GET /auth/profile` - Get authenticated user profile
- `POST /auth/logout` - Logout (frontend only)

**Security:**
- `GET /auth/profile` requires JWT
- `POST /login` is public

### 4. SupabaseModule (`src/libs/supabase/supabase.module.ts`)

**Purpose:**
- Provides SupabaseService as injectable dependency
- Configured in AuthModule and other modules that need it

## Security Considerations

### Password Security
- ✅ Passwords stored with bcrypt (min 10 rounds)
- ✅ Password verification done server-side
- ✅ Passwords hashed before database storage
- ✅ No passwords sent in responses or logs

### JWT Security
- ✅ JWT_SECRET is strong (min 32 chars)
- ✅ Access tokens expire in 24 hours
- ✅ Refresh tokens expire in 7 days
- ✅ Tokens include user ID for verification
- ✅ Invalid tokens rejected by JwtStrategy

### Credential Security
- ✅ Supabase service role key kept in .env (not in code)
- ✅ Database credentials not exposed
- ✅ Failed login attempts generic error message
- ✅ No enrollment number leakage in responses

### Data Privacy
- ✅ User passwords never returned in responses
- ✅ Sensitive fields filtered in queries
- ✅ Student data only returned to verified user
- ✅ Subject/timetable filtered by course/semester

## Error Handling

### Login Failures

```
Invalid Credentials:
  Status: 401
  Message: "Invalid enrollment number or password"
  Details: Generic (doesn't reveal if enrollment exists)

User Not Found:
  Status: 401
  Message: "Invalid enrollment number or password"

Password Mismatch:
  Status: 401
  Message: "Invalid enrollment number or password"

Authentication Error:
  Status: 401
  Message: "Authentication failed"

Connection Error:
  Status: 500
  Message: "Internal Server Error"
  Details: Logged server-side for debugging
```

## Scalability Considerations

1. **Indexing:** Critical indexes on:
   - `students(enrollment_number)` - O(1) lookup
   - `subjects(course, semester)` - Fast filtering
   - `timetable(course, semester)` - Fast filtering

2. **Caching:** Consider caching for:
   - Subjects (rarely change)
   - Timetable (rarely change)
   - User profile (per-session cache)

3. **Database:** Both databases should use:
   - Connection pooling
   - Prepared statements
   - Query optimization

## Future Enhancements

1. **Password Management:** 
   - Implement password reset via Supabase
   - Add password change functionality
   - Add password strength requirements

2. **Multi-Factor Authentication:**
   - SMS/Email OTP
   - Time-based OTP (TOTP)
   - Biometric authentication

3. **Student Data Sync:**
   - Automatic sync from college database
   - Batch student imports
   - Sync audit logs

4. **Detailed Logging:**
   - Authentication attempts
   - Token generation/refresh
   - Failed login attempts
   - Access logs

5. **Rate Limiting:**
   - Login attempt rate limiting
   - API endpoint rate limiting
   - DDoS protection

---

**Last Updated:** March 8, 2026
**Architecture Version:** 2.0 (Enrollment-based)
