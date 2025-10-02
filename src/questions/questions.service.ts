/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateQuestionDto) {
    try {
      return await this.prisma.question.create({
        data: {
          text: dto.text,
          groupId: dto.groupId,
        },
        include: { options: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Question text must be unique inside this group');
      }
      throw error;
    }
  }

  async findAllByGroup(groupId: number) {
    return this.prisma.question.findMany({
      where: { groupId },
      include: { options: true },
    });
  }

  async findOne(id: number) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: { options: true },
    });
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  async update(id: number, dto: UpdateQuestionDto) {
    try {
      return await this.prisma.question.update({
        where: { id },
        data: dto,
        include: { options: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Question text must be unique inside this group');
      }
      throw error;
    }
  }

  async remove(id: number) {
    return this.prisma.question.delete({
      where: { id },
      include: { options: true },
    });
  }

  async countByGroup(groupId: number) {
    return this.prisma.question.count({ where: { groupId } });
  }
}
