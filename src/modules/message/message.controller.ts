import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('admin/message')
  async sendMessage(
    @CurrentUser() user: { id: string; role?: string },
    @Body() createMessageDto: CreateMessageDto,
  ) {
    if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only admins can send messages');
    }

    return this.messageService.sendMessage(createMessageDto);
  }

  @Get('student/messages')
  async getStudentMessages(@CurrentUser() user: { id: string; role?: string }) {
    if (!user?.id) {
      throw new ForbiddenException('Invalid user context');
    }

    return this.messageService.getStudentMessages(user.id);
  }

  @Patch('student/messages/:id/read')
  async markStudentMessageAsRead(
    @CurrentUser() user: { id: string; role?: string },
    @Param('id') id: string,
  ) {
    if (!user?.id) {
      throw new ForbiddenException('Invalid user context');
    }

    return this.messageService.markMessageAsRead(user.id, id);
  }

  @Get('admin/messages')
  async getAdminMessages(@CurrentUser() user: { id: string; role?: string }) {
    if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only admins can view message history');
    }

    return this.messageService.getAdminMessages();
  }
}
