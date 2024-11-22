import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateArrayPipe implements PipeTransform {
  constructor(
    private readonly separator: string = '|',
    private readonly allowEmpty: boolean = false,
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
