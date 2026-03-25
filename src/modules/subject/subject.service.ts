import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma.service';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createSubjectDto: CreateSubjectDto) {
    // Check for duplicate
    const existing = await this.prisma.subject.findFirst({
      where: {
        userId,
        name: createSubjectDto.name,
        academicYear: createSubjectDto.academicYear,
      },
    });

    if (existing) {
      throw new ConflictException('Subject already exists with this name in the academic year');
    }

    return this.prisma.subject.create({
      data: {
        userId,
        ...createSubjectDto,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.subject.findMany({
      where: { userId, isActive: true },
      include: {
        _count: {
          select: { exams: true, topics: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const subject = await this.prisma.subject.findFirst({
      where: { id, userId },
      include: {
        exams: {
          select: { id: true, name: true, type: true, examinationDate: true },
        },
        topics: {
          select: { id: true, name: true, difficulty: true, isCompleted: true },
        },
      },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return subject;
  }

  async update(userId: string, id: string, updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.prisma.subject.findFirst({
      where: { id, userId },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return this.prisma.subject.update({
      where: { id },
      data: updateSubjectDto,
    });
  }

  async remove(userId: string, id: string) {
    const subject = await this.prisma.subject.findFirst({
      where: { id, userId },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    // Soft delete
    return this.prisma.subject.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getSubjectStats(userId: string, id: string) {
    const subject = await this.prisma.subject.findFirst({
      where: { id, userId },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    const [exams, topics, completedTopics] = await Promise.all([
      this.prisma.exam.count({ where: { subjectId: id } }),
      this.prisma.topic.count({ where: { subjectId: id } }),
      this.prisma.topic.count({ where: { subjectId: id, isCompleted: true } }),
    ]);

    return {
      subjectName: subject.name,
      exams,
      topics,
      completedTopics,
      completionPercentage: topics > 0 ? (completedTopics / topics) * 100 : 0,
      priority: subject.priority,
    };
  }
}
