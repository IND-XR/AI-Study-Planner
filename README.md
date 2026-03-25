# AI Study Planner SaaS Backend

A production-ready NestJS backend for an AI-powered study planning application. Users can create study plans, track topics, manage exams, and monitor daily progress with intelligent study plan generation.

## 🚀 Features

- **User Authentication**: JWT-based auth, email verification, password reset
- **Subject Management**: Organize subjects by semester and academic year
- **Exam Tracking**: Create multiple exams (CA1, CA2, Midterm, Endterm, etc.)
- **Topic Management**: Add topics with difficulty levels and priority
- **AI Study Plan Generator**: Intelligent algorithm-based study plan generation
- **Progress Tracking**: Daily/weekly/monthly study statistics and streaks
- **Email Notifications**: Email verification and study plan notifications
- **Security**: JWT tokens, bcrypt password hashing, CORS, Helmet
- **Database**: PostgreSQL with Prisma ORM
- **Error Handling**: Global exception handling and validation
- **Scalable Architecture**: Modular design for easy expansion

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Git

## 🔧 Installation

### 1. Clone and Setup

```bash
# Navigate to project directory
cd d:\saas

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb ai_study_planner

# Update DATABASE_URL in .env

# Run Prisma migrations
npx prisma migrate dev --name init

# (Optional) Seed database with initial data
npx prisma db seed
```

### 3. Start Development Server

```bash
# Development with hot reload
npm run start:dev

# Or production mode
npm run build
npm run start:prod

# Server will run on http://localhost:3000
```

## 📁 Project Structure

```
src/
├── modules/
│   ├── auth/              # Authentication (register, login, JWT)
│   ├── user/              # User profile and settings
│   ├── subject/           # Subject management
│   ├── exam/              # Exam scheduling and management
│   ├── topic/             # Topic management with difficulty
│   ├── study-plan/        # Study plan generation and management
│   └── progress/          # Progress tracking and statistics
├── common/
│   ├── decorators/        # Custom decorators (auth, user)
│   ├── filters/           # Exception filters
│   ├── guards/            # JWT auth guards
│   ├── interceptors/      # Response transform interceptors
│   ├── exceptions/        # Custom exception classes
│   └── middlewares/       # Custom middlewares
├── config/                # Configuration files
├── libs/
│   ├── database/          # Prisma database setup
│   └── email/             # Email service (nodemailer)
├── app.module.ts          # Main app module
├── app.controller.ts      # Main controller
├── main.ts                # Application entry point
└── prisma/
    ├── schema.prisma      # Database schema
    └── seed.ts            # Initial database seed
```

## 🔑 Environment Variables

```env
# App
APP_NAME=AI Study Planner
APP_ENV=development
APP_PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_study_planner

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRATION=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@aisstudyplanner.com

# Frontend
FRONTEND_URL=http://localhost:3000

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=100

# Server
NODE_ENV=development
LOG_LEVEL=debug
```

## 📚 API Documentation

### Auth Routes
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/verify-email` - Verify email address
- `POST /auth/resend-verification-email` - Resend verification
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/logout` - Logout user

### User Routes
- `GET /users/me` - Get user profile
- `PUT /users/me` - Update profile
- `POST /users/change-password` - Change password
- `GET /users/stats` - Get user statistics
- `DELETE /users/me` - Delete account

### Subject Routes
- `POST /subjects` - Create subject
- `GET /subjects` - List all subjects
- `GET /subjects/:id` - Get subject details
- `PUT /subjects/:id` - Update subject
- `DELETE /subjects/:id` - Delete subject
- `GET /subjects/:id/stats` - Get subject statistics

### Exam Routes
- `POST /exams` - Create exam
- `GET /exams` - List exams
- `GET /exams/upcoming` - Get upcoming exams
- `GET /exams/:id` - Get exam details
- `PUT /exams/:id` - Update exam
- `DELETE /exams/:id` - Delete exam
- `GET /exams/:id/stats` - Get exam statistics

### Topic Routes
- `POST /topics` - Create topic
- `GET /topics` - List topics
- `GET /topics/weak-topics` - Get weak topics
- `GET /topics/:id` - Get topic details
- `PUT /topics/:id` - Update topic
- `DELETE /topics/:id` - Delete topic
- `GET /topics/:id/progress` - Get topic progress

### Study Plan Routes
- `POST /study-plans/generate` - Generate study plan
- `GET /study-plans` - List all plans
- `GET /study-plans/active` - Get active plan
- `GET /study-plans/:id` - Get plan details
- `GET /study-plans/:id/progress` - Get plan progress
- `POST /study-plans/:id/activate` - Activate plan

### Progress Routes
- `POST /progress` - Create progress record
- `GET /progress` - List progress records
- `GET /progress/daily-stats` - Get daily statistics
- `GET /progress/weekly-stats` - Get weekly statistics
- `GET /progress/monthly-stats` - Get monthly statistics
- `GET /progress/streaks` - Get study streaks
- `GET /progress/:id` - Get progress record
- `PUT /progress/:id` - Update progress record
- `DELETE /progress/:id` - Delete progress record

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

## 🔐 Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Password Hashing**: bcrypt with salt rounds
3. **Email Verification**: Token-based email verification
4. **CORS**: Configured for frontend origin
5. **Helmet**: HTTP headers security
6. **Input Validation**: DTO-based class validator
7. **Rate Limiting**: Throttler for API rate limiting
8. **Error Handling**: Global exception filter without stack traces in production

## 📊 Study Plan Algorithm

The study plan generator uses a weighted algorithm considering:

1. **Exam Urgency**: Exams sooner get higher priority
2. **Exam Weightage**: Higher weightage exams get more study time
3. **Topic Difficulty**: Weak topics get more attention
4. **Topic Priority**: User-set priorities are respected
5. **Available Hours**: Plan fits within user's available daily hours
6. **Distribution Strategies**:
   - Equal distribution
   - Priority-based (Pareto 80/20)
   - Difficulty-based

## 🚀 Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t ai-study-planner-backend .

# Run container
docker run -p 3000:3000 --env-file .env ai-study-planner-backend
```

### Cloud Deployment (AWS, Google Cloud, Azure)

Use the provided IaC templates or deploy to:
- AWS Elastic Beanstalk
- Google Cloud Run
- Azure App Service
- Heroku

## 🛠️ Development Workflow

```bash
# Format code
npm run format

# Lint code
npm run lint

# Run migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio

# Build for production
npm run build
```

## 📝 Best Practices Implemented

✅ **Architecture**
- Modular design with feature-based structure
- Separation of concerns (Controllers, Services, DTOs)
- Reusable common utilities

✅ **Database**
- Comprehensive Prisma schema with indexes
- Relationships and constraints properly defined
- Soft deletes where applicable

✅ **Security**
- Input validation with class-validator
- JWT with refresh tokens
- Password hashing with bcrypt
- CORS and Helmet configured
- Environment variables for secrets

✅ **Error Handling**
- Global exception filter
- Custom exception classes
- Proper HTTP status codes
- Detailed error messages (dev) / generic (prod)

✅ **Code Quality**
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Comprehensive comments
- Consistent naming conventions

✅ **Performance**
- Database indexes on frequently queried fields
- Pagination support
- Query optimization
- Caching considerations

## 📞 Support & Contributing

For issues, feature requests, or contributions, please create an issue or pull request.

## 📄 License

MIT License - See LICENSE file for details

---

**Happy studying! 🎓**
