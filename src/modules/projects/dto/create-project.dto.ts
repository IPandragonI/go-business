import { IsNotEmpty, IsOptional, IsNumber, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {

  @ApiProperty({ example: 'Build a website', description: 'The title of the project' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'We need a website for our business',
    description: 'The description of the project',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 5000, description: 'The budget for the project', required: false })
  @IsOptional()
  @IsNumber()
  budget?: number;

  @ApiProperty({
    example: [1, 2],
    description: 'The categories associated with the project',
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  categories: number[];
}
