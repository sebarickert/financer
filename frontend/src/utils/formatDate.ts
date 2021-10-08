import { addLeadingZero } from './addLeadingZero';

const formatter = new Intl.DateTimeFormat('fi-FI');

export const formatDate = (date: Date): string => formatter.format(date);

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
