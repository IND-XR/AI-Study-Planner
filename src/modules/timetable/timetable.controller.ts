import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { CreateCalendarHeadingDto } from './dto/create-calendar-heading.dto';
import { ReorderCalendarHeadingsDto } from './dto/reorder-calendar-headings.dto';

@Controller('api/timetable')
@UseGuards(JwtAuthGuard)
export class TimetableController {
  constructor(private timetableService: TimetableService) {}

  @Post()
  create(@Body() dto: CreateTimetableDto) {
    return this.timetableService.createTimetable(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateTimetableDto) {
    return this.timetableService.updateTimetable(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.timetableService.deleteTimetable(id);
  }

  @Get('degree')
  getTimetableByDegree(@Query('degreeId') degreeId: string) {
    return this.timetableService.getTimetableByDegree(degreeId);
  }

  @Get('user')
  getTimetableForUser(@CurrentUser() user: any) {
    return this.timetableService.getTimetableForUser(user.id);
  }

  @Get('headings')
  getCalendarHeadings(
    @CurrentUser() user: { id: string },
    @Query('month', ParseIntPipe) month: number,
    @Query('year', ParseIntPipe) year: number,
  ) {
    return this.timetableService.getCalendarHeadingsForMonth(user.id, month, year);
  }

  @Post('headings')
  createCalendarHeading(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateCalendarHeadingDto,
  ) {
    return this.timetableService.createCalendarHeading(user.id, dto);
  }

  @Patch('headings/reorder')
  reorderCalendarHeadings(
    @CurrentUser() user: { id: string },
    @Body() dto: ReorderCalendarHeadingsDto,
  ) {
    return this.timetableService.reorderCalendarHeadings(user.id, dto);
  }

  @Delete('headings/:id')
  deleteCalendarHeading(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.timetableService.deleteCalendarHeading(user.id, id);
  }
}
