import { isUUID } from 'class-validator';

export const isValidObjectId = (id: string): boolean =>
  /^[0-9a-fA-F]{24}$/.test(id) || isUUID(id);
