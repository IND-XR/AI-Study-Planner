import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('api/admin')
@UseGuards(JwtAuthGuard)
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  async createStudent(
    @CurrentUser() user: { id: string; role?: string },
    @Body() createUserDto: CreateUserDto,
  ) {
    if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only admins can create students');
    }

    return this.userService.createStudent(createUserDto);
  }
}
