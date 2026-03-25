<!--
AI Study Planner SaaS - Project Synopsis
Edit fields marked [ ... ] before submission.
-->

<div align="center">

## PROJECT SYNOPSIS

### **AI Powered Study Planner (SaaS)**
### *Intelligent Study Timetable Generation and Progress Analytics for College Students*

**Submitted in partial fulfillment of the requirements for**  
**[Degree / Program Name]**

**Submitted by**  
**Name:** [Your Full Name]  
**University Roll No. / Enrollment No.:** [Your Enrollment Number]  
**Department:** [Department Name]  
**Semester:** [Semester]  

**Under the guidance of**  
**[Guide Name, Designation]**

**[College / University Name]**  
**[City, State]**  
**Academic Year:** [20XX–20XX]

</div>

---

## Declaration

I, **[Your Full Name]**, hereby declare that the project synopsis titled **“AI Powered Study Planner (SaaS)”** is an original work carried out by me under the guidance of **[Guide Name]**. This synopsis and the corresponding project work have not been submitted to any other institution for the award of any degree/diploma or for any other academic requirement.

**Date:** [DD/MM/YYYY]  
**Place:** [City]  

**Signature of Student**  
[Your Full Name]

---

## Certificate (Template)

This is to certify that the project synopsis titled **“AI Powered Study Planner (SaaS)”** submitted by **[Your Full Name]** (Enrollment No. **[Enrollment Number]**) is a bonafide work carried out under my supervision and guidance, and is submitted in partial fulfillment of the requirements for **[Degree / Program Name]**.

**Date:** [DD/MM/YYYY]  
**Place:** [City]  

**Signature of Guide**  
[Guide Name]  
[Designation]  
[Department]  

**Signature of HOD / Coordinator**  
[Name]  
[Designation]  

---

## Acknowledgement

I would like to express my sincere gratitude to **[Guide Name]** for continuous support, valuable guidance, and constructive feedback during the course of this project. I also thank **[College/University Name]**, the faculty members of **[Department Name]**, and my peers for their encouragement. Finally, I am grateful to my family for their constant support and motivation.

---

## Table of Contents

1. Project Title  
2. Introduction  
3. Problem Statement  
4. Objectives of the Project  
5. Scope of the Project  
6. Proposed System / Solution  
7. Technologies Used  
8. System Architecture (based on the code structure)  
9. Methodology / Development Approach  
10. Features of the System  
11. Expected Outcomes  
12. Future Enhancements  
13. Conclusion  
14. References  

---

## 1. Project Title

**AI Powered Study Planner (SaaS) – Intelligent Study Timetable Generation and Progress Analytics for College Students**

---

## 2. Introduction

Students frequently encounter difficulty in planning and managing study schedules across multiple subjects, exams, and topic-level coverage. Manual planning is time-consuming and often fails to adapt to factors such as exam dates, subject weightage, topic difficulty, available study hours, and consistency of study habits. As a result, students may experience inefficient preparation and limited visibility into progress.

This project proposes a **SaaS-based web application** that provides structured academic organization (Subjects → Exams → Topics) and generates an optimized study plan within a selected date range. The system also offers progress tracking and analytics at daily/weekly/monthly levels. The application is implemented with a **Next.js (TypeScript) frontend** and a **NestJS (TypeScript) backend**, supported by **PostgreSQL** persistence and **Prisma ORM** for data modeling and integrity.

---

## 3. Problem Statement

Design and implement a secure, scalable SaaS system that helps college students:

- Organize academic content as subjects, exams, and topics.
- Prioritize preparation based on exam urgency, weightage, and topic difficulty.
- Generate feasible study timetables within the student’s available time constraints.
- Track progress using study logs, statistics, and study streak analysis.
- Maintain secure authentication and user-data isolation in a multi-tenant environment.

---

## 4. Objectives of the Project

- Develop a multi-user SaaS web application with secure authentication.
- Provide CRUD management for subjects, exams, and topics.
- Implement an intelligent study plan generation algorithm that allocates hours across topics based on:
  - Exam proximity (urgency)
  - Exam weightage
  - Topic difficulty level (e.g., WEAK/MEDIUM/STRONG)
  - Topic priority and estimated hours
- Provide plan activation and plan-level progress computation.
- Provide progress logging and analytics endpoints (daily/weekly/monthly statistics and streaks).
- Use a maintainable, modular architecture suitable for future enhancements, including AI/ML-based optimization.

---

## 5. Scope of the Project

### In Scope

- **Authentication and authorization** using JWT, with protected routes via guards.
- **Academic management**: Subjects, Exams, Topics (relationships enforced via Prisma).
- **Study plan generation** within a user-defined start/end date and daily/weekly study-hour limits.
- **Study plan lifecycle**: generate, list, fetch active plan, activate plan, and compute progress metrics.
- **Progress tracking**: study session logs and analytics (daily/weekly/monthly statistics, streaks).
- **Security and reliability**: rate limiting, global validation, global exception handling, CORS/Helmet middleware.

### Out of Scope (Current/Planned)

- Full ML model integration (the codebase includes an abstraction/placeholder service for future ML/AI integration).
- Subscription billing and monetization workflows (future SaaS extension).
- Native mobile application (future enhancement).

---

## 6. Proposed System / Solution

The solution is implemented as a **two-part system**:

1. **Frontend (Next.js + TypeScript + Tailwind CSS)**  
   - Provides the landing experience and authenticated dashboard experience.
   - Uses an Axios-based API client to communicate with backend REST endpoints.
   - Persists authentication state and tokens using a lightweight client store (Zustand) and browser storage/cookies.

