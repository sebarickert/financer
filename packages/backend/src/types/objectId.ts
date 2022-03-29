import { Types as MongooseTypes } from 'mongoose';

export type ObjectId = MongooseTypes.ObjectId;

export const isValidObjectId = (id: string): boolean =>
  MongooseTypes.ObjectId.isValid(id);

export const parseObjectId = (id: string | ObjectId): ObjectId => {
  if (id instanceof MongooseTypes.ObjectId) return id;

  return isValidObjectId(id)
    ? (MongooseTypes.ObjectId.createFromHexString(id) as ObjectId)
    : undefined;
};
