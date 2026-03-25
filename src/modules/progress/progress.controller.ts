import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CreateProgressRecordDto, UpdateProgressRecordDto } from './dto/progress.dto';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createProgressDto: CreateProgressRecordDto) {
    return this.progressService.create(user.id, createProgressDto);
  }

  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('topicId') topicId?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.progressService.findAll(
      user.id,
      topicId,
      fromDate ? new Date(fromDate) : undefined,
      toDate ? new Date(toDate) : undefined,
    );
  }

  @Get('daily-stats')
  getDailyStats(@CurrentUser() user: any, @Query('date') date?: string) {
    return this.progressService.getDailyStats(user.id, date ? new Date(date) : undefined);
  }

  @Get('weekly-stats')
  getWeeklyStats(@CurrentUser() user: any, @Query('endDate') endDate?: string) {
    return this.progressService.getWeeklyStats(user.id, endDate ? new Date(endDate) : undefined);
  }

  @Get('monthly-stats')
  getMonthlyStats(
    @CurrentUser() user: any,
    @Query('month') month: string = new Date().getMonth().toString(),
    @Query('year') year: string = new Date().getFullYear().toString(),
  ) {
    return this.progressService.getMonthlyStats(user.id, parseInt(month), parseInt(year));
  }

  @Get('streaks')
  getStreaks(@CurrentUser() user: any) {
    return this.progressService.getStudyStreaks(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.progressService.findOne(user.id, id);
  }

  @Put(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() updateProgressDto: UpdateProgressRecordDto) {
    return this.progressService.update(user.id, id, updateProgressDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.progressService.remove(user.id, id);
  }
}
