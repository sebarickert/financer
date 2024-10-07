import { ApiProperty } from '@nestjs/swagger';
import { ClassConstructor, Type } from 'class-transformer';
import { Allow, ValidateNested } from 'class-validator';

export class PaginationDto<DataType> {
  private static instanceOfData({
    data,
  }: Record<string, unknown>): ClassConstructor<unknown> {
    if (Array.isArray(data)) {
      return data.length > 0
        ? (data[0].constructor as ClassConstructor<unknown>)
        : Object;
    }

    return data.constructor as ClassConstructor<unknown>;
  }

  constructor(data: PaginationDto<DataType>) {
    Object.assign(this, data);
  }

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

  @Type(({ object }) => PaginationDto.instanceOfData(object))
  @ValidateNested({ each: true })
  @Allow()
  data: DataType;
}
