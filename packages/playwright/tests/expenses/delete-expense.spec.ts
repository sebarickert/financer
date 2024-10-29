import { ExpenseListItemDto } from '$types/generated/financer';
import {
  getAccountFromTransactionListItem,
  getAllExpenses,
} from '$utils/api-helper';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Delete expense', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('large');
    await page.goto('/statistics/expenses');
  });

  test('should delete the latest expense and verify that account balance has changed and the transaction does not exist anymore', async ({
    page,
  }) => {
    const expenses = await getAllExpenses();

    const targetTransaction = expenses.at(-1) as ExpenseListItemDto;

    const targetAccountId =
      await getAccountFromTransactionListItem(targetTransaction);

    await page.goto(`/accounts/${targetAccountId}`);

    const accountBalanceBefore = (await page
      .getByTestId('account-balance')
      .textContent()) as string;

    const year = new Date(targetTransaction.date).getFullYear();
    const month = (new Date(targetTransaction.date).getMonth() + 1)
      .toString()
      .padStart(2, '0');

    const dateQuery = `${year}-${month}`;
    await page.goto(`/statistics/expenses?date=${dateQuery}&page=1`);

    await page.getByTestId(targetTransaction.id).click();
    await page.getByTestId('edit-expense-button').click();
    await page.getByTestId('delete-transaction').click();
    await page.getByTestId('delete-transaction-confirm').click();

    await expect(page).not.toHaveURL(`/${targetTransaction.id}`);

    await page.goto(`/statistics/expenses?date=${dateQuery}&page=1`);

    await expect(page.getByTestId(targetTransaction.id)).toBeHidden();

    await page.goto(`/accounts/${targetAccountId}`);

    const accountBalanceAfter = (await page
      .getByTestId('account-balance')
      .textContent()) as string;

    const balanceBefore = parseFloat(
      accountBalanceBefore.replace(/[^0-9,-]+/g, '').replace(',', '.'),
    );
    const balanceAfter = parseFloat(
      accountBalanceAfter.replace(/[^0-9,-]+/g, '').replace(',', '.'),
    );

    expect(balanceBefore - targetTransaction.amount).toBe(balanceAfter);
  });

  test('should delete the oldest expense and verify that account balance has changed and the transaction does not exist anymore', async ({
    page,
  }) => {
    const expenses = await getAllExpenses();

    const targetTransaction = expenses.at(0) as ExpenseListItemDto;

    const targetAccountId =
      await getAccountFromTransactionListItem(targetTransaction);

    await page.goto(`/accounts/${targetAccountId}`);

    const accountBalanceBefore = (await page
      .getByTestId('account-balance')
      .textContent()) as string;

    const year = new Date(targetTransaction.date).getFullYear();
    const month = (new Date(targetTransaction.date).getMonth() + 1)
      .toString()
      .padStart(2, '0');

    const dateQuery = `${year}-${month}`;
    await page.goto(`/statistics/expenses?date=${dateQuery}&page=1`);

    await page.getByTestId(targetTransaction.id).click();
    await page.getByTestId('edit-expense-button').click();
    await page.getByTestId('delete-transaction').click();
    await page.getByTestId('delete-transaction-confirm').click();

    await expect(page).not.toHaveURL(`/${targetTransaction.id}`);

    await page.goto(`/statistics/expenses?date=${dateQuery}&page=1`);

    await expect(page.getByTestId(targetTransaction.id)).toBeHidden();

    await page.goto(`/accounts/${targetAccountId}`);

    const accountBalanceAfter = (await page
      .getByTestId('account-balance')
      .textContent()) as string;

    const balanceBefore = parseFloat(
      accountBalanceBefore.replace(/[^0-9,-]+/g, '').replace(',', '.'),
    );
    const balanceAfter = parseFloat(
      accountBalanceAfter.replace(/[^0-9,-]+/g, '').replace(',', '.'),
    );

    expect(balanceBefore - targetTransaction.amount).toBe(balanceAfter);
  });
});
