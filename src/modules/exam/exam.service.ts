import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma.service';
import { CreateExamDto, UpdateExamDto } from './dto/exam.dto';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createExamDto: CreateExamDto) {
    // Verify subject exists and belongs to user
    const subject = await this.prisma.subject.findFirst({
      where: { id: createExamDto.subjectId, userId },
    });

    if (!subject) {
      throw new BadRequestException('Subject not found');
    }

    return this.prisma.exam.create({
      data: {
        userId,
        ...createExamDto,
      },
    });
  }

  async findAll(userId: string, subjectId?: string) {
    return this.prisma.exam.findMany({
      where: {
        userId,
        ...(subjectId && { subjectId }),
      },
      include: {
        subject: { select: { name: true } },
        _count: { select: { topics: true } },
      },
      orderBy: { examinationDate: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const exam = await this.prisma.exam.findFirst({
      where: { id, userId },
      include: {
        subject: { select: { name: true } },
        topics: {
          select: { id: true, name: true, difficulty: true, isCompleted: true, estimatedHours: true },
        },
      },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    return exam;
  }

  async update(userId: string, id: string, updateExamDto: UpdateExamDto) {
    const exam = await this.prisma.exam.findFirst({
      where: { id, userId },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    return this.prisma.exam.update({
      where: { id },
      data: updateExamDto,
    });
  }

  async remove(userId: string, id: string) {
    const exam = await this.prisma.exam.findFirst({
      where: { id, userId },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    return this.prisma.exam.delete({
      where: { id },
    });
  }

  async getExamStats(userId: string, id: string) {
    const exam = await this.prisma.exam.findFirst({
      where: { id, userId },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    const topics = await this.prisma.topic.findMany({
      where: { examId: id },
      select: { estimatedHours: true, isCompleted: true },
    });

    const totalEstimatedHours = topics.reduce((sum, t) => sum + t.estimatedHours, 0);
    const completedTopics = topics.filter(t => t.isCompleted).length;

    return {
      examName: exam.name,
      examType: exam.type,
      examinationDate: exam.examinationDate,
      totalTopics: topics.length,
      completedTopics,
      completionPercentage: topics.length > 0 ? (completedTopics / topics.length) * 100 : 0,
      totalEstimatedHours,
      targetScore: exam.targetScore,
      actualScore: exam.actualScore,
      isCompleted: exam.isCompleted,
      weightage: exam.weightage,
    };
  }

  async getUpcomingExams(userId: string, days: number = 30) {
    const fromDate = new Date();
    const toDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    return this.prisma.exam.findMany({
      where: {
        userId,
        examinationDate: {
          gte: fromDate,
          lte: toDate,
        },
      },
      include: {
        subject: { select: { name: true } },
      },
      orderBy: { examinationDate: 'asc' },
    });
  }
}
