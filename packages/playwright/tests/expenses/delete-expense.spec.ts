import { getAccountBalanceFromAccountListByName } from '$utils/account/getAccountBalanceFromAccountListByName';
import { applyFixture } from '$utils/applyFixture';
import { test, expect } from '$utils/financer-page';
import { deleteTransaction } from '$utils/transaction/deleteTransaction';
import { getTransactionDetails } from '$utils/transaction/getTransactionDetails';

test.describe('Expense Transactions', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture();
    await page.goto('/statistics/expenses');
  });

  test('should delete an expense and verify account balance and that the transaction does not exist anymore', async ({
    page,
  }) => {
    await page.getByTestId('transaction-list-item').first().click();

    const { id, fromAccount, amount } = await getTransactionDetails(page);

    await page.getByRole('link', { name: 'Accounts' }).click();

    const initialAccountBalance = await getAccountBalanceFromAccountListByName(
      page,
      fromAccount as string,
    );

    await page.goto(`/statistics/expenses/${id}`);

    await deleteTransaction(page);
    await expect(page).not.toHaveURL(`/statistics/expenses/${id}`);

    await page.getByRole('link', { name: 'Statistics' }).click();
    await page.getByRole('link', { name: 'Expenses' }).click();

    await expect(
      page.getByTestId('transaction-list-item').getByTestId(id),
    ).toBeHidden();

    await page.getByRole('link', { name: 'Accounts' }).click();

    const updatedAccountBalance = await getAccountBalanceFromAccountListByName(
      page,
      fromAccount as string,
    );

    expect(initialAccountBalance.minus(amount)).toEqual(updatedAccountBalance);
  });
});