2. **Backend (NestJS + TypeScript)**  
   - Exposes modular REST APIs for authentication, academic entities, plan generation, and progress analytics.
   - Enforces security via JWT guards, input validation (DTOs), Helmet, CORS, throttling, and global exception filters.
   - Implements the study plan generation algorithm to distribute available study time across topics and dates.
   - Stores persistent data in PostgreSQL with Prisma ORM and constraints.

The planning engine currently follows **algorithmic “AI-inspired” optimization** based on weighted prioritization and distribution strategies, and is designed to support future ML-based personalization.

---

## 7. Technologies Used

### Frontend

- Next.js 14, React 18
- TypeScript
- Tailwind CSS
- Axios (API integration)
- Zustand (state management)
- UI/Chart libraries (Lucide icons; Recharts for dashboard visualization)

### Backend

- NestJS (modular architecture)
- TypeScript
- JWT authentication (Passport JWT + Nest JWT)
- bcrypt (password hashing)
- class-validator and class-transformer (DTO validation and transformation)
- Helmet (security headers), CORS (controlled cross-origin access)
- Nest Throttler (rate limiting)
- Nodemailer (email service module foundation)
- Supabase SDK (service module foundation)

### Database & ORM

- PostgreSQL
- Prisma ORM (schema, migrations, indexes, relations)

---

## 8. System Architecture (based on the code structure)

### Backend Structure (NestJS)

The backend follows a layered modular pattern:

- **Entry point**: `src/main.ts`  
  - Initializes the server, global pipes, interceptors, filters, and security middleware.
- **Application module**: `src/app.module.ts`  
  - Loads environment configuration with Joi validation and imports feature modules.
- **Feature modules**: `src/modules/*`  
  - `auth`, `user`, `subject`, `exam`, `topic`, `study-plan`, `progress`
- **Libraries**: `src/libs/*`  
  - `database` (Prisma), `email` (Nodemailer), `supabase` integration.
- **Common utilities**: `src/common/*`  
  - Guards, decorators, interceptors, exception handling.

### Database Structure (Prisma)

Key entities:

- `User` with `Role` (ADMIN/STUDENT)  
- `Subject` (linked to User)  
- `Exam` (linked to User and Subject; stores weightage, target score, date)  
- `Topic` (linked to User, Subject, and Exam; stores difficulty, estimated hours, priority)  
- `StudyPlan` and `StudyPlanItem` (scheduled items with allocated/completed hours)  
- `ProgressRecord` (study session logs, ratings, confidence, streak analysis inputs)

### Frontend Structure (Next.js App Router)

- Pages in `frontend/src/app/*` (landing, auth pages, dashboard)
- API client in `frontend/src/api/client.ts`
- Auth store in `frontend/src/store/auth.ts`
- UI components in `frontend/src/components/*`

---

## 9. Methodology / Development Approach

The development approach is iterative and modular:

- **Requirement analysis** for student workflows (subjects → exams → topics → plan → progress).
- **Database design** using Prisma schema with referential integrity and indexes.
- **API development** using NestJS controllers/services and DTO-based validation.
- **Security-first implementation**, including authentication guards, validation, rate limiting, and secure headers.
- **Frontend integration** through a centralized API client and state store.
- **Algorithm development** for study plan generation with configurable distribution strategies and load balancing.

---

## 10. Features of the System

- JWT-based authentication and protected APIs.
- Role-ready system (`ADMIN`, `STUDENT`) to support future administrative workflows.
- CRUD for Subjects, Exams, Topics with relational integrity.
- Study plan generation with:
  - Exam urgency (days until exam)
  - Exam weightage
  - Topic difficulty and priority
  - Estimated hours per topic
  - Daily hour constraints and overload prevention
  - Distribution strategies (equal/priority-based/difficulty-based)
- Study plan management:
  - Active plan retrieval
  - Plan activation
  - Progress metrics (completion % and hours progress)
- Progress tracking:
  - Study logs
  - Daily/weekly/monthly analytics
  - Study streaks
- Backend reliability:
  - Global exception handling
  - Response transformation
  - Request timeout control
  - Rate limiting

---

## 11. Expected Outcomes

- Students can maintain structured academic data and create personalized schedules.
- The system generates a feasible study timetable aligned with exam deadlines and availability.
- Students gain analytics-driven insights on preparation consistency and progress.
- The modular architecture provides a strong foundation for expanding to a production SaaS platform.

---

## 12. Future Enhancements

- Integrate a true ML-based personalization service (performance prediction, adaptive re-scheduling).
- Add automated reminders and notifications (email/push) linked to upcoming tasks.
- Add subscription plans and billing for SaaS monetization.
- Introduce advanced planner UI features such as drag-and-drop schedule edits and conflict resolution.
- Add admin dashboards and user management features using the existing role model.
- Expand integration with external academic calendars and institutional LMS systems.

---

## 13. Conclusion

The AI Powered Study Planner (SaaS) provides an end-to-end solution for systematic exam preparation. By combining a modern full-stack architecture (Next.js + NestJS), a structured relational data model (PostgreSQL + Prisma), and an algorithmic planning engine, the system improves planning efficiency and provides actionable progress analytics. The modular design supports scalability, maintainability, and future integration of ML-based optimization, aligning well with real-world SaaS requirements and academic project expectations.

---

## 14. References

1. NestJS Documentation, Official Guide.  
2. Next.js Documentation (App Router), Official Guide.  
3. Prisma ORM Documentation, Data Modeling and Migrations.  
4. PostgreSQL Documentation, Official Reference.  
5. RFC 7519: JSON Web Token (JWT).  
6. OWASP Application Security Verification Standard (ASVS) – Web Security Practices.  


