import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma.service';
import { CreateProgressRecordDto, UpdateProgressRecordDto } from './dto/progress.dto';
import { subDays, startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class ProgressService {
  private readonly logger = new Logger(ProgressService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, createProgressDto: CreateProgressRecordDto) {
    // Verify topic exists
    const topic = await this.prisma.topic.findFirst({
      where: { id: createProgressDto.topicId, userId },
    });

    if (!topic) {
      throw new BadRequestException('Topic not found');
    }

    const progressRecord = await this.prisma.progressRecord.create({
      data: {
        userId,
        ...createProgressDto,
      },
    });

    this.logger.log(`Progress recorded for user ${userId}: ${topic.name}`);

    return progressRecord;
  }

  async findAll(userId: string, topicId?: string, fromDate?: Date, toDate?: Date) {
    return this.prisma.progressRecord.findMany({
      where: {
        userId,
        ...(topicId && { topicId }),
        ...(fromDate && { studyDate: { gte: fromDate } }),
        ...(toDate && { studyDate: { lte: toDate } }),
      },
      include: {
        topic: { select: { name: true, difficulty: true } },
      },
      orderBy: { studyDate: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const record = await this.prisma.progressRecord.findFirst({
      where: { id, userId },
      include: {
        topic: { select: { name: true } },
      },
    });

    if (!record) {
      throw new NotFoundException('Progress record not found');
    }

    return record;
  }

  async update(userId: string, id: string, updateProgressDto: UpdateProgressRecordDto) {
    const record = await this.prisma.progressRecord.findFirst({
      where: { id, userId },
    });

    if (!record) {
      throw new NotFoundException('Progress record not found');
    }

    return this.prisma.progressRecord.update({
      where: { id },
      data: updateProgressDto,
    });
  }

  async remove(userId: string, id: string) {
    const record = await this.prisma.progressRecord.findFirst({
      where: { id, userId },
    });

    if (!record) {
      throw new NotFoundException('Progress record not found');
    }

    return this.prisma.progressRecord.delete({
      where: { id },
    });
  }

  /**
   * Get daily study statistics
   */
  async getDailyStats(userId: string, date: Date = new Date()) {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const records = await this.prisma.progressRecord.findMany({
      where: {
        userId,
        studyDate: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
      include: {
        topic: { select: { name: true, difficulty: true } },
      },
    });

    const totalHours = records.reduce((sum, r) => sum + r.hoursSpent, 0);
    const averageConfidence = this.calculateAverageConfidence(records);
    const averageRating = this.calculateAverageRating(records);

    return {
      date,
      totalHours,
      sessionCount: records.length,
      topicsStudied: [...new Set(records.map(r => r.topicId))].length,
      averageConfidence,
      averageRating,
      sessions: records.map(r => ({
        id: r.id,
        topic: r.topic.name,
        difficulty: r.topic.difficulty,
        hoursSpent: r.hoursSpent,
        confidenceLevel: r.confidenceLevel,
        rating: r.rating,
      })),
    };
  }

  /**
   * Get weekly study statistics
   */
  async getWeeklyStats(userId: string, endDate: Date = new Date()) {
    const weekStart = subDays(endDate, 7);

    const records = await this.prisma.progressRecord.findMany({
      where: {
        userId,
        studyDate: {
          gte: weekStart,
          lte: endDate,
        },
      },
      include: {
        topic: { select: { name: true } },
      },
    });

    const dailyBreakdown = new Map<string, any>();

    records.forEach(record => {
      const date = record.studyDate.toISOString().split('T')[0];
      if (!dailyBreakdown.has(date)) {
        dailyBreakdown.set(date, {
          date,
          hours: 0,
          sessions: 0,
          averageRating: 0,
        });
      }

      const dayData = dailyBreakdown.get(date);
      dayData.hours += record.hoursSpent;
      dayData.sessions += 1;
      dayData.averageRating = (dayData.averageRating + (record.rating || 0)) / 2;
    });

    const totalHours = records.reduce((sum, r) => sum + r.hoursSpent, 0);
    const averageDaily = totalHours / 7;

    return {
      weekStart,
      weekEnd: endDate,
      totalHours,
      averageDailyHours: averageDaily,
      dayCount: dailyBreakdown.size,
      dailyBreakdown: Array.from(dailyBreakdown.values()),
      topTopics: this.getTopTopics(records, 5),
    };
  }

  /**
   * Get monthly study statistics
   */
  async getMonthlyStats(userId: string, month: number, year: number) {
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    const records = await this.prisma.progressRecord.findMany({
      where: {
        userId,
        studyDate: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      include: {
        topic: { select: { name: true, difficulty: true } },
      },
    });

    const totalHours = records.reduce((sum, r) => sum + r.hoursSpent, 0);
    const studyDays = new Set(records.map(r => r.studyDate.toISOString().split('T')[0])).size;

    return {
      month,
      year,
      totalHours,
      averageDaily: studyDays > 0 ? totalHours / studyDays : 0,
      studyDays,
      totalSessions: records.length,
      consistency: studyDays > 0 ? (studyDays / 30) * 100 : 0, // Percentage of days studied
      topDifficulties: this.getTopDifficulties(records),
      topTopics: this.getTopTopics(records, 10),
    };
  }

  /**
   * Get study streaks
   */
  async getStudyStreaks(userId: string) {
    const allRecords = await this.prisma.progressRecord.findMany({
      where: { userId },
      distinct: ['studyDate'],
      orderBy: { studyDate: 'desc' },
      select: { studyDate: true },
    });

    if (allRecords.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const studyDates = allRecords.map(r => new Date(r.studyDate).toISOString().split('T')[0]);
    const uniqueDates = [...new Set(studyDates)].sort().reverse();

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    let lastDate: Date | null = null;

    for (const dateStr of uniqueDates) {
      const currentDate = new Date(dateStr);

      if (lastDate === null) {
        tempStreak = 1;
        currentStreak = 1;
      } else {
        const daysDiff = Math.floor((lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          tempStreak++;
          currentStreak = tempStreak;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
          currentStreak = tempStreak;
        }
      }

      lastDate = currentDate;
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  }

  /**
   * Helper: Calculate average confidence level
   */
  private calculateAverageConfidence(records: any[]): string | null {
    const confidenceRecords = records.filter(r => r.confidenceLevel);
    if (confidenceRecords.length === 0) return null;

    const confidenceLevels = {
      VERY_WEAK: 1,
      WEAK: 2,
      NEUTRAL: 3,
      CONFIDENT: 4,
      VERY_CONFIDENT: 5,
    };

    const average = confidenceRecords.reduce((sum, r) => sum + (confidenceLevels[r.confidenceLevel] || 0), 0) / confidenceRecords.length;
    const reverseLookup = Object.entries(confidenceLevels).find(([, v]) => v === Math.round(average));
    return reverseLookup ? reverseLookup[0] : null;
  }

  /**
   * Helper: Calculate average rating
   */
  private calculateAverageRating(records: any[]): number {
    const ratingRecords = records.filter(r => r.rating);
    if (ratingRecords.length === 0) return 0;
    return ratingRecords.reduce((sum, r) => sum + r.rating, 0) / ratingRecords.length;
  }

  /**
   * Helper: Get top topics by hours spent
   */
  private getTopTopics(records: any[], limit: number) {
    const topicStats = new Map<string, number>();

    records.forEach(r => {
      const current = topicStats.get(r.topic.name) || 0;
      topicStats.set(r.topic.name, current + r.hoursSpent);
    });

    return Array.from(topicStats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([name, hours]) => ({ name, hours }));
  }

  /**
   * Helper: Get difficulty distribution
   */
  private getTopDifficulties(records: any[]) {
    const difficultyStats = new Map<string, number>();

    records.forEach(r => {
      const current = difficultyStats.get(r.topic.difficulty) || 0;
      difficultyStats.set(r.topic.difficulty, current + r.hoursSpent);
    });

    return Object.fromEntries(difficultyStats);
  }
}
