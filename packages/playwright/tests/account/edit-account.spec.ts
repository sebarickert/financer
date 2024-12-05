import Decimal from 'decimal.js';

import { TransactionType } from '$types/generated/financer';
import { fillAccountForm } from '$utils/account/fillAccountForm';
import { fillUpdateMarketValueForm } from '$utils/account/fillUpdateMarketValueForm';
import { getAccountDetails } from '$utils/account/getAccountDetails';
import { applyFixture } from '$utils/applyFixture';
import { clickPopperItem } from '$utils/common/clickPopperItem';
import { accountTypes } from '$utils/constants';
import { test, expect } from '$utils/financer-page';
import { getTransactionDataFromTransactionList } from '$utils/transaction/getTransactionDataFromTransactionList';

test.describe('Edit Account', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture();
    await page.goto('/accounts');
  });

  test.describe('Edit Account Details', () => {
    [
      'Cash account',
      'Saving account 1',
      'Saving account 2',
      'Investment account',
      'Loan account',
      'Credit account',
    ].forEach((accountName) => {
      test(`should update details for "${accountName}" account and verify changes are saved`, async ({
        page,
      }) => {
        await page.getByTestId('account-row').getByText(accountName).click();

        const {
          name: initialName,
          balance: initialBalance,
          upcomingBalance: initialUpcomingBalance,
          type: initialType,
        } = await getAccountDetails(page);

        await clickPopperItem(page, 'Edit');

        await fillAccountForm(page, {
          name: `${initialName} updated`,
          balance: initialUpcomingBalance
            ? initialUpcomingBalance.plus(100)
            : initialBalance.plus(100),
          type: accountTypes.find((type) => type !== initialType),
        });

        await page
          .getByTestId('account-form')
          .locator('button[type=submit]')
          .click();

        const {
          name: updatedName,
          balance: updatedBalance,
          upcomingBalance: updatedUpcomingBalance,
          type: updatedType,
        } = await getAccountDetails(page);

        expect(updatedName).toEqual(`${initialName} updated`);
        expect(
          updatedUpcomingBalance ? updatedUpcomingBalance : updatedBalance,
        ).toEqual(
          initialUpcomingBalance
            ? initialUpcomingBalance.plus(100)
            : initialBalance.plus(100),
        );
        expect(updatedType).toEqual(
          accountTypes.find((type) => type !== initialType),
        );
      });
    });
  });

  test.describe('Market Value', () => {
    test('should update market value (positive) for investment account and verify changes are saved', async ({
      page,
    }) => {
      await page
        .getByTestId('account-row')
        .getByText('Investment account')
        .click();

      const {
        balance: initialBalance,
        upcomingBalance: initialUpcomingBalance,
      } = await getAccountDetails(page);

      await clickPopperItem(page, 'Update Market Value');

      await fillUpdateMarketValueForm(page, {
        currentMarketValue: initialUpcomingBalance
          ? initialUpcomingBalance.plus(100)
          : initialBalance.plus(100),
      });

      await page
        .getByTestId('update-market-value-form')
        .getByRole('button', { name: 'Update' })
        .click();

      await page.getByRole('link', { name: 'Accounts' }).click();
      await page
        .getByTestId('account-row')
        .getByText('Investment account')
        .click();

      const {
        balance: updatedBalance,
        upcomingBalance: updatedUpcomingBalance,
      } = await getAccountDetails(page);
      const transactionItems =
        await getTransactionDataFromTransactionList(page);

      const createdTransaction = transactionItems.find(
        (transaction) => transaction.description === 'Market value change',
      );

      expect(
        updatedUpcomingBalance ? updatedUpcomingBalance : updatedBalance,
      ).toEqual(
        initialUpcomingBalance
          ? initialUpcomingBalance.plus(100)
          : initialBalance.plus(100),
      );
      expect(createdTransaction).toBeTruthy();
      expect(createdTransaction?.amount).toEqual(new Decimal(100));
      expect(createdTransaction?.type).toEqual(TransactionType.Income);
    });

    test('should update market value (negative) for investment account and verify changes are saved', async ({
      page,
    }) => {
      await page
        .getByTestId('account-row')
        .getByText('Investment account')
        .click();

      const {
        balance: initialBalance,
        upcomingBalance: initialUpcomingBalance,
      } = await getAccountDetails(page);

      await clickPopperItem(page, 'Update Market Value');

      await fillUpdateMarketValueForm(page, {
        currentMarketValue: initialUpcomingBalance
          ? initialUpcomingBalance.minus(100)
          : initialBalance.minus(100),
      });

      await page
        .getByTestId('update-market-value-form')
        .getByRole('button', { name: 'Update' })
        .click();

      await page.getByRole('link', { name: 'Accounts' }).click();
      await page
        .getByTestId('account-row')
        .getByText('Investment account')
        .click();

      const {
        balance: updatedBalance,
        upcomingBalance: updatedUpcomingBalance,
      } = await getAccountDetails(page);
      const transactionItems =
        await getTransactionDataFromTransactionList(page);

      const createdTransaction = transactionItems.find(
        (transaction) => transaction.description === 'Market value change',
      );

      expect(
        updatedUpcomingBalance ? updatedUpcomingBalance : updatedBalance,
      ).toEqual(
        initialUpcomingBalance
          ? initialUpcomingBalance.minus(100)
          : initialBalance.minus(100),
      );
      expect(createdTransaction).toBeTruthy();
      expect(createdTransaction?.amount).toEqual(new Decimal(100).negated());
      expect(createdTransaction?.type).toEqual(TransactionType.Expense);
    });
  });
});
