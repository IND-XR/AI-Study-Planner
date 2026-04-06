import { Module } from '@nestjs/common';
import { PrismaModule } from '@libs/database/prisma.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [PrismaModule],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
