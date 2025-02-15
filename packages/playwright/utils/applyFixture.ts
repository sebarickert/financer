import { getBaseUrl } from './financer-page';

import fixtureData from '$assets/fixture-data.json';

interface TransactionItem {
  createdAt: string;
  updatedAt: string;
  id: string;
  amount: string;
  description: string;
  date: string;
  userId: string;
  fromAccount: string | null;
  toAccount: string | null;
}

const updateTransactionDates = (
  transactionItems: TransactionItem[],
): TransactionItem[] => {
  if (transactionItems.length === 0) return transactionItems;

  // Find the newest date in the array
  const dates = transactionItems.map((item) => new Date(item.date));
  const newestDate = new Date(Math.max(...dates.map((date) => date.getTime())));

  // Get the current date and compute month/year difference
  const currentDate = new Date();
  const monthDiff =
    (currentDate.getFullYear() - newestDate.getFullYear()) * 12 +
    (currentDate.getMonth() - newestDate.getMonth());

  // Apply the month offset to each transaction date
  return transactionItems.map((item) => {
    const originalDate = new Date(item.date);
    // Preserve the day but adjust the month/year based on the offset
    originalDate.setMonth(originalDate.getMonth() + monthDiff);

    // Ensure the date is valid after the adjustment (e.g., handle Feb 31 -> Mar 3)
    if (originalDate.getDate() !== new Date(item.date).getDate()) {
      originalDate.setDate(0); // Roll back to the last valid day of the month
    }

    return { ...item, date: originalDate.toISOString() };
  });
};

export const applyFixture = async () => {
  const data = fixtureData;

  const updatedData = {
    ...data,
    transactions: updateTransactionDates(data.transactions),
  };

  const baseUrl = getBaseUrl();

  return fetch(`${baseUrl}/api/users/my-user/my-data`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });
};
