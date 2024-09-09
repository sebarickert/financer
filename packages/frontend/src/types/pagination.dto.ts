import { PaginationDto } from '$api/generated/financerApi';

export type GenericPaginationDto<T> = PaginationDto & {
  data: T[];
};
