import { isValidObjectId, ObjectId, parseObjectId } from '../types/objectId';

export const objectIdTransformer = ({
  value,
}: {
  value: string | null;
  key: string;
}): ObjectId | null => {
  if (value === null) return null;
  const isValid = isValidObjectId(value);
  if (!isValid) {
    return;
  }
  return parseObjectId(value);
};
