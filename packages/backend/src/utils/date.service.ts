import { toZonedTime } from 'date-fns-tz';

export class DateService {
  private static readonly TIMEZONE = 'Europe/Helsinki';

  public static toZonedDate(): Date;
  public static toZonedDate(
    ...dateString: ConstructorParameters<DateConstructor>
  ): Date;
  public static toZonedDate(
    year: number,
    month: number,
    date?: number,
    hours?: number,
    minutes?: number,
    seconds?: number,
    milliseconds?: number,
  ): Date;

  public static toZonedDate(...args: unknown[]): Date {
    const date = new Date(
      ...(args as unknown as ConstructorParameters<DateConstructor>),
    );

    return toZonedTime(date, this.TIMEZONE);
  }

  public static getLastDayOfMonth(date: Date = new Date()): number {
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDayOfMonth.getDate();
  }
}
