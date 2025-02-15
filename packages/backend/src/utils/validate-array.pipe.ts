import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateArrayPipe implements PipeTransform {
  constructor(
    private readonly separator = '|',
    private readonly allowEmpty = false,
  ) {}

  transform(value: string) {
    if (!value) {
      return [];
    }

    const values = value.split(this.separator).filter(Boolean);

    if (!this.allowEmpty && values.length === 0) {
      throw new BadRequestException('Array cannot be empty');
    }

    return values;
  }
}
