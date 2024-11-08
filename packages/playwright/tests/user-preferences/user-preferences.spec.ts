import Decimal from 'decimal.js';

import { TransactionType } from '$types/generated/financer';
import { fillUpdateMarketValueForm } from '$utils/account/fillUpdateMarketValueForm';
import { getAccountDetails } from '$utils/account/getAccountDetails';
import { applyFixture } from '$utils/applyFixture';
import { clickPopperItem } from '$utils/common/clickPopperItem';
import { getDashboardDetails } from '$utils/dashboard/getDashboardDetails';
import { test, expect } from '$utils/financer-page';
import { getStatisticsDetails } from '$utils/statistics/getStatisticsDetails';
import { getTransactionDataFromTransactionList } from '$utils/transaction/getTransactionDataFromTransactionList';
import { getTransactionFormValues } from '$utils/transaction/getTransactionFormValues';
import { switchTransactionType } from '$utils/transaction/switchTransactionType';

test.describe('Configuring User Preferences', () => {
  test.beforeEach(async () => {
    await applyFixture();
  });

  test.describe(`Dashboard Settings`, () => {
    test('should be able to configure the dashboard stats settings', async ({
      page,
    }) => {
      await page.goto('/');

      const initialDashboardStats = await getDashboardDetails(page);

      await page.getByRole('link', { name: 'Settings' }).click();
      await page.getByRole('link', { name: 'User Preferences' }).click();
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
      expect(updatedDashboardStats.expenses).toEqual(
        transactionAmount.negated(),
      );
    });
  });

  test.describe(`Statistics Page Settings`, () => {
    test('should be able to configure the statistics stats settings', async ({
      page,
    }) => {
      await page.goto('/statistics');

      const initialStatisticsStats = await getStatisticsDetails(page);

      await page.getByRole('link', { name: 'Settings' }).click();
      await page.getByRole('link', { name: 'User Preferences' }).click();
      await page
        .getByRole('link', { name: 'Statistics Page Settings' })
        .click();

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

  test.describe(`Default Account Settings`, () => {
    test('should be able to configure default account settings', async ({
      page,
    }) => {
      await page.goto('/');

      await page.getByTestId('add-transaction').click();

      const initialExpenseFormValues = await getTransactionFormValues(page);
      await switchTransactionType(page, TransactionType.Income);
      const initialIncomeFormValues = await getTransactionFormValues(page);
      await switchTransactionType(page, TransactionType.Transfer);
      const initialTransferFormValues = await getTransactionFormValues(page);

      expect(initialExpenseFormValues.fromAccount).toEqual('Select Account');
      expect(initialIncomeFormValues.toAccount).toEqual('Select Account');
      expect(initialTransferFormValues.fromAccount).toEqual('Select Account');
      expect(initialTransferFormValues.toAccount).toEqual('Select Account');

      await page.getByRole('button', { name: 'Close drawer' }).click();

      await page.getByRole('link', { name: 'Settings' }).click();
      await page.getByRole('link', { name: 'User Preferences' }).click();
      await page
        .getByRole('link', { name: 'Default Account Settings' })
        .click();

      await page
        .getByLabel('Default income account')
        .selectOption({ label: 'Big money' });
      await page
        .getByLabel('Default expense account')
        .selectOption({ label: 'Pre-assigned CASH' });
      await page
        .getByLabel('Default transfer source account')
        .selectOption({ label: 'Saving account 2' });
      await page
        .getByLabel('Default transfer target account')
        .selectOption({ label: 'Credit account' });

      await page
        .getByTestId('default-account-settings-form')
        .getByRole('button', { name: 'Save', exact: true })
        .click();

      await expect(page).toHaveURL('/settings/user-preferences/', {
        timeout: 5000,
      });

      await page.getByTestId('add-transaction').click();

      const updatedExpenseFormValues = await getTransactionFormValues(page);
      await switchTransactionType(page, TransactionType.Income);
      const updatedIncomeFormValues = await getTransactionFormValues(page);
      await switchTransactionType(page, TransactionType.Transfer);
      const updatedTransferFormValues = await getTransactionFormValues(page);

      expect(updatedIncomeFormValues.toAccount).toEqual('Big money');
      expect(updatedExpenseFormValues.fromAccount).toEqual('Pre-assigned CASH');
      expect(updatedTransferFormValues.fromAccount).toEqual('Saving account 2');
      expect(updatedTransferFormValues.toAccount).toEqual('Credit account');
    });
  });

  test.describe(`Market Update Settings`, () => {
    test('should be able to configure the statistics stats settings', async ({
      page,
    }) => {
      await page.goto('/');

      await page.getByRole('link', { name: 'Accounts' }).click();

      await page.getByRole('link', { name: 'Investment account' }).click();

      const { balance: initialBalance, name } = await getAccountDetails(page);

      await clickPopperItem(page, 'Update Market Value');

      await fillUpdateMarketValueForm(page, {
        currentMarketValue: initialBalance.plus(100),
      });

      await page
        .getByTestId('update-market-value-form')
        .getByRole('button', { name: 'Update' })
        .click();

      await page.getByRole('button', { name: 'Close drawer' }).click();

      await page.getByRole('link', { name: 'Accounts' }).click();
      await page.getByRole('link', { name }).click();

      const initialTransactions =
        await getTransactionDataFromTransactionList(page);

      expect(initialTransactions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ description: 'Market value change' }),
        ]),
      );

      expect(initialTransactions).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            description: 'dummy update text for market update',
          }),
        ]),
      );

      await page.getByRole('link', { name: 'Settings' }).click();
      await page.getByRole('link', { name: 'User Preferences' }).click();
      await page.getByRole('link', { name: 'Market Update Settings' }).click();

      await page
        .locator('#transactionDescription')
        .fill('dummy update text for market update');

      await page
        .locator('#category')
        .selectOption({ label: 'Category for all types' });

      await page
        .getByTestId('market-update-settings-form')
        .getByRole('button', { name: 'Save', exact: true })
        .click();

      await page.getByRole('link', { name: 'Market Update Settings' }).click();

      await expect(page.getByLabel('Transaction description')).toHaveValue(
        'dummy update text for market update',
      );

      await page.getByRole('link', { name: 'Accounts' }).click();
      await page.getByRole('link', { name }).click();

      const { balance: updatedBalance } = await getAccountDetails(page);

      await clickPopperItem(page, 'Update Market Value');

      await fillUpdateMarketValueForm(page, {
        currentMarketValue: updatedBalance.plus(100),
      });

      await page
        .getByTestId('update-market-value-form')
        .getByRole('button', { name: 'Update' })
        .click();

      await page.getByRole('button', { name: 'Close drawer' }).click();

      await page.getByRole('link', { name: 'Accounts' }).click();
      await page.getByRole('link', { name }).click();

      const updatedTransactions =
        await getTransactionDataFromTransactionList(page);

      expect(updatedTransactions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            description: 'dummy update text for market update',
          }),
        ]),
      );
    });
  });
});
