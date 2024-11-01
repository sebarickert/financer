import Decimal from 'decimal.js';

import { fillAccountForm } from '$utils/account/fillAccountForm';
import { getAccountDataFromAccountList } from '$utils/account/getAccountDataFromAccountList';
import { getAccountDetails } from '$utils/account/getAccountDetails';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe.parallel('Add Account', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('accounts-only');
    await page.goto('/accounts');
  });

  [
    'Cash',
    'Savings',
    'Investment',
    'Credit',
    'Loan',
    'Long term savings',
    'Pre assigned cash',
  ].forEach((type) => {
    test(`should add ${type.toLowerCase()} account and verify it appears in account list and is correct type`, async ({
      page,
    }) => {
      const initialAccounts = await getAccountDataFromAccountList(page);
      await page.getByTestId('add-account').click();

      expect(
        initialAccounts.some(
          (account) => account.name === `New ${type} Account`,
        ),
      ).not.toBe(true);

      await fillAccountForm(page, {
        name: `New ${type} Account`,
        balance: new Decimal(1000),
        type,
      });

      await page.getByTestId('account-form').getByTestId('submit').click();

      await expect(page).toHaveURL(/\/accounts\/?$/);

      const updatedAccounts = await getAccountDataFromAccountList(page);

      expect(
        updatedAccounts.some(
          (account) => account.name === `New ${type} Account`,
        ),
      ).toBe(true);
      expect(
        updatedAccounts.find(
          (account) => account.name === `New ${type} Account`,
        )?.balance,
      ).toEqual(new Decimal(1000));

      await page.getByText(`New ${type} Account`).click();

      // TODO figure out how to achieve without waiting...
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await page.waitForTimeout(1000);

      const { type: accountType } = await getAccountDetails(page);

      expect(accountType).toEqual(type);
    });
  });
});
