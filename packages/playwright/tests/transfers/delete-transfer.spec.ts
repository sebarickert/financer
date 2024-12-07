import { getAccountBalanceFromAccountListByName } from '$utils/account/getAccountBalanceFromAccountListByName';
import { applyFixture } from '$utils/applyFixture';
import { test, expect } from '$utils/financer-page';
import { deleteTransaction } from '$utils/transaction/deleteTransaction';
import { getTransactionDetails } from '$utils/transaction/getTransactionDetails';

test.describe('Delete Transfer', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture();
    await page.goto('/statistics/transfers');
  });

  test('should delete an transfer and verify account balances and that the transaction does not exist anymore', async ({
    page,
  }) => {
    await page.getByTestId('transaction-list-item').first().click();

    const { id, toAccount, fromAccount, amount } =
      await getTransactionDetails(page);

    await page.getByRole('link', { name: 'Accounts' }).click();

    const initialFromAccountBalance =
      await getAccountBalanceFromAccountListByName(page, fromAccount as string);
    const initialToAccountBalance =
      await getAccountBalanceFromAccountListByName(page, toAccount as string);

    await page.goto(`/statistics/transfers/${id}`);

    await deleteTransaction(page);
    await expect(page).not.toHaveURL(`/statistics/transfers/${id}`);

    await page.getByRole('link', { name: 'Statistics' }).click();
    await page.getByRole('link', { name: 'Transfers' }).click();

    await expect(
      page.getByTestId('transaction-list-item').getByTestId(id),
    ).toBeHidden();

    await page.getByRole('link', { name: 'Accounts' }).click();

    const updatedFromAccountBalance =
      await getAccountBalanceFromAccountListByName(page, fromAccount as string);
    const updatedToAccountBalance =
      await getAccountBalanceFromAccountListByName(page, toAccount as string);

    expect(initialFromAccountBalance.plus(amount)).toEqual(
      updatedFromAccountBalance,
    );
    expect(initialToAccountBalance.minus(amount)).toEqual(
      updatedToAccountBalance,
    );
  });
});
