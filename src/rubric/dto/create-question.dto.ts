import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({ example: 'Code Quality' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: 'uuid-of-group' })
  @IsString()
  @IsNotEmpty()
  groupId: string;
}
