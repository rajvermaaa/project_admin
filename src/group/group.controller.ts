/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { GroupsService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CacheTTL } from '@nestjs/cache-manager';
import {
  AccessGuard,
  // AuthenticatedRequest,
  // BaseController,
  JwtAuthGuard,
  Roles,
  RolesGuard,
  UserType,
} from '@Common';

@ApiTags('Groups')
@ApiBearerAuth()
@Roles(UserType.Admin)
@UseGuards(JwtAuthGuard, AccessGuard, RolesGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully.' })
  create(@Body() dto: CreateGroupDto) {
    return this.groupService.create(dto);
  }

  @Get()
  @CacheTTL(1)
  @ApiOperation({ summary: 'Get all groups' })
  findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  @CacheTTL(1)
  @ApiOperation({ summary: 'Get group by ID with its questions and options' })
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(+id);
  }
  
  @Patch(':id')
  @ApiOperation({ summary: 'Update group name by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
    return this.groupService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete group by ID' })
  remove(@Param('id') id: string) {
    return this.groupService.remove(+id);
  }
}
