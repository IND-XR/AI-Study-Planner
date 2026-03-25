import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { TopicService } from './topic.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CreateTopicDto, UpdateTopicDto } from './dto/topic.dto';

@Controller('topics')
@UseGuards(JwtAuthGuard)

export class TopicController {
  constructor(private topicService: TopicService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createTopicDto: CreateTopicDto) {
    return this.topicService.create(user.id, createTopicDto);
  }

  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('examId') examId?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    return this.topicService.findAll(user.id, examId, difficulty);
  }

  @Get('weak-topics')
  getWeakTopics(@CurrentUser() user: any, @Query('limit') limit: string = '10') {
    return this.topicService.getWeakTopics(user.id, parseInt(limit));
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.topicService.findOne(user.id, id);
  }

  @Get(':id/progress')
  getProgress(@CurrentUser() user: any, @Param('id') id: string) {
    return this.topicService.getTopicProgress(user.id, id);
  }

  @Put(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicService.update(user.id, id, updateTopicDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.topicService.remove(user.id, id);
  }
}
