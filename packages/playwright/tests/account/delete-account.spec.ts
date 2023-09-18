import { applyFixture } from '$utils/load-fixtures';
import { test, expect } from '$utils/financer-page';

test.describe('Account deleting', () => {
    test.beforeEach(async ({ page }) => {
      await applyFixture('accounts-only');    
      await page.goto('/accounts');
    });
    
    test('Account deleting', async ({ page }) => {
      await page.getByTestId('account-row').first().waitFor()

      const accountRow = page.getByTestId('account-row').getByText("Saving account 2")
      expect(accountRow).not.toBeNull();

      await accountRow.click();
      await page.getByTestId('delete-account').waitFor()

      await page.getByTestId("delete-account").click();
      await page.getByTestId('delete-account_confirm-button').waitFor()

      await page.getByTestId("delete-account_confirm-button").click();

      await page.getByTestId('account-row').first().waitFor()
      const deletedAccountRow = await page.$(`[data-testid="account-row"]:has-text("Saving account 2")`);
      expect(deletedAccountRow).toBeNull();
    });

    test('Should not delete account on modal cancel', async ({ page }) => {
      await page.getByTestId('account-row').first().waitFor()

      const accountRow = page.getByTestId('account-row').getByText("Saving account 2")
      expect(accountRow).not.toBeNull();

      await accountRow.click();

      await page.getByTestId("delete-account").click();

      await page.getByTestId("delete-account_cancel-button").click();

      await page.getByTestId("header-back-link").click();

      await page.getByTestId('account-row').first().waitFor()
      const deletedAccountRow = await page.$(`[data-testid="account-row"]:has-text("Saving account 2")`);
      expect(deletedAccountRow).not.toBeNull();
    });

});