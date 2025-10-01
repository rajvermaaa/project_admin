import { ApiProperty } from '@nestjs/swagger';
import { CreateQuestionDto } from './create-question.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  questions?: CreateQuestionDto[];
}
