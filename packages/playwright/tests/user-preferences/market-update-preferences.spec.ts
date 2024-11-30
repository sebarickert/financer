import { fillUpdateMarketValueForm } from '$utils/account/fillUpdateMarketValueForm';
import { getAccountDetails } from '$utils/account/getAccountDetails';
import { applyFixture } from '$utils/applyFixture';
import { clickPopperItem } from '$utils/common/clickPopperItem';
import { test, expect } from '$utils/financer-page';
import { getTransactionDataFromTransactionList } from '$utils/transaction/getTransactionDataFromTransactionList';

test.describe('Market Update Preferences', () => {
  test.beforeEach(async () => {
    await applyFixture();
  });

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

    await page.getByRole('link', { name: 'Accounts' }).click();
    await expect(page).toHaveURL(/\/accounts\/?$/);
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
    await page.getByRole('link', { name: 'Preferences' }).click();
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
    await expect(page).toHaveURL(/\/accounts\/?$/);
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

    await page.getByRole('link', { name: 'Accounts' }).click();
    await expect(page).toHaveURL(/\/accounts\/?$/);
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
