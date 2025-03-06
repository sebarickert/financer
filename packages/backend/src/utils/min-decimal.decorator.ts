import { Decimal } from '@prisma/client/runtime/library';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

export const ONE_CENT = new Decimal(0.01);

@ValidatorConstraint({ name: 'MinDecimal' })
export class MinDecimalConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments) {
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
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [min],
      validator: MinDecimalConstraint,
    });
  };
};
