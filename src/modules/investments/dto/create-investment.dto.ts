import { IsNumber, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvestmentDto {

  @ApiProperty({ example: 100.00, description: 'The amount to invest' })
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 1, description: 'The ID of the project to invest in' })
  @IsNumber()
  projectId: number;
}

