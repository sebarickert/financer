import { test, expect, Page } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe.parallel('Account creation', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('accounts-only');
    await page.goto('/accounts');
  });

  const addAccountAndVerifyDetails = async (
    page: Page,
    accountType: string,
    accountBalance: string,
    expectedBalance: string,
  ) => {
    const newAccountName = `New Test ${accountType} Account ${Math.random()}`;
    const accountRow = page
      .getByTestId('account-row')
      .getByText(newAccountName);
    await expect(accountRow).toHaveCount(0);

    await page.getByTestId('add-account').click();

    // Add account form
    await page.locator('#name').fill(newAccountName);
    await page.locator('#balance').fill(accountBalance);
    await page.locator('#type').selectOption({ label: accountType });
    await page.getByTestId('account-form').getByTestId('submit').click();

    await expect(page).toHaveURL(/\/accounts\/?$/);

    await page.getByText(newAccountName).click();

    await expect(page).not.toHaveURL(/\/accounts\/?$/);

    await expect(
      page
        .getByTestId('account-details')
        .getByTestId('account-details-item-description'),
    ).toHaveText(accountType);
    await expect(page.getByTestId('account-balance')).toHaveText(
      expectedBalance,
    );
  };

  // eslint-disable-next-line playwright/expect-expect
  test('Add Cash account', async ({ page }) => {
    await addAccountAndVerifyDetails(page, 'Credit', '1000', '1 000,00 €');
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add Saving account', async ({ page }) => {
    await addAccountAndVerifyDetails(page, 'Savings', '0', '0,00 €');
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add Investment account', async ({ page }) => {
    await addAccountAndVerifyDetails(page, 'Investment', '0.16', '0,16 €');
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add Credit account', async ({ page }) => {
    await addAccountAndVerifyDetails(
      page,
      'Credit',
      '99000000',
      '99 000 000,00 €',
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add Loan account', async ({ page }) => {
    await addAccountAndVerifyDetails(page, 'Loan', '1', '1,00 €');
  });
});
