import { DateTime } from 'luxon';

export class DateService {
  public static readonly DATE_FORMAT = {
    DEFAULT: 'dd.MM.yyyy',
    LONG: 'dd.MM.yyyy, HH:mm',
    INPUT: "yyyy-MM-dd'T'HH:mm",
    MONTH: 'LLL',
    MONTH_LONG: 'LLLL yyyy',
    MONTH_WITH_DATE_LONG: 'LLLL d',
    MONTH_WITH_DATE_SHORT: 'LLL d',
    MONTH_WITH_DATE_SHORT_WITH_YEAR: 'LLL d, yyyy',
    YEAR_MONTH: 'yyyy-MM',
  } as const;

  private date: DateTime;

  constructor(date: Date | string | DateTime = DateTime.now()) {
    this.date =
      date instanceof DateTime ? date : DateTime.fromJSDate(new Date(date));
  }

  static isValidYearMonth(date: string): boolean {
    const [year, month] = date.split('-').map(Number);
    return (
      !isNaN(year) && !isNaN(month) && year > 0 && month > 0 && month <= 12
    );
  }

  isToday(): boolean {
    return this.date.hasSame(DateTime.local(), 'day');
  }

  isYesterday(): boolean {
    return this.date.hasSame(DateTime.local().minus({ days: 1 }), 'day');
  }

  isAfter(date: DateTime): boolean {
    return this.date > date;
  }

  isBefore(date: DateTime): boolean {
    return this.date < date;
  }

  static getPreviousMonth(date: DateTime): {
    year: number;
    month: number;
    date: DateTime;
  } {
    const previousMonth = date.minus({ months: 1 });
    return {
      year: previousMonth.year,
      month: previousMonth.month,
      date: previousMonth,
    };
  }

  static getNextMonth(date: DateTime): {
    year: number;
    month: number;
    date: DateTime;
  } {
    const nextMonth = date.plus({ months: 1 });
    return {
      year: nextMonth.year,
      month: nextMonth.month,
      date: nextMonth,
    };
  }

  format(
    format: (typeof DateService.DATE_FORMAT)[keyof typeof DateService.DATE_FORMAT] = DateService
      .DATE_FORMAT.DEFAULT,
  ): string {
    return this.date.toFormat(format);
  }

  static parseDate(date: string | Date): DateTime {
    return DateTime.fromJSDate(new Date(date));
  }

  static parseFormat(date: string, format: string): DateTime {
    return DateTime.fromFormat(date, format);
  }

  static now(): DateTime {
    return DateTime.now();
  }

  static format({
    date = DateService.now(),
    format = DateService.DATE_FORMAT.DEFAULT,
  }: {
    date?: DateTime | Date | string;
    format?: (typeof DateService.DATE_FORMAT)[keyof typeof DateService.DATE_FORMAT];
  }): string {
    if (date instanceof Date || typeof date === 'string') {
      date = DateService.parseDate(date);
    }
    return date.toFormat(format);
  }

  static createFromYearAndMonth(year: number, month: number): DateTime {
    return DateTime.fromObject({ year, month });
  }
}
