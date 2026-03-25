import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '@libs/database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
      console.log("JWT PAYLOAD:", payload);  // 👈 ADD

    // 🔍 Fetch user from DB
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        enrollmentNumber: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    // ❌ If user not found
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // ❌ If user inactive
    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    // ✅ Attach to request.user
    return user;
  }
}

// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PrismaService } from '@libs/database/prisma.service';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     configService: ConfigService,
//     private prisma: PrismaService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get('JWT_SECRET'),
//     });
//   }

//   async validate(payload: any) {
//   const user = await this.prisma.user.findUnique({
//     where: { id: payload.sub },
//     select: {
//       id: true,
//       enrollmentNumber: true,
//       role: true,
//       isActive: true,
//     },
//   });

//   if (!user || !user.isActive) {
//     throw new UnauthorizedException('User not found or inactive');
//   }

//   return user;
// }

  // async validate(payload: any) {
  //   return {
  //     id: payload.sub,
  //     enrollmentNumber: payload.enrollmentNumber,
  //   };
  // }


  // async validate(payload: any) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { id: payload.sub },
  //   });

  //   if (!user) {
  //     throw new UnauthorizedException('User not found');
  //   }

  //   return { id: user.id, enrollmentNumber: user.enrollmentNumber };
  // }

