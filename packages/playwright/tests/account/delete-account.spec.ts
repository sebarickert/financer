import { applyFixture } from '$utils/load-fixtures';
import { test, expect } from '$utils/financer-page';

test.describe('Account deleting', () => {
      test.beforeEach(async ({ page }) => {
        await applyFixture('accounts-only');    
        await page.goto('/accounts');
      });
    
    test('Account deleting', async ({ page }) => {
    await page.waitForSelector('[data-testid="account-row"]');

    const accountRow = page.getByTestId('account-row').getByText("Saving account 2")
    expect(accountRow).not.toBeNull();

    await accountRow.click();
    await page.waitForSelector('[data-testid="delete-account"]');

    await page.click('[data-testid="delete-account"]');
    await page.waitForSelector('[data-testid="delete-account_confirm-button"]');

    await page.click('[data-testid="delete-account_confirm-button"]');
    await page.waitForSelector('[data-testid="account-row"]', { state: 'hidden' });

    await page.waitForSelector('[data-testid="account-row"]');
    const deletedAccountRow = await page.$(`[data-testid="account-row"]:has-text("Saving account 2")`);
    expect(deletedAccountRow).toBeNull();
      });

    test('Should not delete account on modal cancel', async ({ page }) => {
    await page.waitForSelector('[data-testid="account-row"]');

    const accountRow = page.getByTestId('account-row').getByText("Saving account 2")
    expect(accountRow).not.toBeNull();

    await accountRow.click();

    await page.getByTestId("delete-account").click();

    await page.getByTestId("delete-account_cancel-button").click();

    await page.getByTestId("header-back-link").click();

    await page.waitForSelector('[data-testid="account-row"]');
    const deletedAccountRow = await page.$(`[data-testid="account-row"]:has-text("Saving account 2")`);
    expect(deletedAccountRow).not.toBeNull();
    });

});