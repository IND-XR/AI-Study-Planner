import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { StudyPlanService } from './study-plan.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { GenerateStudyPlanDto } from './dto/study-plan.dto';

@Controller('study-plans')
@UseGuards(JwtAuthGuard)
export class StudyPlanController {
  constructor(private studyPlanService: StudyPlanService) {}

  @Post('generate')
  generatePlan(@CurrentUser() user: any, @Body() generatePlanDto: GenerateStudyPlanDto) {
    return this.studyPlanService.generatePlan(user.id, generatePlanDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.studyPlanService.findAll(user.id);
  }

  @Get('active')
  getActivePlan(@CurrentUser() user: any) {
    return this.studyPlanService.getActivePlan(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.studyPlanService.findOne(user.id, id);
  }

  @Get(':id/progress')
  getProgress(@CurrentUser() user: any, @Param('id') id: string) {
    return this.studyPlanService.getPlanProgress(user.id, id);
  }

  @Post(':id/activate')
  activatePlan(@CurrentUser() user: any, @Param('id') id: string) {
    return this.studyPlanService.activatePlan(user.id, id);
  }
}
