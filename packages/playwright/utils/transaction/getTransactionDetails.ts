import Decimal from 'decimal.js';

import { TransactionType } from '$types/generated/financer';
import { parseCurrency } from '$utils/api-helper';
import { Page, expect } from '$utils/financer-page';

type TransactionDetails = {
  id: string;
  amount: Decimal;
  description: string;
  date: string;
  type: TransactionType;
  fromAccount?: string;
  toAccount?: string;
  categories: CategoryDetails[];
};

type CategoryDetails = {
  category: string;
  amount: Decimal;
  description?: string;
};

const getCategories = async (page: Page): Promise<CategoryDetails[]> => {
  const categoriesElement = await page
    .getByTestId('transaction-categories')
    .isVisible();

  if (!categoriesElement) {
    return [];
  }

  const categories = await page
    .getByTestId('transaction-categories')
    .evaluate((element) => {
      const categoryDetailItems = element.querySelectorAll(
        '[data-testid="category-details"]',
      );

      return Array.from(categoryDetailItems).map((el) => {
        const detailItems = el.querySelectorAll(
          '[data-testid="category-details-item"]',
        );

        const result: { [key: string]: string } = {};

        Array.from(detailItems).forEach((itemElement) => {
          const itemLabel =
            itemElement.querySelector('dt')?.textContent?.toLowerCase() ?? '';
          const itemDescription =
            itemElement.querySelector('dd')?.textContent ?? '';

          if (itemLabel) {
            result[itemLabel] = itemDescription;
          }
        });

        return {
          category: result.category || '',
          amount: result.amount || '',
          description: result?.description,
        };
      });
    });

  return categories.map((category) => ({
    ...category,
    amount: parseCurrency(category.amount),
  }));
};

export const getTransactionDetails = async (
  page: Page,
): Promise<TransactionDetails> => {
  await expect(page).toHaveURL(
    /\/statistics\/(?:incomes|expenses|transfers)\/[\da-fA-F-]{36}/i,
    { timeout: 5000 },
  );

  await expect(page.getByTestId('balance-amount')).toBeVisible({
    timeout: 5000,
  });

  const amount = parseCurrency(
    (await page.getByTestId('balance-amount').textContent()) ?? '',
  );

  const description =
    (await page
      .getByTestId('details-list-item')
      .getByText('Description')
      .evaluate((el) => el.parentElement?.nextElementSibling?.textContent)) ??
    '';

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

  const categories = await getCategories(page);

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
    categories,
  };
};
