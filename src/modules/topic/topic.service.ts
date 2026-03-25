import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma.service';
import { CreateTopicDto, UpdateTopicDto } from './dto/topic.dto';

@Injectable()
export class TopicService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTopicDto: CreateTopicDto) {
    // Verify exam exists and belongs to user
    const exam = await this.prisma.exam.findFirst({
      where: { id: createTopicDto.examId, userId },
      include: { subject: true },
    });

    if (!exam) {
      throw new BadRequestException('Exam not found');
    }

    return this.prisma.topic.create({
      data: {
        userId,
        subjectId: exam.subjectId,
        ...createTopicDto,
      },
    });
  }

  async findAll(userId: string, examId?: string, difficulty?: string) {
    return this.prisma.topic.findMany({
      where: {
        userId,
        ...(examId && { examId }),
        ...(difficulty && { difficulty: difficulty as any }),
      },
      include: {
        exam: { select: { name: true } },
        subject: { select: { name: true } },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(userId: string, id: string) {
    const topic = await this.prisma.topic.findFirst({
      where: { id, userId },
      include: {
        exam: { select: { name: true, examinationDate: true } },
        subject: { select: { name: true } },
        progressRecords: {
          select: { hoursSpent: true, confidenceLevel: true, studyDate: true },
          orderBy: { studyDate: 'desc' },
          take: 10,
        },
      },
    });

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    return topic;
  }

  async update(userId: string, id: string, updateTopicDto: UpdateTopicDto) {
    const topic = await this.prisma.topic.findFirst({
      where: { id, userId },
    });

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    return this.prisma.topic.update({
      where: { id },
      data: {
        ...updateTopicDto,
        completedAt: updateTopicDto.isCompleted && !topic.isCompleted ? new Date() : topic.completedAt,
      },
    });
  }

  async remove(userId: string, id: string) {
    const topic = await this.prisma.topic.findFirst({
      where: { id, userId },
    });

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    return this.prisma.topic.delete({
      where: { id },
    });
  }

  async getTopicProgress(userId: string, id: string) {
    const topic = await this.prisma.topic.findFirst({
      where: { id, userId },
      include: { exam: true },
    });

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    const progressRecords = await this.prisma.progressRecord.findMany({
      where: { topicId: id },
      orderBy: { studyDate: 'desc' },
    });

    const totalHours = progressRecords.reduce((sum, r) => sum + r.hoursSpent, 0);
    const averageConfidence = progressRecords.length > 0
      ? progressRecords.filter(r => r.confidenceLevel).length / progressRecords.length * 100
      : 0;

    const isOverdue = topic.exam && topic.exam.examinationDate < new Date() && !topic.isCompleted;

    return {
      topicName: topic.name,
      difficulty: topic.difficulty,
      estimatedHours: topic.estimatedHours,
      actualHours: totalHours,
      isCompleted: topic.isCompleted,
      completedAt: topic.completedAt,
      isOverdue,
      recentProgress: progressRecords.slice(0, 5),
      totalStudySessions: progressRecords.length,
      averageConfidence,
    };
  }

  async getWeakTopics(userId: string, limit: number = 10) {
    return this.prisma.topic.findMany({
      where: {
        userId,
        difficulty: 'WEAK',
        isCompleted: false,
      },
      include: {
        exam: { select: { name: true, examinationDate: true } },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
      take: limit,
    });
  }

  async getMasteredTopics(userId: string, limit: number = 10) {
    return this.prisma.topic.findMany({
      where: {
        userId,
        difficulty: 'STRONG',
        isCompleted: true,
      },
      orderBy: { completedAt: 'desc' },
      take: limit,
    });
  }
}
