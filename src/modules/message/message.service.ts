import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async sendMessage(createMessageDto: CreateMessageDto) {
    if (!createMessageDto.sendToAll && !createMessageDto.degreeId) {
      throw new BadRequestException('degreeId is required when sendToAll is false');
    }

    if (createMessageDto.sendToAll) {
      return this.prisma.message.create({
        data: {
          title: createMessageDto.title,
          content: createMessageDto.content,
          type: 'message',
        },
      });
    }

    const degree = await this.prisma.degree.findUnique({
      where: { id: createMessageDto.degreeId },
      select: { id: true },
    });

    if (!degree) {
      throw new NotFoundException('Degree not found');
    }

    return this.prisma.message.create({
      data: {
        title: createMessageDto.title,
        content: createMessageDto.content,
        type: 'message',
        degreeId: createMessageDto.degreeId,
      },
    });
  }

  async getStudentMessages(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, degreeId: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const messages = await this.prisma.message.findMany({
      include: {
        reads: {
          where: { userId },
          select: { id: true, messageId: true, userId: true, readAt: true },
        },
      },
      where: {
        OR: [
          // Direct message (future-ready)
          { userId: user.id },
          // Degree-targeted message
          ...(user.degreeId ? [{ degreeId: user.degreeId }] : []),
          // Broadcast message to all users
          { userId: null, degreeId: null },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return messages.map((message) => ({
      ...message,
      isRead: message.reads.length > 0,
    }));
  }

  async getAdminMessages() {
    return this.prisma.message.findMany({
      include: {
        degree: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markMessageAsRead(userId: string, messageId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, degreeId: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { id: true, userId: true, degreeId: true },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const canAccess =
      message.userId === userId ||
      (!message.userId && !message.degreeId) ||
      (message.degreeId && message.degreeId === user.degreeId);

    if (!canAccess) {
      throw new NotFoundException('Message not found');
    }

    return this.prisma.messageRead.upsert({
      where: {
        messageId_userId: {
          messageId,
          userId,
        },
      },
      update: {
        readAt: new Date(),
      },
      create: {
        messageId,
        userId,
      },
    });
  }
}
