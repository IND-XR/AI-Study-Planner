
import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 🔐 Get all users
   */
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  /**
   * 🔐 Get profile
   */
  @Get('me')
  getProfile(@CurrentUser() user: any) {
    return this.userService.getProfile(user.id);
  }

  /**
   * 🔐 Update profile
   */
  @Put('me')
  updateProfile(
    @CurrentUser() user: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(user.id, updateUserDto);
  }

  /**
   * 🔐 Get stats
   */
  @Get('stats')
  getUserStats(@CurrentUser() user: any) {
    return this.userService.getUserStats(user.id);
  }

  /**
   * 🔐 Delete account
   */
  @Delete('me')
  deleteAccount(@CurrentUser() user: any) {
    return this.userService.deleteAccount(user.id);
  }
}

// import {
//   Controller,
//   Get,
//   Put,
//   Delete,
//   Body,
//   UseGuards,
// } from '@nestjs/common';

// import { UserService } from './user.service';
// import { CurrentUser } from '@common/decorators/current-user.decorator';
// import {
//   JwtAuthGuard,
//   OptionalJwtAuthGuard,
// } from '@common/guards/jwt-auth.guard';
// import { UpdateUserDto } from './dto/user.dto';

// @Controller('users')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   /**
//    * 🔐 Get all users (Protected)
//    */
//   @UseGuards(JwtAuthGuard)
//   @Get()
//   getAllUsers() {
//     return this.userService.getAllUsers();
//   }

//   /**
//    * 🔐 Get current user profile
//    */
//   @UseGuards(JwtAuthGuard)

//   // @Get('me')
//   // getProfile(@CurrentUser() user: any) {

//   //   return this.userService.getProfile(user.id);
//   // }
//   @Get('me')
//   getProfile(@CurrentUser() user: any) {
//     console.log('🔍 Current user from decorator:', user);
//     if (!user) {
//       throw new Error('User not found in request');
//     }

//     return this.userService.getProfile(user.id);
//   }
// }

//   /**
//    * 🔐 Update profile
//    */
//   @UseGuards(JwtAuthGuard)

//   @Put('me')
//   updateProfile(
//     @CurrentUser() user: any,
//     @Body() updateUserDto: UpdateUserDto,
//   ) {
//     return this.userService.updateProfile(user.id, updateUserDto);
//   }

//   /**
//    * 🔐 Get user stats
//    */
//   @UseGuards(JwtAuthGuard)
//   @Get('stats')
//   getUserStats(@CurrentUser() user: any) {
//     return this.userService.getUserStats(user.id);
//   }

//   /**
//    * 🔐 Delete account
//    */
//   @UseGuards(JwtAuthGuard)
//   @Delete('me')
//   deleteAccount(@CurrentUser() user: any) {
//     return this.userService.deleteAccount(user.id);
//   }

//   /**
//    * 🟡 Public route (Optional login)
//    */
//   @UseGuards(OptionalJwtAuthGuard)
//   @Get('public')
//   getPublic(@CurrentUser() user: any) {
//     return user
//       ? `Hello ${user.enrollmentNumber}`
//       : 'Hello Guest';
//   }




// // import { Controller, Get, Put, Delete, Body, UseGuards } from '@nestjs/common';
// // import { UserService } from './user.service';
// // import { CurrentUser } from '@common/decorators/current-user.decorator';
// // import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
// // import { UpdateUserDto } from './dto/user.dto';

// // @Controller('users')
// // @UseGuards(JwtAuthGuard)
// // export class UserController {
// //   constructor(private readonly userService: UserService) {}

// //   @Get()
// //   getAllUsers() {
// //     return this.userService.getAllUsers();
// //   }

// //   @Get('me')
// //   getProfile(@CurrentUser() user: any) {
// //   return this.userService.getProfile(user.id);
// //   }

// //   @Put('me')
// //   updateProfile(@CurrentUser() user: any, @Body() updateUserDto: UpdateUserDto) {
// //     return this.userService.updateProfile(user.id, updateUserDto);
// //   }

// //   @Get('stats')
// //   getUserStats(@CurrentUser() user: any) {
// //     return this.userService.getUserStats(user.id);
// //   }

// //   @Delete('me')
// //   deleteAccount(@CurrentUser() user: any) {
// //     return this.userService.deleteAccount(user.id);
// //   }
// // }
