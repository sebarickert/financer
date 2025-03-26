import { getAccountBalanceFromAccountListByName } from '@/utils/account/getAccountBalanceFromAccountListByName';
import { applyFixture } from '@/utils/applyFixture';
import { expect, test } from '@/utils/financer-page';
import { deleteTransaction } from '@/utils/transaction/deleteTransaction';
import { getTransactionDetails } from '@/utils/transaction/getTransactionDetails';

test.describe('Delete Transfer', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture();
    await page.goto('/transactions');
  });

  test('should delete an transfer and verify account balances and that the transaction does not exist anymore', async ({
    page,
  }) => {
    await page
      .getByTestId('transaction-list-item')
      .getByText('Dummy TRANSFER from Big money to Investment account')
      .click();

    const { id, toAccount, fromAccount, amount } =
      await getTransactionDetails(page);

    await page.getByRole('link', { name: 'Accounts' }).click();

    const initialFromAccountBalance =
      await getAccountBalanceFromAccountListByName(page, fromAccount);
    const initialToAccountBalance =
      await getAccountBalanceFromAccountListByName(page, toAccount);

    await page.goto(`/transactions/${id}`);

    await deleteTransaction(page);
    await expect(page).not.toHaveURL(`/transactions/${id}`);

    await page.getByRole('link', { name: 'Transactions' }).click();

    await expect(
      page.getByTestId('transaction-list-item').getByTestId(id),
    ).toBeHidden();

    await page.getByRole('link', { name: 'Accounts' }).click();

    const updatedFromAccountBalance =
      await getAccountBalanceFromAccountListByName(page, fromAccount);
    const updatedToAccountBalance =
      await getAccountBalanceFromAccountListByName(page, toAccount);

    expect(initialFromAccountBalance.plus(amount)).toEqual(
      updatedFromAccountBalance,
    );
    expect(initialToAccountBalance.minus(amount)).toEqual(
      updatedToAccountBalance,
    );
  });
});
