import { fromZonedTime, toZonedTime } from 'date-fns-tz';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DateService {
  private static readonly TIMEZONE = 'Europe/Helsinki';

  public static zonedNow(): number {
    return this.toZonedTime().getTime();
  }

  public static toZonedTime(): Date;
  public static toZonedTime(
    // eslint-disable-next-line @typescript-eslint/unified-signatures
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
    // eslint-disable-next-line @typescript-eslint/unified-signatures
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

  public static isSameYearMonth(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth()
    );
  }
}
