import Decimal from 'decimal.js';

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const parseCurrency = (currencyString: string): Decimal => {
  const cleanedText = currencyString
    .replace(/[ €]/g, '')
    .replace(/\s/g, '')
    .replace(',', '.')
    .replace(/[−–—]/g, '-'); // Normalize dash characters to standard hyphen

  return new Decimal(cleanedText);
};
