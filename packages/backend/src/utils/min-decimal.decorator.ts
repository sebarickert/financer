import { Decimal } from '@prisma/client/runtime/library';
import {
  ValidationOptions,
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'MinDecimal' })
export class MinDecimalConstraint implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate(value: any, args: ValidationArguments) {
    if (!(value instanceof Decimal)) {
      return false;
    }

    const min = args.constraints.at(0) as Decimal;

    return value.greaterThanOrEqualTo(min);
  }
}

export const MinDecimal = (
  min: Decimal,
  options: ValidationOptions = {
    message: 'Property is lower than lowest allowed.',
  },
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: options,
      constraints: [min],
      validator: MinDecimalConstraint,
    });
  };
};
