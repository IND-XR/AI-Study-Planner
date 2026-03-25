import { Module } from '@nestjs/common';
import { StudyPlanService } from './study-plan.service';
import { StudyPlanController } from './study-plan.controller';
import { StudentPlanGenerator } from './services/study-plan-generator.service';
import { PrismaModule } from '@libs/database/prisma.module';
import { EmailModule } from '@libs/email/email.module';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [StudyPlanController],
  providers: [StudyPlanService, StudentPlanGenerator],
  exports: [StudyPlanService],
})
export class StudyPlanModule {}
