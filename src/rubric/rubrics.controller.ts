import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { RubricsService } from './rubrics.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateOptionDto } from './dto/create-option.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin - Rubrics')
@Controller('admin/rubrics')
export class RubricsController {
  constructor(private readonly rubricsService: RubricsService) {}

  // Groups
  @Post('groups')
  createGroup(@Body() dto: CreateGroupDto) {
    return this.rubricsService.createGroup(dto);
  }

  @Get('groups')
  getGroups() {
    return this.rubricsService.getGroups();
  }

  // Questions
  @Post('questions')
  createQuestion(@Body() dto: CreateQuestionDto) {
    return this.rubricsService.createQuestion(dto);
  }

  @Get('questions/:groupId')
  getQuestions(@Param('groupId') groupId: string) {
    return this.rubricsService.getQuestions(groupId);
  }

  // Options
  @Post('options')
  createOption(@Body() dto: CreateOptionDto) {
    return this.rubricsService.createOption(dto);
  }

  @Get('options/:questionId')
  getOptions(@Param('questionId') questionId: string) {
    return this.rubricsService.getOptions(questionId);
  }
}
