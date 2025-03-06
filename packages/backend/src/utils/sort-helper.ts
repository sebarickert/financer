import { ClassDatePropertyKeys } from '@/types/class-property-keys';

const internalSortDateDesc = (a: Date, b: Date) => b.getTime() - a.getTime();

/**
 * Sorts two Date objects in descending order.
 * @param {Date} a - The first date.
 * @param {Date} b - The second date.
 * @returns {number} - A negative number if `a` is after `b`, a positive number if `a` is before `b`, or 0 if they are equal.
 */
export function sortDateDesc(a: Date, b: Date): number;

/**
 * Returns a comparator function that sorts objects by a specified date property in descending order.
 * @template DataObject
 * @param {ClassDatePropertyKeys<DataObject>} dateProperty - The key of the date property to sort by.
 * @returns {(a: DataObject, b: DataObject) => number} - A comparator function.
 */
export function sortDateDesc<DataObject extends object>(
  dateProperty: ClassDatePropertyKeys<DataObject>,
): (a: DataObject, b: DataObject) => number;

/**
 * Sorts two Date objects in descending order or returns a comparator function that sorts objects by a specified date property in descending order.
 * @param {...unknown[]} args - The arguments, either two Date objects or a single string representing the date property key.
 * @returns {number | ((a: Record<string, Date>, b: Record<string, Date>) => number)} - The result of the comparison or a comparator function.
 * @throws {Error} - If the arguments are invalid.
 */

export function sortDateDesc(
  ...args: unknown[]
): number | ((a: Record<string, Date>, b: Record<string, Date>) => number) {
  if (args.length === 1 && typeof args[0] === 'string') {
    const [dateProperty] = args as [string];

    return (a: Record<string, Date>, b: Record<string, Date>) =>
      internalSortDateDesc(a[dateProperty], b[dateProperty]);
  }

  if (args.length === 2 && args.every((arg) => arg instanceof Date)) {
    return internalSortDateDesc(args[0], args[1]);
  }

  throw new Error('Invalid arguments');
}
