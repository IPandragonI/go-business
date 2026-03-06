import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInterestDto {

  @ApiProperty({ example: 'Photography', description: 'The name of the interest' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'A hobby involving taking and editing photos', description: 'A brief description of the interest', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

