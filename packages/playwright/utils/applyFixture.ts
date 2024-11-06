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
  // Parse dates and find the newest date
  const dates = transactionItems.map((item) => new Date(item.date));
  const newestDate = new Date(Math.max(...dates.map((date) => date.getTime())));

  // Calculate the offset in days
  const currentDate = new Date();
  const dayOffset = Math.floor(
    (currentDate.getTime() - newestDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Update each transaction date
  return transactionItems.map((item) => {
    const originalDate = new Date(item.date);
    const updatedDate = new Date(originalDate);
    updatedDate.setDate(originalDate.getDate() + dayOffset);
    return { ...item, date: updatedDate.toISOString() };
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
