import { format } from 'date-fns';

import { monthNamesAbbreviation } from '../constants/months';

import { addLeadingZero } from './addLeadingZero';

const formatter = new Intl.DateTimeFormat('fi-FI');

export const getShortMonthAbbreviation = (date: Date) =>
  monthNamesAbbreviation[date.getMonth()];

export const formatDate = (date: Date): string => formatter.format(date);

export const formatDateShort = (date: Date): string => format(date, 'LLL yy');

export const formatDateLong = (date: Date): string =>
  format(date, 'dd.MM.yyyy, HH:mm');

export const inputDateFormat = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${year}-${addLeadingZero(month)}-${addLeadingZero(
    day
  )}T${addLeadingZero(hour)}:${addLeadingZero(minute)}`;
};

export const parseYearMonthFromString = (initialDate?: string) => {
  const [year, month] = initialDate?.split('-') || [];

  if (!year || !month) {
    return undefined;
  }

  if (year.length !== 4 || (month.length !== 2 && month.length !== 1)) {
    return undefined;
  }

  return {
    year: parseInt(year),
    month: parseInt(month),
  };
};
