import { Decimal } from '@prisma/client/runtime/library';
import { Transform, TransformationType } from 'class-transformer';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
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
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: IsDecimalConstraint,
    });
  };
};

export const TransformDecimal = (fallbackValue: null | undefined = null) => {
  return Transform(({ value, type }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      // Incoming transformation: Convert to Decimal
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return new Decimal(value);
      } catch {
        return fallbackValue;
      }
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      // Outgoing transformation: Convert to number
      return value instanceof Decimal ? value.toNumber() : fallbackValue;
    }

    // Class to class transformation
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return new Decimal(value);
    } catch {
      return fallbackValue;
    }
  });
};
