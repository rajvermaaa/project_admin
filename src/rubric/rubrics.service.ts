import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateOptionDto } from './dto/create-option.dto';

@Injectable()
export class RubricsService {
  constructor(private prisma: PrismaService) {}

  // Groups
  async createGroup(dto: CreateGroupDto) {
    return this.prisma.group.create({
      data: { name: dto.name },
    });
  }

  async getGroups() {
    return this.prisma.group.findMany({
      include: { questions: { include: { options: true } } },
    });
  }

  // Questions
  async createQuestion(dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: { text: dto.text, groupId: dto.groupId },
    });
  }

  async getQuestions(groupId: string) {
    return this.prisma.question.findMany({
      where: { groupId },
      include: { options: true },
    });
  }

  // Options
  async createOption(dto: CreateOptionDto) {
    return this.prisma.option.create({
      data: {
        value: dto.value,
        description: dto.description,
        questionId: dto.questionId,
      },
    });
  }

  async getOptions(questionId: string) {
    return this.prisma.option.findMany({
      where: { questionId },
    });
  }
}
