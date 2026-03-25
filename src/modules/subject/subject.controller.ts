import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto';

@Controller('subjects')
@UseGuards(JwtAuthGuard)
export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(user.id, createSubjectDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.subjectService.findAll(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.subjectService.findOne(user.id, id);
  }

  @Get(':id/stats')
  getStats(@CurrentUser() user: any, @Param('id') id: string) {
    return this.subjectService.getSubjectStats(user.id, id);
  }

  @Put(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectService.update(user.id, id, updateSubjectDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.subjectService.remove(user.id, id);
  }
}
