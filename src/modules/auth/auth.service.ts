import {
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@libs/database/prisma.service';
import { LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * 🔐 LOGIN USER
   */

  async login(loginDto: LoginDto) {
  try {
    const { enrollmentNumber, password } = loginDto;

    console.log("LOGIN INPUT:", enrollmentNumber, password);

    const user = await this.prisma.user.findUnique({
      where: { enrollmentNumber },
    });

    console.log("USER FROM DB:", user);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.password) {
      throw new UnauthorizedException('Password missing in DB');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("PASSWORD MATCH:", isPasswordValid);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User inactive');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const tokens = await this.generateTokens(user);

    console.log("TOKENS:", tokens);

    return {
      success: true,
      data: {
        user: this.sanitizeUser(user),
        accessToken: tokens.accessToken,
      },
    };

  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error);
    throw error;
  }
}


  /**
   * 📝 REGISTER USER
   */
  async register(dto: any) {
    const { enrollmentNumber, password, name, role } = dto;

    // ❌ Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { enrollmentNumber },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 📝 Create user
    const user = await this.prisma.user.create({
      data: {
        enrollmentNumber,
        password: hashedPassword,
        name,
        role: role || 'STUDENT',
        isActive: true,
      },
    });

    this.logger.log(`✅ User registered: ${enrollmentNumber}`);

    return {
      success: true,
      message: 'User created successfully',
      
      data: this.sanitizeUser(user),
    };
  }

  /**
   * 👤 GET PROFILE
   */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * 🔐 GENERATE TOKENS
   */
  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      enrollmentNumber: user.enrollmentNumber,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRATION') || '24h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    return { accessToken, refreshToken };
  }

  /**
   * 🧹 REMOVE SENSITIVE DATA
   */
  private sanitizeUser(user: any) {
    const { password, ...safeUser } = user;
    return safeUser;
  }




}



