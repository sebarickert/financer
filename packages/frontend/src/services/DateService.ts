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

  date: DateTime;

  constructor(date?: Date | string) {
    this.date = date ? DateTime.fromJSDate(new Date(date)) : DateTime.now();
  }

  static isValidYearMonth(date: string): date is string {
    if (typeof date !== 'string') return false;
    const [year, month] = date.split('-').map(Number);
    return (
      !isNaN(year) && !isNaN(month) && year > 0 && month > 0 && month <= 12
    );
  }

  isToday() {
    return this.date.hasSame(DateTime.local(), 'day');
  }

  isYesterday() {
    return this.date.hasSame(DateTime.local().minus({ days: 1 }), 'day');
  }

  isAfter(date: DateTime) {
    return this.date > date;
  }

  isBefore(date: DateTime) {
    return this.date < date;
  }

  static getPreviousMonth(date: DateTime) {
    return {
      year: date.minus({ months: 1 }).year,
      month: date.minus({ months: 1 }).month,
      date: date.minus({ months: 1 }),
    };
  }

  static getNextMonth(date: DateTime) {
    return {
      year: date.plus({ months: 1 }).year,
      month: date.plus({ months: 1 }).month,
      date: date.plus({ months: 1 }),
    };
  }

  format(
    format: (typeof DateService.DATE_FORMAT)[keyof typeof DateService.DATE_FORMAT] = DateService
      .DATE_FORMAT.DEFAULT,
  ) {
    return this.date.toFormat(format);
  }

  static parseDate(date: string | Date) {
    return DateTime.fromJSDate(new Date(date));
  }

  static parseFormat(date: string, format: string) {
    return DateTime.fromFormat(date, format);
  }

  static now() {
    return DateTime.now();
  }

  static format({
    date = this.now(),
    format = DateService.DATE_FORMAT.DEFAULT,
  }: {
    date?: DateTime | Date | string;
    format?: (typeof DateService.DATE_FORMAT)[keyof typeof DateService.DATE_FORMAT];
  }) {
    if (date instanceof Date || typeof date === 'string') {
      date = this.parseDate(date);
    }

    return date.toFormat(format);
  }

  static createFromYearAndMonth(year: number, month: number) {
    return DateTime.fromObject({ year, month });
  }
}
