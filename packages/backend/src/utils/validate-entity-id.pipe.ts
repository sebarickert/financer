import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class ValidateEntityId implements PipeTransform<string> {
  transform(value: string) {
    if (!value) return null;
    const isValid = isUUID(value);
    if (!isValid) {
      throw new BadRequestException('Invalid entity ID provided!');
    }

    return value;
  }
}
