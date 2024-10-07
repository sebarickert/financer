import { Decimal } from '@prisma/client/runtime/library';
import { Transform } from 'class-transformer';
import {
  ValidationOptions,
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsDecimal' })
export class IsDecimalConstraint implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate(value: any) {
    return value instanceof Decimal;
  }
}

export const IsDecimal = (
  options: ValidationOptions = {
    message: 'Property must be a instance of decimal.',
  },
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: options,
      validator: IsDecimalConstraint,
    });
  };
};

export const TransformDecimal = (fallbackValue: null | undefined = null) => {
  return Transform(({ value }) => {
    try {
      return new Decimal(value);
    } catch {
      return fallbackValue;
    }
  });
};
