import Decimal from 'decimal.js';

import { TransactionType } from '$types/generated/financer';
import { parseCurrency } from '$utils/api-helper';
import { Page } from '$utils/financer-page';

type TransactionDetails = {
  id: string;
  amount: Decimal;
  description: string;
  date: string;
  type: TransactionType;
  fromAccount?: string;
  toAccount?: string;
};

export const getTransactionDetails = async (
  page: Page,
): Promise<TransactionDetails> => {
  const amount = parseCurrency(
    (await page.getByTestId('transaction-amount').textContent()) ?? '',
  );

  const description =
    (await page.getByTestId('transaction-description').textContent()) ?? '';

  const date =
    (await page
      .getByTestId('details-list-item')
      .getByText('Date')
      .evaluate((el) => el.parentElement?.nextElementSibling?.textContent)) ??
    '';

  const type = (
    (await page
      .getByTestId('details-list-item')
      .getByText('Type')
      .evaluate((el) => el.parentElement?.nextElementSibling?.textContent)) ??
    ''
  ).toUpperCase();

  const isIncome = type === TransactionType.Income;
  const isExpense = type === TransactionType.Expense;
  const isTransfer = type === TransactionType.Transfer;

  const fromAccount =
    isExpense || isTransfer
      ? ((await page
          .getByTestId('details-list-item')
          .getByText('From Account')
          .evaluate(
            (el) => el.parentElement?.nextElementSibling?.textContent,
          )) ?? '')
      : undefined;

  const toAccount =
    isIncome || isTransfer
      ? ((await page
          .getByTestId('details-list-item')
          .getByText('To Account')
          .evaluate(
            (el) => el.parentElement?.nextElementSibling?.textContent,
          )) ?? '')
      : undefined;

  const id =
    new URL(page.url()).pathname.split('/').filter(Boolean).pop() ?? '';

  return {
    id,
    amount,
    description,
    fromAccount,
    toAccount,
    date,
    type: type as TransactionType,
  };
};
