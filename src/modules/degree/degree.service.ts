import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma.service';
import { CreateDegreeDto } from './dto/create-degree.dto';

@Injectable()
export class DegreeService {
  private readonly logger = new Logger(DegreeService.name);

  constructor(private prisma: PrismaService) {}

  private generateDegreeCode(name: string): string {
    return name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join('') || 'DEG';
  }

  async createDegree(dto: CreateDegreeDto) {
    const baseCode = dto.code?.trim().toUpperCase() || this.generateDegreeCode(dto.name);
    let finalCode = baseCode;

    let suffix = 1;
    // Ensure generated code remains unique when code is not provided.
    while (
      !dto.code &&
      (await this.prisma.degree.findFirst({ where: { code: finalCode } }))
    ) {
      finalCode = `${baseCode}${suffix}`;
      suffix += 1;
    }

    const exists = await this.prisma.degree.findFirst({
      where: {
        OR: [{ name: dto.name }, { code: finalCode }],
      },
    });

    if (exists) {
      throw new ConflictException('Degree with this name or code already exists');
    }

    const degree = await this.prisma.degree.create({
      data: {
        name: dto.name,
        code: finalCode,
      },
    });

    this.logger.log(`Degree created: ${degree.name}`);
    return degree;
  }

  async getAllDegrees() {
    return this.prisma.degree.findMany({
      include: {
        subjects: true,
        users: { select: { id: true, name: true, enrollmentNumber: true } },
      },
    });
  }

  async getDegreeById(id: string) {
    return this.prisma.degree.findUnique({
      where: { id },
      include: {
        subjects: true,
        users: { select: { id: true, name: true, enrollmentNumber: true } },
      },
    });
  }
}
