# AI Study Planner SaaS Backend - Development Guidelines

This file provides custom instructions for GitHub Copilot and development guidelines for this AI Study Planner SaaS backend project.

## Project Overview

**Tech Stack:**
- Backend: NestJS 10.3 + TypeScript
- Database: PostgreSQL with Prisma ORM
- Authentication: JWT (access + refresh tokens)
- Email: Nodemailer for verification and notifications
- Security: bcrypt, Helmet, CORS

**Key Features:**
- User authentication with email verification
- Subject, Exam, and Topic management
- AI-based study plan generation
- Daily/weekly/monthly progress tracking
- Email notifications
- RESTful API

## Architecture & Structure

```
src/
├── modules/           # Feature modules (auth, user, subject, exam, topic, study-plan, progress)
├── common/            # Shared filters, guards, decorators, interceptors
├── config/            # Configuration management
├── libs/              # Database (Prisma) and Email services
└── main.ts           # Application entry point
```

### Module Organization

Each module should include:
- `dto/` - Data Transfer Objects for validation
- `*.controller.ts` - HTTP request handling
- `*.service.ts` - Business logic
- `*.module.ts` - Module definition

## Code Standards

### TypeScript
- Use `strict: true` in tsconfig.json
- Explicit return types on functions
- No `any` types
- Use path aliases: `@/*`, `@modules/*`, `@common/*`, `@libs/*`

### Services
- Keep services focused on business logic
- Use Prisma for database operations
- Handle errors with custom exceptions
- Add logging for important operations

### Controllers
- Use path parameters for resource identification
- Use query parameters for filtering/pagination
- Apply `@UseGuards(JwtAuthGuard)` for protected routes
- Use `@CurrentUser()` decorator to get authenticated user

### DTOs
- Use `class-validator` decorators
- Use `class-transformer` for type conversion
- Make optional fields with `@IsOptional()`

### Database (Prism a)
- Use proper indexing strategies
- Cascade deletes where appropriate
- Use relations correctly
- Keep migrations clean and ordered

## Development Workflow

### When Adding a New Feature:

1. **Create DTOs** in `modules/feature/dto/`
2. **Update Prisma schema** if needed
3. **Create/Update Service** with business logic
4. **Create/Update Controller** with endpoints
5. **Register in Module** exports
6. **Add error handling** with custom exceptions
7. **Add logging** for important operations

### When Updating Database:

```bash
npx prisma migrate dev --name descriptive_name
npm run prisma:generate
```

### Run Tests:
```bash
npm run test
npm run test:cov
```

## Authentication & Authorization

- JWT tokens stored in Authorization header: `Bearer <token>`
- Public routes use `@Public()` decorator
- Protected routes use `@UseGuards(JwtAuthGuard)`
- Extract user with `@CurrentUser()` decorator
- Always verify user owns the resource (user.id check)

## Error Handling

Use custom exceptions from `@common/exceptions/`:
- `BadRequestException` - 400
- `UnauthorizedException` - 401
- `ForbiddenException` - 403
- `NotFoundException` - 404
- `ConflictException` - 409
- `ValidationException` - 422
- `InternalServerException` - 500

Example:
```typescript
if (!user) {
  throw new NotFoundException('User not found');
}
```

## Study Plan Algorithm

The algorithm in `study-plan/utils/study-plan-algorithm.ts`:
1. Calculates days until exam (urgency)
2. Considers exam weightage
3. Prioritizes weak topics
4. Distributes available hours
5. Creates daily schedule
6. Optimizes to avoid overload

Three distribution strategies:
- 0: Equal distribution
- 1: Priority-based (80/20 Pareto)
- 2: Difficulty-based (50% weak, 35% medium, 15% strong)

## Email Integration

Email service handles:
- Email verification
- Password reset
- Study plan notifications

Configure in `.env`:
```
EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, EMAIL_FROM
```

## Testing Guidelines

- Write unit tests for services
- Mock Prisma for service tests
- Test DTOs validation
- Test guards and decorators
- Aim for >80% coverage

## Performance Considerations

- Database indexes on frequently queried fields
- Pagination for list endpoints
- Select only needed fields from database
- Cache study plans appropriately
- Limit concurrent email sending

## Security Checklist

- ✅ Use JWT with expiration
- ✅ Hash passwords with bcrypt
- ✅ Validate all inputs with DTOs
- ✅ Use CORS appropriately
- ✅ Enable Helmet security headers
- ✅ Rate limit API endpoints
- ✅ Verify user ownership of resources
- ✅ Use environment variables for secrets
- ✅ Remove stack traces in production
- ✅ Implement refresh token rotation

## Environment Variables

**Required:**
- DATABASE_URL
- JWT_SECRET (min 32 chars)
- EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, EMAIL_FROM
- FRONTEND_URL

**Optional:**
- APP_PORT (default: 3000)
- NODE_ENV (development/production)
- THROTTLE_TTL, THROTTLE_LIMIT

## Deployment

### Docker:
```bash
docker build -t saas-backend .
docker run -p 3000:3000 --env-file .env saas-backend
```

### Production Checklist:
- [ ] Run `npm run build`
- [ ] Set `NODE_ENV=production`
- [ ] Configure strong JWT_SECRET
- [ ] Use managed database service
- [ ] Enable HTTPS
- [ ] Set up error monitoring
- [ ] Configure proper CORS origin
- [ ] Run database backups
- [ ] Set up CI/CD pipeline

## Common Commands

```bash
npm install                    # Install dependencies
npm run start:dev             # Development mode
npm run build                 # Production build
npm run lint                  # Run ESLint
npm run format                # Format with Prettier
npm run test                  # Run tests
npx prisma studio            # Open database GUI
npx prisma migrate dev        # Create migration
npx prisma db seed            # Run seed script
```

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tower.js Decorators](https://docs.nestjs.com/custom-decorators)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Development Tips

1. **Use Prisma Studio**: `npm run prisma:studio` to visualize data
2. **Watch Mode**: `npm run start:dev` for auto-reload
3. **Debug**: Use VS Code debugger with `npm run start:debug`
4. **Type Safety**: Leverage TypeScript strict mode
5. **Validation**: Always validate inputs with DTOs
6. **Errors**: Use custom exceptions for consistency
7. **Logging**: Use Logger service for important events
8. **Testing**: Write tests alongside features

---

**Last Updated:** February 25, 2026
**Maintained by:** Development Team
