import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { isValidObjectId, parseObjectId } from '../types/objectId';

@Injectable()
export class ValidateEntityId implements PipeTransform<string> {
  async transform(value: string) {
    const isValid = isValidObjectId(value);
    if (!isValid) {
      throw new BadRequestException('Invalid entity ID provided!');
    }
    return parseObjectId(value);
  }
}
