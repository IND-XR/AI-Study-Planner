import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { ExamService } from './exam.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CreateExamDto, UpdateExamDto } from './dto/exam.dto';

@Controller('exams')
@UseGuards(JwtAuthGuard)
export class ExamController {
  constructor(private examService: ExamService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createExamDto: CreateExamDto) {
    return this.examService.create(user.id, createExamDto);
  }

  @Get()
  findAll(@CurrentUser() user: any, @Query('subjectId') subjectId?: string) {
    return this.examService.findAll(user.id, subjectId);
  }

  @Get('upcoming')
  getUpcomingExams(@CurrentUser() user: any, @Query('days') days: string = '30') {
    return this.examService.getUpcomingExams(user.id, parseInt(days));
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.examService.findOne(user.id, id);
  }

  @Get(':id/stats')
  getStats(@CurrentUser() user: any, @Param('id') id: string) {
    return this.examService.getExamStats(user.id, id);
  }

  @Put(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examService.update(user.id, id, updateExamDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.examService.remove(user.id, id);
  }
}
