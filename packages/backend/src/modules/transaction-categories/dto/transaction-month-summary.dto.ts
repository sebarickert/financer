import { ApiProperty } from '@silte/nestjs-swagger';
import { Allow } from 'class-validator';

export class CategoryMonthlySummaryDto {
  // TODO get rid of underscore
  @ApiProperty()
  @Allow()
  readonly id: {
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
