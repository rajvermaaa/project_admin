import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateGroupDto {
  @ApiProperty({ example: 'Group' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
