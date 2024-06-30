import { toZonedTime, fromZonedTime } from 'date-fns-tz';

export class DateService {
  private static readonly TIMEZONE = 'Europe/Helsinki';

  public static zonedNow(): number {
    return this.toZonedTime().getTime();
  }

  public static toZonedTime(): Date;
  public static toZonedTime(
    ...dateString: ConstructorParameters<DateConstructor>
  ): Date;
  public static toZonedTime(
    year: number,
    month: number,
    date?: number,
    hours?: number,
    minutes?: number,
    seconds?: number,
    milliseconds?: number,
  ): Date;

  public static toZonedTime(...args: unknown[]): Date {
    const date = new Date(
      ...(args as unknown as ConstructorParameters<DateConstructor>),
    );

    return toZonedTime(date, this.TIMEZONE);
  }

  public static fromZonedTime(): Date;
  public static fromZonedTime(
    ...dateString: ConstructorParameters<DateConstructor>
  ): Date;
  public static fromZonedTime(
    year: number,
    month: number,
    date?: number,
    hours?: number,
    minutes?: number,
    seconds?: number,
    milliseconds?: number,
  ): Date;

  public static fromZonedTime(...args: unknown[]): Date {
    const date = new Date(
      ...(args as unknown as ConstructorParameters<DateConstructor>),
    );

    return fromZonedTime(date, this.TIMEZONE);
  }

  public static getLastDayOfMonth(date: Date = new Date()): number {
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDayOfMonth.getDate();
  }
}
