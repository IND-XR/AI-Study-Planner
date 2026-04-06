# Backend Module Implementation Guide

## Overview
This guide provides instructions for completing the backend module implementations that were created but need additional setup.

## Status Summary
✅ **Created**: Degree, Timetable, Notification modules (complete)
✅ **Created**: Frontend forms for Add Student and Add Degree
✅ **Updated**: app.module.ts with new module registrations
✅ **Fixed**: Notification controller import error
⏳ **Pending**: User Module admin endpoint, Subject Module degree support
⏳ **Pending**: Prisma database migration execution

---

## Module Implementation Details

### 1. User Module - Admin User Creation

**Status**: Service exists, admin endpoint missing  
**Location**: `src/modules/user/`

#### What Needs to Be Done:

Add the following method to `user.service.ts`:

```typescript
async createStudent(createUserDto: CreateUserDto) {
  // Check for duplicate enrollment number
  const existingUser = await this.prisma.user.findUnique({
    where: { enrollmentNumber: createUserDto.enrollmentNumber },
  });

  if (existingUser) {
    throw new ConflictException('Enrollment number already exists');
  }

  // Verify degree exists
  const degree = await this.prisma.degree.findUnique({
    where: { id: createUserDto.degreeId },
  });

  if (!degree) {
    throw new NotFoundException('Degree not found');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

  // Create user
  const user = await this.prisma.user.create({
    data: {
      name: createUserDto.name,
      enrollmentNumber: createUserDto.enrollmentNumber,
      password: hashedPassword,
      degreeId: createUserDto.degreeId,
      semester: createUserDto.semester,
      role: 'STUDENT',
    },
    select: {
      id: true,
      name: true,
      enrollmentNumber: true,
      semester: true,
      degreeId: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}
```

Add to `user.controller.ts`:

```typescript
@Post('admin/users')
@UseGuards(JwtAuthGuard)
async createStudent(@Body() createUserDto: CreateUserDto, @CurrentUser() user: any) {
  // Verify user is ADMIN
  if (user.role !== 'ADMIN') {
    throw new ForbiddenException('Only admins can create users');
  }

  return this.userService.createStudent(createUserDto);
}
```

#### Dependencies to Import:
```typescript
import * as bcrypt from 'bcrypt';
import { ConflictException, ForbiddenException } from '@nestjs/common';
```

#### Install bcrypt:
```bash
npm install bcrypt
npm install --save-dev @types/bcrypt
```

---

### 2. Subject Module - Degree-Based Support

**Status**: DTO created, service needs degree-based methods  
**Location**: `src/modules/subject/`

#### What Needs to Be Done:

Add the following method to `subject.service.ts`:

```typescript
async create(createSubjectDto: CreateSubjectDto) {
  // Verify degree exists if degreeId provided
  if (createSubjectDto.degreeId) {
    const degree = await this.prisma.degree.findUnique({
      where: { id: createSubjectDto.degreeId },
    });

    if (!degree) {
      throw new NotFoundException('Degree not found');
    }

    // Check for duplicate
    const existing = await this.prisma.subject.findFirst({
      where: {
        degreeId: createSubjectDto.degreeId,
        name: createSubjectDto.name,
        academicYear: createSubjectDto.academicYear,
      },
    });

    if (existing) {
      throw new ConflictException('Subject already exists for this degree');
    }
  }

  return this.prisma.subject.create({
    data: createSubjectDto,
    include: {
      degree: {
        select: { id: true, name: true },
      },
    },
  });
}

async findByDegree(degreeId: string) {
  // Verify degree exists
  const degree = await this.prisma.degree.findUnique({
    where: { id: degreeId },
  });

  if (!degree) {
    throw new NotFoundException('Degree not found');
  }

  return this.prisma.subject.findMany({
    where: {
      degreeId,
      isActive: true,
    },
    include: {
      _count: {
        select: { exams: true },
      },
    },
    orderBy: [{ semester: 'asc' }, { priority: 'desc' }],
  });
}
```

---

### 3. Message Module (NEW)

**Status**: Not created yet  
**Location**: `src/modules/message/`

#### Files to Create:

**message.module.ts**
```typescript
import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { PrismaModule } from '@libs/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
```

