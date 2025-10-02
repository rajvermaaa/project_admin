/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

@Injectable()
export class OptionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOptionDto) {
    const count = await this.prisma.option.count({
      where: { questionId: dto.questionId },
    });

    if (count >= 5) {
      throw new BadRequestException('A question can have maximum 5 options');
    }

    return this.prisma.option.create({
      data: {
        title: dto.title,
        description: dto.description,
        questionId: dto.questionId,
      },
    });
  }

  async findAllByQuestion(questionId: number) {
    return this.prisma.option.findMany({ where: { questionId } });
  }

  // async findOne(id: number) {
  //   const option = await this.prisma.option.findUnique({ where: { id } });
  //   if (!option) throw new NotFoundException('Option not found');
  //   return option;
  // }

  async update(id: number, dto: UpdateOptionDto) {
    return this.prisma.option.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    const option = await this.prisma.option.findUnique({
      where: { id },
      include: { question: { include: { options: true } } },
    });

    if (!option) throw new NotFoundException('Option not found');
    if (option.question.options.length <= 2) {
      throw new BadRequestException('A question must have at least 2 options');
    }

    return this.prisma.option.delete({ where: { id } });
  }
}
