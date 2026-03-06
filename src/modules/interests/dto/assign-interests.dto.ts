import { IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignInterestsDto {

  @ApiProperty({ example: [1, 2, 3], description: 'Array of interest IDs to assign to the user', type: [Number]})
  @IsArray()
  @IsNumber({}, { each: true })
  interestIds: number[];
}

