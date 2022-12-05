export const getLastDayOfMonth = (date: Date = new Date()) => {
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return lastDayOfMonth.getDate();
};
