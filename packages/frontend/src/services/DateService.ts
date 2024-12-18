import { DateTime } from 'luxon';

export class DateService {
  public static readonly DATE_FORMAT = {
    DEFAULT: 'dd.MM.yyyy',
    LONG: 'dd.MM.yyyy, HH:mm',
    INPUT: "yyyy-MM-dd'T'HH:mm",
    MONTH: 'LLL',
    MONTH_LONG: 'LLLL yyyy',
    MONTH_WITH_DATE_LONG: 'LLLL do',
    MONTH_WITH_DATE_SHORT: 'LLL d',
    MONTH_WITH_DATE_SHORT_WITH_YEAR: 'LLL d, yyyy',
    YEAR_MONTH: 'yyyy-MM',
  } as const;

  constructor() {}

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
    date: DateTime | Date | string;
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
