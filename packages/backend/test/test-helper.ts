import { PaginationDto } from '../src/types/pagination.dto';

type CreatedAndUpdated = {
  createdAt: Date;
  updatedAt: Date;
};

export function removeCreatedAndUpdated<T extends CreatedAndUpdated>(
  obj: T[],
): Omit<T, 'createdAt' | 'updatedAt'>[];
export function removeCreatedAndUpdated<T extends CreatedAndUpdated>(
  obj: T,
): Omit<T, 'createdAt' | 'updatedAt'>;
export function removeCreatedAndUpdated<T extends CreatedAndUpdated>(
  obj: PaginationDto<T[]>,
): Omit<PaginationDto<T[]>, 'data'> & {
  data: Omit<T, 'createdAt' | 'updatedAt'>[];
};

export function removeCreatedAndUpdated<T extends CreatedAndUpdated>(
  obj: T | T[] | PaginationDto<T[]>,
):
  | Omit<T, 'createdAt' | 'updatedAt'>
  | Omit<T, 'createdAt' | 'updatedAt'>[]
  | (Omit<PaginationDto<T[]>, 'data'> & {
      data: Omit<T, 'createdAt' | 'updatedAt'>[];
    }) {
  if ('data' in obj) {
    return {
      ...obj,
      data: removeCreatedAndUpdated(obj.data),
    };
  } else if (Array.isArray(obj)) {
    return obj.map(({ createdAt, updatedAt, ...rest }) => rest);
  } else {
    const { createdAt, updatedAt, ...rest } = obj;
    return rest;
  }
}
