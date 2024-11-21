import Decimal from 'decimal.js';

import { applyFixture } from '$utils/applyFixture';
import { test, expect } from '$utils/financer-page';
import { getStatisticsDetails } from '$utils/statistics/getStatisticsDetails';
import { getTransactionDataFromTransactionList } from '$utils/transaction/getTransactionDataFromTransactionList';

test.describe('Statistics PagePreferences', () => {
  test.beforeEach(async () => {
    await applyFixture();
  });

  test('should be able to configure the statistics stats settings', async ({
    page,
  }) => {
    await page.goto('/statistics');

    const initialStatisticsStats = await getStatisticsDetails(page);

    await page.getByRole('link', { name: 'Settings' }).click();
    await page.getByRole('link', { name: 'User Preferences' }).click();
    await page.getByRole('link', { name: 'Statistics Page Settings' }).click();

    await page.locator('#PRE_ASSIGNED_CASH').check();

    await page
      .getByTestId('statistics-page-settings-form')
      .getByRole('button', { name: 'Save', exact: true })
      .click();

    await page.getByRole('link', { name: 'Accounts' }).click();

    await page.getByRole('link', { name: 'Pre-assigned CASH' }).click();

    const transactionAmount = (
      await getTransactionDataFromTransactionList(page)
    )[0].amount;

    await page.getByRole('link', { name: 'Statistics' }).click();

    const updatedStatisticsStats = await getStatisticsDetails(page);

    expect(updatedStatisticsStats.incomes).toEqual(new Decimal(0));
    expect(updatedStatisticsStats.expenses).toEqual(
      transactionAmount.negated(),
    );
    expect(updatedStatisticsStats.balance).not.toEqual(
      initialStatisticsStats.balance,
    );
  });
});
