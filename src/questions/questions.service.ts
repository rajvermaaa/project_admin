/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateQuestionDto) {
    const existing = await this.prisma.question.findFirst({
      where: {
        text: dto.text,
        groupId: dto.groupId,
      },
    });

    if (existing) {
      throw new ConflictException('Question text must be unique inside this group');
    }

    return this.prisma.question.create({
      data: {
        text: dto.text,
        groupId: dto.groupId,
      },
      select: {
        id: true,
        text: true,
        groupId: true,
        options: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      select: {
        id: true,
        text: true,
        groupId: true,
        options: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  async update(id: number, dto: UpdateQuestionDto) {
    const question = await this.prisma.question.findUnique({ where: { id } });
    if (!question) throw new NotFoundException('Question not found');

    const duplicate = await this.prisma.question.findFirst({
      where: {
        text: dto.text,
        groupId: dto.groupId ?? question.groupId,
        NOT: { id },
      },
    });

    if (duplicate) {
      throw new ConflictException('Question text must be unique inside this group');
    }

    return this.prisma.question.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        text: true,
        groupId: true,
        options: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const question = await this.prisma.question.findUnique({ where: { id } });
    if (!question) throw new NotFoundException('Question not found');

    return this.prisma.question.delete({
      where: { id },
      select: {
        id: true,
        text: true,
        groupId: true,
        options: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });
  }

  async countByGroup(groupId: number) {
    return this.prisma.question.count({ where: { groupId } });
  }
}
