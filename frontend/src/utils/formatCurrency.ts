const formatter = new Intl.NumberFormat("fi-FI", {
  style: "currency",
  currency: "EUR",
});

const formatCurrency = (number: number): string => formatter.format(number);

export default formatCurrency;
