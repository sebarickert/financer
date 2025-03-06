import Decimal from 'decimal.js';

import { fillAccountForm } from '@/utils/account/fillAccountForm';
import { getAccountDataFromAccountList } from '@/utils/account/getAccountDataFromAccountList';
import { getAccountDetails } from '@/utils/account/getAccountDetails';
import { applyFixture } from '@/utils/applyFixture';
import { accountTypes } from '@/utils/constants';
import { expect, test } from '@/utils/financer-page';

test.describe.parallel('Add Account', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture();
    await page.goto('/accounts');
  });

  accountTypes
    .map((type) => ({
      type,
      balance: new Decimal(parseFloat((Math.random() * 1000).toFixed(2))),
    }))
    .forEach(({ type, balance }) => {
      test(`should add "${type}" account and verify it appears in account list and is correct type`, async ({
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
          balance,
          type,
        });

        await page
          .getByTestId('account-form')
          .locator('button[type=submit]')
          .click();

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
        ).toEqual(balance);

        await page
          .getByTestId('account-row')
          .getByText(`New ${type} Account`)
          .click();

        const { type: accountType } = await getAccountDetails(page);

        expect(accountType).toEqual(type);
      });
    });
});
