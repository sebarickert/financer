import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Account deleting', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('accounts-only');
    await page.goto('/accounts');
  });

  test('Account deleting', async ({ page }) => {
    const accountRow = page
      .getByTestId('account-row')
      .getByText('Saving account 2');
    await expect(accountRow).toHaveCount(1);

    await accountRow.click();

    await page.getByTestId('delete-account').click();

    await page.getByTestId('delete-account_confirm-button').click();

    const deletedAccountRow = page
      .getByTestId('account-row')
      .getByText('Saving account 2');
    await expect(deletedAccountRow).toHaveCount(0);
  });

  test('Should not delete account on modal cancel', async ({ page }) => {
    const accountRow = page
      .getByTestId('account-row')
      .getByText('Saving account 2');
    await expect(accountRow).toHaveCount(1);

    await accountRow.click();

    await page.getByTestId('delete-account').click();

    await page.getByTestId('delete-account_cancel-button').click();

    await page.getByTestId('header-back-link').click();

    const deletedAccountRow = page
      .getByTestId('account-row')
      .getByText('Saving account 2');

    await expect(deletedAccountRow).toHaveCount(1);
  });
});
