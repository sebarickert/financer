import { getAccountBalanceFromAccountListByName } from '$utils/account/getAccountBalanceFromAccountListByName';
import { applyFixture } from '$utils/applyFixture';
import { test, expect } from '$utils/financer-page';
import { deleteTransaction } from '$utils/transaction/deleteTransaction';
import { getTransactionDetails } from '$utils/transaction/getTransactionDetails';

test.describe('Expense Transactions', () => {
  test.beforeEach(async () => {
    await applyFixture();
  });

  test('should delete an expense and verify account balance and that the transaction does not exist anymore', async ({
    page,
  }) => {
    await page.goto('/statistics/expenses');

    await page.getByTestId('transaction-list-item').first().click();

    const { id, fromAccount, amount } = await getTransactionDetails(page);

    await page.goto('/accounts');

    const initialAccountBalance = await getAccountBalanceFromAccountListByName(
      page,
      fromAccount as string,
    );

    await page.goto(`/statistics/expenses/${id}`);

    await deleteTransaction(page);
    await expect(page).not.toHaveURL(`/statistics/expenses/${id}`);

    await page.goto('/statistics/expenses');

    await expect(
      page.getByTestId('transaction-list-item').getByTestId(id),
    ).toBeHidden();

    await page.goto('/accounts');

    const updatedAccountBalance = await getAccountBalanceFromAccountListByName(
      page,
      fromAccount as string,
    );

    expect(initialAccountBalance.minus(amount)).toEqual(updatedAccountBalance);
  });
});
