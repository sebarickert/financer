import Decimal from 'decimal.js';

import { getAccountDetails } from '$utils/account/getAccountDetails';
import { applyFixture } from '$utils/applyFixture';
import { getDashboardDetails } from '$utils/dashboard/getDashboardDetails';
import { test, expect } from '$utils/financer-page';
import { getTransactionDataFromTransactionList } from '$utils/transaction/getTransactionDataFromTransactionList';

test.describe('Dashboard Preferences', () => {
  test.beforeEach(async () => {
    await applyFixture();
  });

  test('should be able to configure the dashboard stats settings', async ({
    page,
  }) => {
    await page.goto('/');

    const initialDashboardStats = await getDashboardDetails(page);

    await page.getByRole('link', { name: 'Settings' }).click();
    await page.getByRole('link', { name: 'Preferences' }).click();
    await page.getByRole('link', { name: 'Dashboard Settings' }).click();

    await page.locator('#PRE_ASSIGNED_CASH').check();

    await page
      .getByTestId('dashboard-settings-form')
      .getByRole('button', { name: 'Save', exact: true })
      .click();

    await page.getByRole('link', { name: 'Accounts' }).click();

    await page.getByRole('link', { name: 'Pre-assigned CASH' }).click();

    const { balance: accountBalance } = await getAccountDetails(page);
    const transactionAmount = (
      await getTransactionDataFromTransactionList(page)
    )[0].amount;

    await page.getByRole('link', { name: 'Home' }).click();

    const updatedDashboardStats = await getDashboardDetails(page);

    expect(updatedDashboardStats.balance).not.toEqual(
      initialDashboardStats.balance,
    );
    expect(updatedDashboardStats.balance).toEqual(accountBalance);
    expect(updatedDashboardStats.incomes).toEqual(new Decimal(0));
    expect(updatedDashboardStats.expenses).toEqual(transactionAmount.negated());
  });

  test('should be able to configure the dashboard list chunk size', async ({
    page,
  }) => {
    await page.goto('/');

    const initialDashboardStats = await getDashboardDetails(page);

    await page.getByRole('link', { name: 'Settings' }).click();
    await page.getByRole('link', { name: 'Preferences' }).click();
    await page
      .getByRole('link', { name: 'Maximum Items Per Page Settings' })
      .click();

    await page.locator('#chunkSize').fill('10');

    await page
      .getByTestId('dashboard-chunk-size-settings-form')
      .getByRole('button', { name: 'Save', exact: true })
      .click();

    await page.getByRole('link', { name: 'Home' }).click();

    const updatedDashboardStats = await getDashboardDetails(page);

    expect(updatedDashboardStats.transactionListItemCount).not.toEqual(
      initialDashboardStats.transactionListItemCount,
    );
    expect(updatedDashboardStats.transactionListItemCount).toEqual(10);
  });
});
