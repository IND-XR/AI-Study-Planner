import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { NotificationService } from '@modules/notification/notification.service';
import { CreateCalendarHeadingDto } from './dto/create-calendar-heading.dto';
import { ReorderCalendarHeadingsDto } from './dto/reorder-calendar-headings.dto';
import { CalendarHeadingTag } from '@prisma/client';

@Injectable()
export class TimetableService {
  private readonly logger = new Logger(TimetableService.name);

  private extractSectionFromNotes(notes?: string | null): string | null {
    if (!notes) {
      return null;
    }

    const match = notes.match(/SECTION:([^|]+)/i);
    return match?.[1]?.trim()?.toUpperCase() || null;
  }

  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async createTimetable(dto: CreateTimetableDto) {
    const degree = await this.prisma.degree.findUnique({
      where: { id: dto.degreeId },
    });

    if (!degree) {
      throw new NotFoundException('Degree not found');
    }

    const timetable = await this.prisma.adminTimetable.create({
      data: {
        degreeId: dto.degreeId,
        day: dto.day,
        subject: dto.subject,
        time: `${dto.startTime}-${dto.endTime}`,
        room: dto.room,
        type: dto.type,
        notes: dto.section ? `SECTION:${dto.section.toUpperCase()}` : null,
      },
    });

    // Send notification to all students of this degree
    await this.notifyDegreeStudents(
      dto.degreeId,
      'Timetable Updated',
      `New timetable entry added for ${dto.day}: ${dto.subject} at ${dto.room}${dto.section ? ` (Section ${dto.section.toUpperCase()})` : ''}`,
    );

    this.logger.log(`Timetable created for degree: ${degree.name}${dto.section ? ` section ${dto.section.toUpperCase()}` : ''}`);
    return timetable;
  }

  async updateTimetable(id: string, dto: CreateTimetableDto) {
    const existing = await this.prisma.adminTimetable.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Timetable entry not found');
    }

    const degree = await this.prisma.degree.findUnique({
      where: { id: dto.degreeId },
    });

    if (!degree) {
      throw new NotFoundException('Degree not found');
    }

    const updated = await this.prisma.adminTimetable.update({
      where: { id },
      data: {
        degreeId: dto.degreeId,
        day: dto.day,
        subject: dto.subject,
        time: `${dto.startTime}-${dto.endTime}`,
        room: dto.room,
        type: dto.type,
        notes: dto.section ? `SECTION:${dto.section.toUpperCase()}` : null,
      },
    });

    await this.notifyDegreeStudents(
      dto.degreeId,
      'Timetable Updated',
      `Timetable entry updated for ${dto.day}: ${dto.subject} at ${dto.room}${dto.section ? ` (Section ${dto.section.toUpperCase()})` : ''}`,
    );

