import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateGroupDto) {
    try {
      return await this.prisma.group.create({
        data: { name: dto.name },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Group name must be unique');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.group.findMany({
      include: {
        _count: { select: { questions: true } },
        questions: {
          include: { options: true },
        },
      },
    });
  }

//  async findAll() {
//     // FIX: Use $queryRaw as a template literal tag function
//     return this.prisma.$queryRaw`
//       SELECT "group".id, "group".name, COUNT(question.id) AS question_count
//       FROM "group"
//       LEFT JOIN question ON "group".id = question.group_id
//       GROUP BY "group".id, "group".name;
//     `;
//   }

  async findOne(id: number) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        _count: { select: { questions: true } },
        questions: {
          include: { options: true },
        },
      },
    });
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async update(id: number, dto: UpdateGroupDto) {
    try {
      return await this.prisma.group.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Group name must be unique');
      }
      throw error;
    }
  }

  async remove(id: number) {
    return this.prisma.group.delete({ where: { id } });
  }
}
