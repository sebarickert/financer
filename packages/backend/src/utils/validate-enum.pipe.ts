import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateEnumPipe implements PipeTransform<string | string[]> {
  constructor(private readonly enumType: object) {}

  async transform(value: string | string[]) {
    if (!value) return null;

    const values = Array.isArray(value) ? value : [value];
    const isValid = values.every((val) =>
      Object.values(this.enumType).includes(val),
    );

    if (!isValid) {
      throw new BadRequestException('Invalid enum value provided!');
    }

    return value;
  }
}
