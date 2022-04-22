import { Allow } from 'class-validator';

export class PaginationDto<DataType> {
  @Allow()
  currentPage: number;

  @Allow()
  totalPageCount: number;

  @Allow()
  totalRowCount: number;

  @Allow()
  limit: number;

  @Allow()
  hasPreviousPage: boolean;

  @Allow()
  hasNextPage: boolean;

  @Allow()
  data: DataType;
}
