import { Module } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { TimetableController } from './timetable.controller';
import { PrismaService } from '@libs/database/prisma.service';
import { NotificationService } from '@modules/notification/notification.service';

@Module({
  controllers: [TimetableController],
  providers: [TimetableService, PrismaService, NotificationService],
  exports: [TimetableService],
})
export class TimetableModule {}
