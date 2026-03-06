import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {

  @ApiProperty({ example: 'Web Development', description: 'The name of the category' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Projects related to web development', description: 'A brief description of the category', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
