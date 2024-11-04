import { getAccountDataFromAccountList } from '$utils/account/getAccountDataFromAccountList';
import { clickPopperItem } from '$utils/common/clickPopperItem';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Delete Account', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('accounts-only');
    await page.goto('/accounts');
  });

  test('should delete an account and verify it is removed from the list', async ({
    page,
  }) => {
    const initialAccounts = await getAccountDataFromAccountList(page);

    expect(
      initialAccounts.some((account) => account.name === 'Saving account 2'),
    ).toEqual(true);

    await page.getByTestId('account-row').getByText('Saving account 2').click();

    await clickPopperItem(page, 'Delete');

    await page
      .getByTestId('drawer')
      .getByRole('button', { name: 'Delete' })
      .click();

    const updatedAccounts = await getAccountDataFromAccountList(page);

    expect(
      updatedAccounts.some((account) => account.name === 'Saving account 2'),
    ).toEqual(false);

    expect(initialAccounts.length - updatedAccounts.length).toEqual(1);
  });

  test('should not delete an account on form cancel and verify it remains on the list', async ({
    page,
  }) => {
    const initialAccounts = await getAccountDataFromAccountList(page);

    expect(
      initialAccounts.some((account) => account.name === 'Saving account 2'),
    ).toEqual(true);

    await page.getByTestId('account-row').getByText('Saving account 2').click();

    await clickPopperItem(page, 'Delete');

    await page
      .getByTestId('drawer')
      .getByRole('button', { name: 'Cancel' })
      .click();

    await page.getByTestId('header-back-link').click();

    const updatedAccounts = await getAccountDataFromAccountList(page);

    expect(
      updatedAccounts.some((account) => account.name === 'Saving account 2'),
    ).toEqual(true);

    expect(initialAccounts).toHaveLength(updatedAccounts.length);
  });
});
