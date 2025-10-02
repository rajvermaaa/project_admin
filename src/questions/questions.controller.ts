import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CacheTTL } from '@nestjs/cache-manager';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  create(@Body() dto: CreateQuestionDto) {
    return this.questionsService.create(dto);
  }

  @Get('group/:groupId')
  @CacheTTL(1)
  findAllByGroup(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.questionsService.findAllByGroup(groupId);
  }

  @Get(':id')
  @CacheTTL(1)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.remove(id);
  }

  @Get('group/:groupId/count')
  @CacheTTL(1)
  countByGroup(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.questionsService.countByGroup(groupId);
  }
}