    this.logger.log(`Timetable updated: ${updated.id} for degree ${degree.name}`);
    return updated;
  }

  async deleteTimetable(id: string) {
    const existing = await this.prisma.adminTimetable.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Timetable entry not found');
    }

    await this.prisma.adminTimetable.delete({
      where: { id },
    });

    this.logger.log(`Timetable deleted: ${id}`);
    return { success: true };
  }

  async getTimetableByDegree(degreeId: string) {
    const degree = await this.prisma.degree.findUnique({
      where: { id: degreeId },
    });

    if (!degree) {
      throw new NotFoundException('Degree not found');
    }

    const entries = await this.prisma.adminTimetable.findMany({
      where: { degreeId },
      orderBy: { day: 'asc' },
    });

    return entries.map((entry) => ({
      ...entry,
      section: this.extractSectionFromNotes(entry.notes) ?? 'ALL',
    }));
  }

  async getTimetableForUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { degree: true },
    });

    if (!user || !user.degreeId) {
      throw new NotFoundException('User or degree not found');
    }

    const entries = await this.prisma.adminTimetable.findMany({
      where: { degreeId: user.degreeId },
      orderBy: { day: 'asc' },
    });

    const userSection = user.department?.trim().toUpperCase();

    const withSection = entries.map((entry) => ({
      ...entry,
      section: this.extractSectionFromNotes(entry.notes) ?? 'ALL',
    }));

    if (!userSection) {
      return withSection;
    }

    return withSection.filter((entry) => entry.section === 'ALL' || entry.section === userSection);
  }

  async getCalendarHeadingsForMonth(userId: string, month: number, year: number) {
    if (month < 1 || month > 12) {
      throw new BadRequestException('month must be between 1 and 12');
    }

    const monthStart = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const monthEnd = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

    return this.prisma.calendarHeading.findMany({
      where: {
        userId,
        date: {
          gte: monthStart,
          lt: monthEnd,
        },
      },
      orderBy: [{ date: 'asc' }, { position: 'asc' }],
    });
  }

  async createCalendarHeading(userId: string, dto: CreateCalendarHeadingDto) {
    const date = new Date(`${dto.date}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date');
    }

    const existing = await this.prisma.calendarHeading.findMany({
      where: {
        userId,
        date,
      },
      select: { position: true },
      orderBy: { position: 'desc' },
      take: 1,
    });

    const nextPosition = existing.length > 0 ? existing[0].position + 1 : 0;
    const tag = dto.tag ?? this.inferCalendarHeadingTag(dto.title);

    return this.prisma.calendarHeading.create({
      data: {
        userId,
        date,
        title: dto.title.trim(),
        tag,
        position: nextPosition,
      },
    });
  }

  private inferCalendarHeadingTag(title: string): CalendarHeadingTag {
    const normalized = title.toLowerCase();

    if (/\b(exam|test|midterm|revision|revisioning|paper)\b/.test(normalized)) {
      return CalendarHeadingTag.EXAM;
    }

    if (/\b(code|coding|program|programming|dsa|react|node|java|python|sql)\b/.test(normalized)) {
      return CalendarHeadingTag.CODING;
    }

    if (/\b(study|learn|read|practice|assignment|homework|notes|prep|prepare)\b/.test(normalized)) {
      return CalendarHeadingTag.STUDY;
    }

    return CalendarHeadingTag.OTHER;
  }

  async reorderCalendarHeadings(userId: string, dto: ReorderCalendarHeadingsDto) {
    const date = new Date(`${dto.date}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date');
    }

    const headings = await this.prisma.calendarHeading.findMany({
      where: {
        userId,
        date,
      },
      select: { id: true },
    });

    const existingIds = headings.map((heading) => heading.id).sort();
    const incomingIds = [...dto.headingIds].sort();

    if (existingIds.length !== incomingIds.length || existingIds.join('|') !== incomingIds.join('|')) {
      throw new BadRequestException('headingIds must exactly match headings for the selected date');
    }

    await this.prisma.$transaction(
      dto.headingIds.map((headingId, index) =>
        this.prisma.calendarHeading.update({
          where: { id: headingId },
          data: { position: index },
        }),
      ),
    );

    return this.prisma.calendarHeading.findMany({
      where: {
        userId,
        date,
      },
      orderBy: { position: 'asc' },
    });
  }

  async deleteCalendarHeading(userId: string, headingId: string) {
    const heading = await this.prisma.calendarHeading.findUnique({
      where: { id: headingId },
      select: { id: true, userId: true, date: true },
    });

    if (!heading || heading.userId !== userId) {
      throw new NotFoundException('Heading not found');
    }

    await this.prisma.calendarHeading.delete({
      where: { id: headingId },
    });

    const remaining = await this.prisma.calendarHeading.findMany({
      where: {
        userId,
        date: heading.date,
      },
      orderBy: { position: 'asc' },
      select: { id: true },
    });

    await this.prisma.$transaction(
      remaining.map((item, index) =>
        this.prisma.calendarHeading.update({
          where: { id: item.id },
          data: { position: index },
        }),
      ),
    );

    return { success: true };
  }

  async notifyDegreeStudents(degreeId: string, title: string, message: string) {
    const students = await this.prisma.user.findMany({
      where: { degreeId },
    });

    for (const student of students) {
      await this.notificationService.createNotification({
        userId: student.id,
        title,
        message,
        type: 'timetable_update',
      });
    }
  }
}
