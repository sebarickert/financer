import { DateTime } from 'luxon';

export const DATE_FORMAT = {
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

export class DateService {
  private date: DateTime;

  constructor(date: Date | string | DateTime = DateTime.now()) {
    this.date =
      date instanceof DateTime ? date : DateTime.fromJSDate(new Date(date));
  }

  getDate(): DateTime {
    return this.date;
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

  format(
    format: (typeof DATE_FORMAT)[keyof typeof DATE_FORMAT] = DATE_FORMAT.DEFAULT,
  ): string {
    return this.date.toFormat(format);
  }

  getPreviousMonth(): {
    year: number;
    month: number;
    date: DateTime;
  } {
    const previousMonth = this.date.minus({ months: 1 });
    return {
      year: previousMonth.year,
      month: previousMonth.month,
      date: previousMonth,
    };
  }

  getNextMonth(): {
    year: number;
    month: number;
    date: DateTime;
  } {
    const nextMonth = this.date.plus({ months: 1 });
    return {
      year: nextMonth.year,
      month: nextMonth.month,
      date: nextMonth,
    };
  }

  static isValidYearMonth(date: string): boolean {
    const [year, month] = date.split('-').map(Number);
    return (
      !isNaN(year) && !isNaN(month) && year > 0 && month > 0 && month <= 12
    );
  }

  static parseFormat(date: string, format: string): DateTime {
    return DateTime.fromFormat(date, format);
  }

  static createFromYearAndMonth(year: number, month: number): DateTime {
    return DateTime.fromObject({ year, month });
  }
}
