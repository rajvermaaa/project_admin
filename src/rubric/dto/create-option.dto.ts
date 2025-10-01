import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateOptionDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  value: number;

  @ApiProperty({ example: 'Messy, unscalable' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'uuid-of-question' })
  @IsString()
  @IsNotEmpty()
  questionId: string;
}
