import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import mongoose from 'mongoose';

import { parseObjectId } from '../types/objectId';

@Injectable()
export class ValidateEntityId implements PipeTransform<string> {
  async transform(value: string) {
    const isValid = mongoose.Types.ObjectId.isValid(value);
    if (!isValid) {
      throw new BadRequestException('Invalid entity ID provided!');
    }
    return parseObjectId(value);
  }
}
