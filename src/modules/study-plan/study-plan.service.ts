import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma.service';
import { EmailService } from '@libs/email/email.service';
import { GenerateStudyPlanDto } from './dto/study-plan.dto';
import { StudentPlanGenerator } from './services/study-plan-generator.service';
import { generateStudyPlan } from './utils/study-plan-algorithm';

@Injectable()
export class StudyPlanService {
  private readonly logger = new Logger(StudyPlanService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private planGenerator: StudentPlanGenerator,
  ) {}

  async generatePlan(userId: string, generatePlanDto: GenerateStudyPlanDto) {
    // Fetch all exams and topics for the user
    const exams = await this.prisma.exam.findMany({
      where: { userId },
      include: {
        topics: {
          select: {
            id: true,
            name: true,
            estimatedHours: true,
            difficulty: true,
            priority: true,
          },
        },
      },
    });

    if (exams.length === 0) {
      throw new BadRequestException('No exams found. Please add exams first.');
    }

    // Filter exams that fall within the study period
    const relevantExams = exams.filter(
      exam => 
        exam.examinationDate >= generatePlanDto.startDate &&
        exam.examinationDate <= generatePlanDto.endDate
    );

    if (relevantExams.length === 0) {
      throw new BadRequestException('No exams found within the specified date range');
    }

    // Generate study plan using algorithm
    const studyPlan = await generateStudyPlan(
      userId,
      relevantExams,
      generatePlanDto,
      this.prisma
    );

    // Save study plan to database
    const createdPlan = await this.prisma.studyPlan.create({
      data: {
        userId,
        startDate: generatePlanDto.startDate,
        endDate: generatePlanDto.endDate,
        totalDailyHours: generatePlanDto.totalDailyHours,
        totalWeeklyHours: generatePlanDto.totalWeeklyHours || generatePlanDto.totalDailyHours * 7,
        isActive: true,
      },
    });

    // Add study plan items
    await this.prisma.studyPlanItem.createMany({
      data: studyPlan.items.map(item => ({
        ...item,
        studyPlanId: createdPlan.id,
      })),
    });

    this.logger.log(`Study plan generated for user ${userId}`);

    // Send notification email
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const planSummary = this.generatePlanSummary(studyPlan);
      
      if (user) {
        // Email functionality can be implemented when email field is added back
        // For now, just log the notification
        this.logger.log(`Study plan created for user: ${user.name} (${user.enrollmentNumber})`);
      }
    } catch (error) {
      this.logger.error('Failed to send study plan notification:', error);
    }

    return {
      id: createdPlan.id,
      startDate: createdPlan.startDate,
      endDate: createdPlan.endDate,
      totalDailyHours: createdPlan.totalDailyHours,
      itemsCount: studyPlan.items.length,
      message: 'Study plan generated successfully',
    };
  }

  async findAll(userId: string) {
    return this.prisma.studyPlan.findMany({
      where: { userId },
      include: {
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const plan = await this.prisma.studyPlan.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: {
            exam: { select: { name: true } },
            topic: { select: { name: true, difficulty: true } },
          },
          orderBy: { scheduledDate: 'asc' },
        },
      },
    });

    if (!plan) {
      throw new NotFoundException('Study plan not found');
    }

    return plan;
  }

  async activatePlan(userId: string, id: string) {
    const plan = await this.prisma.studyPlan.findFirst({
      where: { id, userId },
    });

    if (!plan) {
      throw new NotFoundException('Study plan not found');
    }

    // Deactivate other plans
    await this.prisma.studyPlan.updateMany({
      where: { userId, isActive: true, NOT: { id } },
      data: { isActive: false }
    });

    // Activate this plan
    return this.prisma.studyPlan.update({
      where: { id },
      data: { isActive: true }
    });
  }

  async getActivePlan(userId: string) {
    return this.prisma.studyPlan.findFirst({
      where: { userId, isActive: true },
      include: {
        items: {
          include: {
            topic: { select: { name: true, difficulty: true } },
            exam: { select: { name: true } },
          },
          orderBy: { scheduledDate: 'asc' },
        },
      },
    });
  }

  async getPlanProgress(userId: string, id: string) {
    const plan = await this.prisma.studyPlan.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: { topic: true },
        },
      },
    });

    if (!plan) {
      throw new NotFoundException('Study plan not found');
    }

    const totalItems = plan.items.length;
    const completedItems = plan.items.filter(item => item.isCompleted).length;
    const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    const totalAllocatedHours = plan.items.reduce((sum, item) => sum + item.allocatedHours, 0);
    const totalCompletedHours = plan.items.reduce((sum, item) => sum + item.completedHours, 0);

    return {
      planId: plan.id,
      startDate: plan.startDate,
      endDate: plan.endDate,
      totalItems,
      completedItems,
      completionPercentage,
      totalAllocatedHours,
      totalCompletedHours,
      hoursProgress: totalAllocatedHours > 0 ? (totalCompletedHours / totalAllocatedHours) * 100 : 0,
      isActive: plan.isActive,
    };
  }

  private generatePlanSummary(plan: any): string {
    const examsByDate = plan.items.reduce((acc, item) => {
      const date = new Date(item.scheduledDate).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});

    const summary = Object.entries(examsByDate)
      .map(([date, items]: any) => {
        const totalHours = items.reduce((sum, item) => sum + item.allocatedHours, 0);
        const topicNames = items.map(item => item.topic?.name || 'Unknown').join(', ');
        return `${date}: ${topicNames} (${totalHours.toFixed(1)} hours)`;
      })
      .join('\n');

    return summary;
  }
}
