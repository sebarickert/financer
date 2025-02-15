import { Decimal } from '@prisma/client/runtime/library';

export const sumArrayItems = (array: Decimal[]) =>
  array.reduce((current, previous) => current.add(previous), new Decimal(0));
