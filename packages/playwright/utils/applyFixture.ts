import { getBaseUrl } from './financer-page';

import fixtureData from '$assets/fixture-data.json';

type TransactionItem = {
  createdAt: string;
  updatedAt: string;
  id: string;
  amount: string;
  description: string;
  date: string;
  userId: string;
  fromAccount: string | null;
  toAccount: string | null;
};

const updateTransactionDates = (
  transactionItems: TransactionItem[],
): TransactionItem[] => {
  if (transactionItems.length === 0) return transactionItems;

  // Find the newest date in the array
  const dates = transactionItems.map((item) => new Date(item.date));
  const newestDate = new Date(Math.max(...dates.map((date) => date.getTime())));

  // Calculate the day offset to make the newest date equal to today's date
  const currentDate = new Date();
  const dayOffset = Math.ceil(
    (currentDate.getTime() - newestDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Apply the offset to each transaction date
  return transactionItems.map((item) => {
    const originalDate = new Date(item.date);
    originalDate.setDate(originalDate.getDate() + dayOffset); // Shift by the calculated offset
    return { ...item, date: originalDate.toISOString() }; // Return updated item
  });
};

export const applyFixture = async () => {
  const data = fixtureData;

  const updatedData = {
    ...data,
    transactions: updateTransactionDates(data.transactions),
  };

  const baseUrl = getBaseUrl();

  console.log(data.transactions[0], updatedData.transactions[0]);

  return fetch(`${baseUrl}/api/users/my-user/my-data`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });
};
