const formatter = new Intl.NumberFormat('fi-FI', {
  style: 'currency',
  currency: 'EUR',
});

export const formatCurrency = (
  number: number,
  hasAbbreviation?: boolean,
): string => {
  const validatedNumber = isNaN(number) ? 0 : number;

  if (hasAbbreviation) {
    const isNumberPositive = validatedNumber > 0 ? '+' : '';

    return `${isNumberPositive}${formatter.format(validatedNumber)}`;
  }

  return formatter.format(validatedNumber);
};

export const formatCurrencyAbbreviation = (num: number): string => {
  if (Math.abs(num) > 999) {
    return `${((Math.sign(num) * Math.abs(num)) / 1000)
      .toFixed(1)
      .replace(/(\.0+|0+)$/, '')}K €`;
  }

  return `${Math.sign(num) * Math.abs(num)} €`;
};
