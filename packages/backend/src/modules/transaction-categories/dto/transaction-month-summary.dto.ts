import { ApiProperty } from '@silte/nestjs-swagger';
import { Allow } from 'class-validator';

export class CategoryMonthlySummaryDto {
  @ApiProperty()
  @Allow()
  readonly _id: {
    year: number;
    month: number;
  };

  @ApiProperty()
  @Allow()
  readonly count: number;

  @ApiProperty()
  @Allow()
  readonly totalAmount: number;
}
