import { getAccountBalanceFromAccountListByName } from '$utils/account/getAccountBalanceFromAccountListByName';
import { applyFixture } from '$utils/applyFixture';
import { test, expect } from '$utils/financer-page';
import { deleteTransaction } from '$utils/transaction/deleteTransaction';
import { getTransactionDetails } from '$utils/transaction/getTransactionDetails';

test.describe('Delete Income', () => {
  test.beforeEach(async () => {
    await applyFixture();
  });

  test('should delete an income and verify account balance and that the transaction does not exist anymore', async ({
    page,
  }) => {
    await page.goto('/statistics/incomes');

    await page.getByTestId('transaction-list-item').first().click();

    const { id, toAccount, amount } = await getTransactionDetails(page);

    await page.goto('/accounts');

    const initialAccountBalance = await getAccountBalanceFromAccountListByName(
      page,
      toAccount as string,
    );

    await page.goto(`/statistics/incomes/${id}`);

    await deleteTransaction(page);
    await expect(page).not.toHaveURL(`/statistics/incomes/${id}`);

    await page.goto('/statistics/incomes');

    await expect(
      page.getByTestId('transaction-list-item').getByTestId(id),
    ).toBeHidden();

    await page.goto('/accounts');

    const updatedAccountBalance = await getAccountBalanceFromAccountListByName(
      page,
      toAccount as string,
    );

    expect(initialAccountBalance.minus(amount)).toEqual(updatedAccountBalance);
  });
});
