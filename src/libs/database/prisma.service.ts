import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('✓ Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('✓ Database disconnected');
  }

  async reset() {
    // Reset database (for development/testing)
    await this.$transaction([
      this.progressRecord.deleteMany(),
      this.studyPlanItem.deleteMany(),
      this.studyPlan.deleteMany(),
      this.topic.deleteMany(),
      this.exam.deleteMany(),
      this.subject.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
