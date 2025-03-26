import { getAccountBalanceFromAccountListByName } from '@/utils/account/getAccountBalanceFromAccountListByName';
import { applyFixture } from '@/utils/applyFixture';
import { expect, test } from '@/utils/financer-page';
import { deleteTransaction } from '@/utils/transaction/deleteTransaction';
import { getTransactionDetails } from '@/utils/transaction/getTransactionDetails';

test.describe('Expense Transactions', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture();
    await page.goto('/transactions');
  });

  test('should delete an expense and verify account balance and that the transaction does not exist anymore', async ({
    page,
  }) => {
    await page
      .getByTestId('transaction-list-item')
      .getByText('DUMMY EXPENSE 1')
      .click();

    const { id, fromAccount, amount } = await getTransactionDetails(page);

    await page.getByRole('link', { name: 'Accounts' }).click();

    const initialAccountBalance = await getAccountBalanceFromAccountListByName(
      page,
      fromAccount,
    );

    await page.goto(`/transactions/${id}`);

    await deleteTransaction(page);
    await expect(page).not.toHaveURL(`/transactions/${id}`);

    await page.getByRole('link', { name: 'Transactions' }).click();

    await expect(
      page.getByTestId('transaction-list-item').getByTestId(id),
    ).toBeHidden();

    await page.getByRole('link', { name: 'Accounts' }).click();

    const updatedAccountBalance = await getAccountBalanceFromAccountListByName(
      page,
      fromAccount,
    );

    expect(initialAccountBalance.minus(amount)).toEqual(updatedAccountBalance);
  });
});
