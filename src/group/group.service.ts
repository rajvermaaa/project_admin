/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateGroupDto) {
    const existing = await this.prisma.group.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('Group with this name already exists');
    }

    return this.prisma.group.create({
      data: { name: dto.name },
    });
  }

  async findAll() {
  return this.prisma.$queryRaw<
    { id: number; name: string; question_count: number }[]
  >`
    SELECT g.id, g.name, COUNT(q.id) as question_count
    FROM "Group" g
    LEFT JOIN "Question" q ON g.id = q."groupId"
    GROUP BY g.id, g.name
    ORDER BY g.id;
  `;
}


  // async findOne(id: number) {
  //   const group = await this.prisma.group.findUnique({
  //     where: { id },
  //     include: {
  //       questions: {
  //         include: { options: true },
  //       },
  //     },
  //   });

  //   if (!group) {
  //     throw new NotFoundException(`Group with ID ${id} not found`);
  //   }

  //   return group;
  // }


  async findOne(id: number) {
  return this.prisma.group.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      questions: {
        select: {
          id: true,
          text: true,
          options: {
            select: {
              id: true,
              title: true,
              description: true,
            },
          },
        },
      },
    },
  });
}


  async update(id: number, dto: UpdateGroupDto) {
    const group = await this.prisma.group.findUnique({ where: { id } });
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    if (dto.name) {
      const duplicate = await this.prisma.group.findUnique({
        where: { name: dto.name },
      });
      if (duplicate && duplicate.id !== id) {
        throw new ConflictException('Another group with this name already exists');
      }
    }

    return this.prisma.group.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: number) {
    const group = await this.prisma.group.findUnique({ where: { id } });
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return this.prisma.group.delete({ where: { id } });
  }
}
