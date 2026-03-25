# AI Study Planner Frontend - Next.js

A modern, responsive study planning application for LPU students built with Next.js, React, and Tailwind CSS.

## Features

✅ **User Authentication**
- Email/password signup and login
- JWT token-based sessions
- Profile management

✅ **Subject Management**
- Add and organize subjects by semester/year
- Set priority levels (Low, Medium, High)
- Track topics within subjects

✅ **Exam Tracking**
- Support for 8 exam types: CA-1, CA-2, CA-3, Midterm, Endterm, Quiz, Project, Practical
- Set exam dates and weightage
- Track target vs actual scores

✅ **AI Study Plan Generation**
- Automatically generate personalized study plans
- Distribute topics based on difficulty and exam urgency
- Three distribution strategies:
  - Equal distribution
  - Priority-based (80/20 Pareto)
  - Difficulty-based (weak topics get more time)

✅ **Progress Dashboard**
- Daily study hours tracking
- Topics covered per day
- Weekly progress statistics
- Streak tracking

✅ **Real-time Charts**
- Weekly study hours bar chart
- Topics covered line chart
- Progress visualization

## Tech Stack

- **Framework**: Next.js 14.0.0 (App Router)
- **Language**: TypeScript 5.3.3
- **Styling**: Tailwind CSS 3.3.6
- **State Management**: Zustand 4.4.5
- **HTTP Client**: Axios 1.6.2
- **UI Components**: 
  - React Hot Toast 2.4.1 (Notifications)
  - Lucide React 0.292.0 (Icons)
  - Recharts 2.x (Charts)
- **Utilities**: Date-fns 2.30.0 (Date handling)

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Authentication pages
│   │   │   ├── layout.tsx      # Auth wrapper layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx    # Login page
│   │   │   └── register/
│   │   │       └── page.tsx    # Registration page
│   │   ├── dashboard/         # Protected dashboard pages
│   │   │   ├── layout.tsx      # Dashboard wrapper with sidebar
│   │   │   ├── page.tsx        # Dashboard home
│   │   │   ├── subjects/       # Subject management
│   │   │   ├── exams/          # Exam management
│   │   │   ├── study-plans/    # Study plan pages
│   │   │   └── progress/       # Progress tracking
│   │   ├── layout.tsx          # Root layout
│   │   ├── providers.tsx       # Client-side providers (Toast)
│   │   ├── page.tsx            # Home/redirect page
│   │   └── globals.css         # Global styles & Tailwind directives
│   │
│   ├── api/
│   │   └── client.ts           # Axios API wrapper with all endpoints
│   │
│   ├── store/
│   │   └── auth.ts             # Zustand auth store
│   │
│   └── types/
│       └── index.ts            # TypeScript interfaces for data models
│
├── public/                      # Static assets
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── next.config.js              # Next.js config
├── tailwind.config.js          # Tailwind config
├── postcss.config.js           # PostCSS config
├── .env.local                  # Environment variables (dev)
├── .env.example                # Environment template
├── .eslintrc.json              # ESLint config
├── .prettierrc                 # Prettier config
└── .gitignore                  # Git ignore rules
```

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AI Study Planner
NEXT_PUBLIC_UNIVERSITY_NAME=LPU
```

## Getting Started

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3001`

### 3. Build for Production

```bash
npm run build
npm start
```

## Running with Backend

### Option 1: Two Terminals (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd D:/saas
npm run start:dev
# Backend runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd D:/saas/frontend
npm run dev
# Frontend runs on http://localhost:3001
```

### Option 2: Docker Compose

```bash
cd D:/saas
docker-compose up
```

This starts both PostgreSQL and pgAdmin. Backend and frontend will run on default ports.

### Option 3: Using npx concurrently

```bash
cd D:/saas
npm install -D concurrently

# Update backend package.json scripts:
"scripts": {
  "all": "concurrently \"npm run start:dev\" \"cd frontend && npm run dev\""
}

# Run both:
npm run all
```

## API Integration

The frontend uses an Axios client configured in `src/api/client.ts`:

```typescript
import { apiClient } from '@/api/client';

// Login
await apiClient.login(email, password);

// Get subjects
const response = await apiClient.getSubjects();

// Generate study plan
await apiClient.generateStudyPlan({
  startDate: '2024-01-01',
  endDate: '2024-01-10',
  dailyHours: 4,
  distributionStrategy: 1,
});
```

All requests automatically include the JWT Bearer token from localStorage.

## Auth Flow

1. **Registration**: User creates account at `/auth/register`
2. **Email Verification**: Check email for verification link (backend sends email)
3. **Login**: User logs in at `/auth/login`
4. **Token Storage**: JWT token stored in localStorage
5. **API Calls**: All API requests include Bearer token automatically
6. **Logout**: Clears token and redirects to login

## Styling

Uses Tailwind CSS with custom component classes defined in `globals.css`:

```css
.btn              /* Button base styles */
.btn-primary      /* Primary button */
.form-input       /* Form input */
.form-label       /* Form label */
.card             /* Card component */
```

## Common Tasks

### Add a New Page

1. Create folder in `src/app/dashboard/feature-name/`
2. Create `page.tsx` inside it
3. Add to navigation in `dashboard/layout.tsx`

### Call Backend API

```typescript
import { apiClient } from '@/api/client';

const data = await apiClient.getSubjects();
```

### Use Auth Store

```typescript
import { useAuthStore } from '@/store/auth';

const { user, logout, login } = useAuthStore();
```

### Show Toast Notification

```typescript
import toast from 'react-hot-toast';

toast.success('Success message');
toast.error('Error message');
```

## Next Steps

- [ ] Complete dashboard components
- [ ] Add subject management UI
- [ ] Add exam management UI
- [ ] Add study plan generator UI
- [ ] Add progress tracking UI
- [ ] Mobile responsiveness
- [ ] Dark mode support
- [ ] Advanced filtering and search

## API Endpoints Used

| Method | Endpoint | Usage |
|--------|----------|-------|
| POST | `/auth/register` | User registration |
| POST | `/auth/login` | User login |
| GET | `/user/profile` | Get user profile |
| GET | `/subjects` | Get all subjects |
| POST | `/subjects` | Create new subject |
| GET | `/exams` | Get all exams |
| GET | `/exams/upcoming` | Get upcoming exams |
| POST | `/exams` | Create new exam |
| POST | `/study-plans/generate` | Generate AI study plan |
| GET | `/study-plans/active` | Get active study plan |
| GET | `/progress` | Get progress data |

## Troubleshooting

### Port Already in Use
```bash
# Change port in npm script
"dev": "next dev -p 3002"
```

### API Connection Issues
- Ensure backend is running on `http://localhost:3000`
- Check `.env.local` has correct API_URL
- Open DevTools Network tab to see API calls

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

## Contributing

1. Follow the existing code structure
2. Use TypeScript strict mode
3. Keep components focused and reusable
4. Test API integrations before pushing
5. Update types in `src/types/index.ts`

## Support

For issues or questions about the frontend, check:
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- Backend API documentation in `../README.md`

---

**Built for LPU Students | Powered by AI Study Plans** 🎓✨
