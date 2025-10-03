/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { OptionsService } from './options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessGuard, JwtAuthGuard, Roles, RolesGuard, UserType } from '@Common';

@ApiTags('Options')
@ApiBearerAuth()
@Roles(UserType.Admin)
@UseGuards(JwtAuthGuard, AccessGuard, RolesGuard)
@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Post()
  create(@Body() dto: CreateOptionDto) {
    return this.optionsService.create(dto);
  }

  @Get('question/:questionId')
  findAllByQuestion(@Param('questionId', ParseIntPipe) questionId: number) {
    return this.optionsService.findAllByQuestion(questionId);
  }

  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.optionsService.findOne(id);
  // }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOptionDto,
  ) {
    return this.optionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.optionsService.remove(id);
  }
}
