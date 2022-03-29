import { BadRequestException } from '@nestjs/common';

import { isValidObjectId, ObjectId, parseObjectId } from '../types/objectId';

export const objectIdTransformer = ({
  value,
  key,
}: {
  value: string | null;
  key: string;
}): ObjectId | null => {
  if (value === null) return null;
  const isValid = isValidObjectId(value);
  if (!isValid) {
    throw new BadRequestException(`${key} must be a mongodb id.`);
  }
  return parseObjectId(value);
};
