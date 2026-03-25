import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma.service';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
