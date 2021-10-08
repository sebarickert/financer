const formatter = new Intl.NumberFormat('fi-FI', {
  style: 'currency',
  currency: 'EUR',
});

export const formatCurrency = (number: number): string =>
  formatter.format(number);
