import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma.service';
import { UpdateUserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createStudent(createUserDto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { enrollmentNumber: createUserDto.enrollmentNumber },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException('Enrollment number already exists');
    }

    const degree = await this.prisma.degree.findUnique({
      where: { id: createUserDto.degreeId },
      select: { id: true },
    });

    if (!degree) {
      throw new NotFoundException('Degree not found');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        enrollmentNumber: createUserDto.enrollmentNumber,
        password: hashedPassword,
        degreeId: createUserDto.degreeId,
        semester: createUserDto.semester,
        department: createUserDto.section,
        role: 'STUDENT',
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        enrollmentNumber: true,
        semester: true,
        degreeId: true,
        department: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        enrollmentNumber: true,
        name: true,
        course: true,
        department: true,
        semester: true,
        profilePicture: true,
        lastLogin: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
      select: {
        id: true,
        enrollmentNumber: true,
        name: true,
        course: true,
        department: true,
        semester: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async getUserStats(userId: string) {
    const [subjects, exams, topics, completedTopics, studyPlans] = await Promise.all([
      this.prisma.subject.count({ where: { userId } }),
      this.prisma.exam.count({ where: { userId } }),
      this.prisma.topic.count({ where: { userId } }),
      this.prisma.topic.count({ where: { userId, isCompleted: true } }),
      this.prisma.studyPlan.count({ where: { userId, isActive: true } }),
    ]);

    return {
      subjects,
      exams,
      topics,
      completedTopics,
      completionPercentage: topics > 0 ? (completedTopics / topics) * 100 : 0,
      activeStudyPlans: studyPlans,
    };
  }
  
  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async deleteAccount(userId: string) {
    // Delete all user data
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'Account deleted successfully' };
  }
}
