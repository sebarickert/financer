import { TransactionType } from '@/types/generated/financer';
import { Page, expect } from '@/utils/financer-page';

const capitalize = (string: string): string =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const switchTransactionType = async (
  page: Page,
  transactionType: TransactionType,
) => {
  await expect(
    page
      .getByTestId('transaction-drawer')
      .getByTestId('transaction-type-switcher'),
  ).toBeVisible();

  await page
    .getByTestId('transaction-drawer')
    .getByTestId('transaction-type-switcher')
    .locator('label', { hasText: capitalize(transactionType.toLowerCase()) })
    .check();

  await expect(
    page
      .getByTestId('transaction-drawer')
      .getByTestId('transaction-type-switcher')
      .getByLabel(capitalize(transactionType.toLowerCase())),
  ).toBeChecked();
};
