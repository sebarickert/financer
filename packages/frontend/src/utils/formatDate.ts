import { format } from 'date-fns';

export enum DateFormat {
  default = 'dd.MM.yyyy', // 19.12.2023
  long = 'dd.MM.yyyy, HH:mm', // 19.12.2023, 10:54
  input = "yyyy-MM-dd'T'HH:mm", // 2023-12-19T10:54
  monthShort = 'LLL yy', // DEC 23
  monthLong = 'LLLL yyyy', // DECEMBER 2023
  monthWithDateShort = 'LLLL do', // DECEMBER 1st, 2nd, ...
  timeOnly = 'HH:mm', // 10:54
}

export const formatDate = (date: Date, dateFormat?: DateFormat) => {
  return format(date, dateFormat ?? DateFormat.default);
};
