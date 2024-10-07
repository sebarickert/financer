import { Decimal } from '@prisma/client/runtime/library';

export const sumArrayItems = (array: Decimal[]) =>
  array.reduce((a, b) => a.add(b), new Decimal(0));
