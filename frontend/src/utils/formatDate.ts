import addLeadingZero from "./addLeadingZero";

const formatter = new Intl.DateTimeFormat("fi-FI");

export const formatDate = (date: Date) => formatter.format(date);

export const inputDateFormat = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${addLeadingZero(month)}-${addLeadingZero(day)}`;
};
