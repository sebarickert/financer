import { addMonths, format } from 'date-fns';

export enum DateFormat {
  default = 'dd.MM.yyyy', // 19.12.2023
  long = 'dd.MM.yyyy, HH:mm', // 19.12.2023, 10:54
  input = "yyyy-MM-dd'T'HH:mm", // 2023-12-19T10:54
  month = 'LLL', // DEC
  monthShort = 'LLL yy', // DEC 23
  monthLong = 'LLLL yyyy', // DECEMBER 2023
  monthWithDateLong = 'LLLL do', // DECEMBER 1st, 2nd, ...
  monthWithDateShort = 'LLL d', // DEC 1, 2, ...
  monthWithDateShortWithYear = 'LLL d, yyyy', // DEC 1, 2024
  timeOnly = 'HH:mm', // 10:54
}

export const formatDate = (date: Date, dateFormat?: DateFormat) => {
  return format(date, dateFormat ?? DateFormat.default);
};

export const isValidYearMonth = (date: string | undefined): date is string => {
  if (typeof date !== 'string') return false;
  const [year, month] = date.split('-').map(Number);
  return !isNaN(year) && !isNaN(month) && year > 0 && month > 0 && month <= 12;
};

export const getPreviousMonth = (year: number, month: number) => {
  const date = new Date(year, month - 1); // month is 0-indexed in Date
  const previousMonthDate = addMonths(date, -1);
  return {
    year: previousMonthDate.getFullYear(),
    month: previousMonthDate.getMonth() + 1, // month is 0-indexed in Date
  };
};

export const getNextMonth = (year: number, month: number) => {
  const date = new Date(year, month - 1); // month is 0-indexed in Date
  const nextMonthDate = addMonths(date, 1);
  return {
    year: nextMonthDate.getFullYear(),
    month: nextMonthDate.getMonth() + 1, // month is 0-indexed in Date
  };
};
