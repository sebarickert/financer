import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

import { ClassPropertyKeys } from '@/types/class-property-keys';

@ValidatorConstraint({ name: 'IsNotEqual' })
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export class IsNotEqualConstraint<Class extends object>
  implements ValidatorConstraintInterface
{
  validate(value: unknown, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints as [
      ClassPropertyKeys<Class>,
    ];

    const object = args.object as Class;

    const relatedValue = object[relatedPropertyName];

    return (
      (this.hasToString(value) ? value.toString() : value) !==
      (this.hasToString(relatedValue) ? relatedValue.toString() : relatedValue)
    );
  }

  private hasToString(value: unknown): value is { toString(): string } {
    return typeof value === 'object' && value !== null && 'toString' in value;
  }
}

export const IsNotEqual = <
  Class extends object,
  Properties extends ClassPropertyKeys<Class>,
  TargetProperty extends ClassPropertyKeys<Class>,
>(
  property: Exclude<Properties, TargetProperty>,
  validationOptions: ValidationOptions = {
    message: 'The two properties must not be equal',
  },
) => {
  return (object: Class, propertyName: TargetProperty) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsNotEqualConstraint<Class>,
    });
  };
};
