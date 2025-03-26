import { getAccountBalanceFromAccountListByName } from '@/utils/account/getAccountBalanceFromAccountListByName';
import { applyFixture } from '@/utils/applyFixture';
import { expect, test } from '@/utils/financer-page';
import { deleteTransaction } from '@/utils/transaction/deleteTransaction';
import { getTransactionDetails } from '@/utils/transaction/getTransactionDetails';

test.describe('Delete Income', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture();
    await page.goto('/transactions');
  });

  test('should delete an income and verify account balance and that the transaction does not exist anymore', async ({
    page,
  }) => {
    await page
      .getByTestId('transaction-list-item')
      .getByText('DUMMY INCOME 1')
      .click();

    const { id, toAccount, amount } = await getTransactionDetails(page);

    await page.getByRole('link', { name: 'Accounts' }).click();

    const initialAccountBalance = await getAccountBalanceFromAccountListByName(
      page,
      toAccount,
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
      toAccount,
    );

    expect(initialAccountBalance.minus(amount)).toEqual(updatedAccountBalance);
  });
});
