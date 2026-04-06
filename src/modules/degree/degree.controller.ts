import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DegreeService } from './degree.service';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@Controller('api/degrees')
@UseGuards(JwtAuthGuard)
export class DegreeController {
  constructor(private degreeService: DegreeService) {}

  @Post()
  create(@Body() dto: CreateDegreeDto) {
    return this.degreeService.createDegree(dto);
  }

  @Get()
  findAll() {
    return this.degreeService.getAllDegrees();
  }
}
