import {
  ValidationOptions,
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { isIntanceOfObjectId } from '../types/objectId';

@ValidatorConstraint({ name: 'IsInstanceOfObjectId' })
export class IsInstanceOfObjectIdConstraint
  implements ValidatorConstraintInterface
{
  validate(value: unknown) {
    return isIntanceOfObjectId(value);
  }
}

export const IsInstanceOfObjectId = (
  validationOptions: ValidationOptions = {
    message: 'Must be instace of mongoose ObjectId',
  },
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsInstanceOfObjectIdConstraint,
    });
  };
};
