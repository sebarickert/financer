import { Locator, expect } from '@playwright/test';
import Decimal from 'decimal.js';

import { Page } from '$utils/financer-page';

const getFieldValue = async (locator: Locator) => {
  if ((await locator.count()) > 0) {
    const tagName = await locator.evaluate((el) => el.tagName);

    if (tagName === 'SELECT') {
      const selectedOption = await locator
        .locator('option:checked')
        .textContent();
      return selectedOption ? selectedOption.trim() : undefined;
    }

    return locator.inputValue();
  }

  return undefined;
};

interface TransactionFormFields {
  date?: string;
  description?: string;
  amount?: Decimal;
  fromAccount?: string;
  toAccount?: string;
  categories?: string[];
}

export const getTransactionFormValues = async (
  page: Page,
  formLocation: 'page' | 'drawer' = 'drawer',
): Promise<TransactionFormFields> => {
  const transactionForm =
    formLocation === 'page'
      ? page.getByTestId('layout-root').getByTestId('transaction-form')
      : page.getByTestId('transaction-drawer').getByTestId('transaction-form');

  await expect(transactionForm).toBeVisible({
    timeout: 5000,
  });

  const date = await getFieldValue(transactionForm.locator('#date'));
  const description = await getFieldValue(
    transactionForm.locator('#description'),
  );
  const amount = await getFieldValue(transactionForm.locator('#amount'));
  const toAccount = await getFieldValue(transactionForm.locator('#toAccount'));
  const fromAccount = await getFieldValue(
    transactionForm.locator('#fromAccount'),
  );

  const hasCategories = await page
    .getByTestId('transaction-categories-item-summary')
    .first()
    .isVisible();

  const categories: string[] = [];

  if (hasCategories) {
    const categoryElements = await page
      .getByTestId('transaction-categories-item-summary')
      .evaluateAll((elements) =>
        elements.map(
          (element) =>
            element.querySelector('[data-testid="category-label"]')
              ?.textContent || '',
        ),
      );

    categories.push(...categoryElements);
  }

  return {
    date,
    description,
    amount: amount ? new Decimal(amount) : undefined,
    toAccount,
    fromAccount,
    categories,
  };
};
