import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({ example: 'What is React?' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  groupId: number;
}