**message.controller.ts**
```typescript
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('api/messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get()
  getUserMessages(@CurrentUser() user: any) {
    return this.messageService.getUserMessages(user.id);
  }

  @Post()
  sendMessage(@Body() createMessageDto: CreateMessageDto, @CurrentUser() user: any) {
    return this.messageService.sendMessage(createMessageDto, user);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.messageService.markAsRead(id);
  }
}
```

**message.service.ts**
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async getUserMessages(userId: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { userId },
          { degree: { users: { some: { id: userId } } } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async sendMessage(createMessageDto: CreateMessageDto, user: any) {
    // Admin-only, send to user or entire degree
    const message = await this.prisma.message.create({
      data: createMessageDto,
    });

    return message;
  }

  async markAsRead(id: string) {
    return this.prisma.message.update({
      where: { id },
      data: { read: true },
    });
  }
}
```

**dto/create-message.dto.ts**
```typescript
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  degreeId?: string;

  @IsString()
  @IsOptional()
  type?: string = 'message';
}
```

---

## Installation Commands

```bash
# Install bcrypt for password hashing
npm install bcrypt
npm install --save-dev @types/bcrypt

# Generate Prisma Client after schema changes
npx prisma generate

# If you need to reset the database (development only)
npx prisma migrate reset
```

---

## Frontend Integration Checklist

### Add Student Form
- [x] Form created at `frontend/src/app/admin/add-student/page.tsx`
- [x] Fetches degrees from `/api/degrees`
- [x] Posts to `/api/admin/users`
- [ ] Add error handling for duplicate enrollment numbers
- [ ] Add success redirect to student list

### Add Degree Form
- [x] Form created at `frontend/src/app/admin/add-degree/page.tsx`
- [x] Posts to `/api/degrees`
- [ ] Add error handling for duplicate codes
- [ ] Add success redirect to degrees list

### Student Timetable View
- [ ] Create component at `frontend/src/app/dashboard/timetable/page.tsx`
- [ ] Fetch from `/api/timetable/user`
- [ ] Display by day of week
- [ ] Show room, subject, type

### Admin Features
- [ ] Student list view - fetch from `/api/admin/users`, paginated
- [ ] Degree list view - fetch from `/api/degrees`, with edit/delete
- [ ] Timetable management - create/edit/delete entries
- [ ] Message form - send to specific degree or all users

---

## Testing API Endpoints

### Test with cURL

```bash
# Get all degrees
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/degrees

# Create degree (admin)
curl -X POST http://localhost:3000/api/degrees \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "BTech", "code": "BTECH"}'

# Get subjects by degree
curl -H "Authorization: Bearer TOKEN" "http://localhost:3000/api/subjects?degreeId=DEGREE_ID"

# Get user timetable
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/timetable/user

# Get degree timetable
curl -H "Authorization: Bearer TOKEN" "http://localhost:3000/api/timetable/degree?degreeId=DEGREE_ID"

# Get notifications
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/notifications

# Mark notification as read
curl -X PATCH http://localhost:3000/api/notifications/NOTIF_ID/read \
  -H "Authorization: Bearer TOKEN"
```

---

## Deployment Checklist

- [ ] Database migration executed successfully
- [ ] All modules registered in app.module.ts
- [ ] bcrypt installed and imported
- [ ] Admin endpoints secured with role checks
- [ ] Frontend forms pointing to correct API endpoints
- [ ] Environment variables set (JWT_SECRET, DATABASE_URL)
- [ ] Backend builds without errors: `npm run build`
- [ ] Frontend builds without errors: `npm run build`

---

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
npx prisma generate
```

### Prisma migration fails
Check DATABASE_MIGRATION_SETUP.md for detailed steps

### JWT token issues
Ensure JWT_SECRET in .env matches the one in backend

### CORS errors
Check FRONTEND_URL in .env matches actual frontend URL

---

## Next Implementation Phases

### Phase 2: Real-time Updates
- WebSocket integration for live notifications
- Broadcasting timetable updates to all students
- Real-time message delivery

### Phase 3: AI Features
- OCR image upload for bulk timetable import
- AI study plan generation from timetable
- Smart notifications based on exam proximity

### Phase 4: Advanced Features
- Mobile app integration
- Email notifications
- Calendar integration
- Study streak tracking
