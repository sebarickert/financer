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
    const accountRow = page
      .getByTestId('account-row')
      .getByText('Saving account 2');
    await expect(accountRow).toHaveCount(1);

    await accountRow.click();

    await page.getByTestId('popper-button').click();
    await page
      .getByTestId('popper-container')
      .getByRole('button', { name: 'Delete' })
      .click();

    await page
      .getByTestId('drawer')
      .getByRole('button', { name: 'Delete' })
      .click();

    const deletedAccountRow = page
      .getByTestId('account-row')
      .getByText('Saving account 2');

    await expect(deletedAccountRow).toHaveCount(0);
  });

  test('should not delete an account on form cancel and verify it remains on the list', async ({
    page,
  }) => {
    const accountRowBefore = page
      .getByTestId('account-row')
      .getByText('Saving account 2');

    await expect(accountRowBefore).toHaveCount(1);

    await accountRowBefore.click();

    await page.getByTestId('popper-button').click();
    await page
      .getByTestId('popper-container')
      .getByRole('button', { name: 'Delete' })
      .click();

    await page
      .getByTestId('drawer')
      .getByRole('button', { name: 'Cancel' })
      .click();

    await page.getByTestId('header-back-link').click();

    const accountRowAfter = page
      .getByTestId('account-row')
      .getByText('Saving account 2');

    await expect(accountRowAfter).toHaveCount(1);
  });
});
