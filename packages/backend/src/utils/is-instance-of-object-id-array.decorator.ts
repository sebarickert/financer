import {
  ValidationOptions,
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { isIntanceOfObjectId } from '../types/objectId';

@ValidatorConstraint({ name: 'IsInstanceOfObjectIdArray' })
export class IsInstanceOfObjectIdConstraint
  implements ValidatorConstraintInterface
{
  validate(values: unknown[]) {
    return values?.every((value) => isIntanceOfObjectId(value));
  }
}

export const IsInstanceOfObjectIdArray = (
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
