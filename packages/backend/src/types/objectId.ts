import mongoose from 'mongoose';

export type ObjectId = mongoose.Types.ObjectId;

export const parseObjectId = (id: string): ObjectId =>
  mongoose.Types.ObjectId.createFromHexString(id) as ObjectId;
