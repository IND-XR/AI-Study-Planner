import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { NotificationService } from '@modules/notification/notification.service';

@Injectable()
export class TimetableService {
  private readonly logger = new Logger(TimetableService.name);

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
      },
    });

    // Send notification to all students of this degree
    await this.notifyDegreeStudents(
      dto.degreeId,
      'Timetable Updated',
      `New timetable entry added for ${dto.day}: ${dto.subject} at ${dto.room}`,
    );

    this.logger.log(`Timetable created for degree: ${degree.name}`);
    return timetable;
  }

  async getTimetableByDegree(degreeId: string) {
    const degree = await this.prisma.degree.findUnique({
      where: { id: degreeId },
    });

    if (!degree) {
      throw new NotFoundException('Degree not found');
    }

    return this.prisma.adminTimetable.findMany({
      where: { degreeId },
      orderBy: { day: 'asc' },
    });
  }

  async getTimetableForUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { degree: true },
    });

    if (!user || !user.degreeId) {
      throw new NotFoundException('User or degree not found');
    }

    return this.prisma.adminTimetable.findMany({
      where: { degreeId: user.degreeId },
      orderBy: { day: 'asc' },
    });
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
