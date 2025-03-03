import Decimal from 'decimal.js';

import { applyFixture } from '@/utils/applyFixture';
import { clickContextualNavigationItem } from '@/utils/common/clickContextualNavigationItem';
import { expect, test } from '@/utils/financer-page';
import { getTransactionDataFromTransactionList } from '@/utils/transaction/getTransactionDataFromTransactionList';
import { getTransactionsDetails } from '@/utils/transactions/getTransactionsDetails';

test.describe('Transactions & Statistics Preferences', () => {
  test.beforeEach(async () => {
    await applyFixture();
  });

  test('should be able to configure the statistics stats settings', async ({
    page,
  }) => {
    await page.goto('/transactions');

    const initialTransactionsStats = await getTransactionsDetails(page);

    await page.getByRole('link', { name: 'Settings' }).click();
    await clickContextualNavigationItem(page, 'Preferences');
    await page
      .getByRole('link', { name: 'Transactions & Statistics Settings' })
      .click();

    await page
      .locator('label')
      .filter({ hasText: 'Pre-assigned Cash' })
      .check();

    await page
      .getByTestId('statistics-page-settings-form')
      .getByRole('button', { name: 'Save Changes', exact: true })
      .click();

    await page.getByRole('link', { name: 'Accounts' }).click();

    await page.getByRole('link', { name: 'Pre-assigned CASH' }).click();

    const transactionAmount = (
      await getTransactionDataFromTransactionList(page)
    )[0].amount;

    await page.getByRole('link', { name: 'Transactions' }).click();

    const updatedTransactionsStats = await getTransactionsDetails(page);

    expect(updatedTransactionsStats.incomes).toEqual(new Decimal(0));
    expect(updatedTransactionsStats.expenses).toEqual(
      transactionAmount.negated(),
    );
    expect(updatedTransactionsStats.balance).not.toEqual(
      initialTransactionsStats.balance,
    );
  });
});
