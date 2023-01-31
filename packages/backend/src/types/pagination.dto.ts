import { ApiProperty } from '@silte/nestjs-swagger';
import { Allow } from 'class-validator';

export class PaginationDto<DataType> {
  @ApiProperty()
  @Allow()
  currentPage: number;

  @ApiProperty()
  @Allow()
  totalPageCount: number;

  @ApiProperty()
  @Allow()
  totalRowCount: number;

  @ApiProperty()
  @Allow()
  limit: number;

  @ApiProperty()
  @Allow()
  hasPreviousPage: boolean;

  @ApiProperty()
  @Allow()
  hasNextPage: boolean;

  @Allow()
  data: DataType;
}
