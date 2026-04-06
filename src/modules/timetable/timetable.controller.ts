import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Controller('api/timetable')
@UseGuards(JwtAuthGuard)
export class TimetableController {
  constructor(private timetableService: TimetableService) {}

  @Post()
  create(@Body() dto: CreateTimetableDto) {
    return this.timetableService.createTimetable(dto);
  }

  @Get('degree')
  getTimetableByDegree(@Query('degreeId') degreeId: string) {
    return this.timetableService.getTimetableByDegree(degreeId);
  }

  @Get('user')
  getTimetableForUser(@CurrentUser() user: any) {
    return this.timetableService.getTimetableForUser(user.id);
  }
}
