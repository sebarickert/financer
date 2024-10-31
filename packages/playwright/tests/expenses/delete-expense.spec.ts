import { getAccountBalanceFromAccountListByName } from '$utils/account/getAccountBalanceFromAccountListByName';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';
import { deleteTransaction } from '$utils/transaction/deleteTransaction';
import { getTransactionDetails } from '$utils/transaction/getTransactionDetails';

test.describe('Delete Expense', () => {
  test.beforeEach(async () => {
    await applyFixture('large');
  });

  test('should delete an expense and verify account balance and that the transaction does not exist anymore', async ({
    page,
  }) => {
    await page.goto('/statistics/expenses/?date=2022-1');

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

    await page.goto('/statistics/expenses/?date=2022-1');

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
