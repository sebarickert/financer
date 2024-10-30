import { IncomeListItemDto } from '$types/generated/financer';
import {
  getAllIncomes,
  getAccountFromTransactionListItem,
} from '$utils/api-helper';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Delete income', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('large');
    await page.goto('/statistics/incomes');
  });

  test('should delete the latest income and verify that account balance has changed and the transaction does not exist anymore', async ({
    page,
  }) => {
    const incomes = await getAllIncomes();

    const targetTransaction = incomes.at(-1) as IncomeListItemDto;

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
    await page.goto(`/statistics/incomes?date=${dateQuery}&page=1`);

    await page.getByTestId(targetTransaction.id).click();
    await page.getByTestId('popper-button').click();
    await page
      .getByTestId('popper-container')
      .getByRole('button', { name: 'Delete' })
      .click();

    await page
      .getByTestId('drawer')
      .getByRole('button', { name: 'Delete' })
      .click();

    await expect(page).not.toHaveURL(`/${targetTransaction.id}`);

    await page.goto(`/statistics/incomes?date=${dateQuery}&page=1`);

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

  test('should delete the oldest income and verify that account balance has changed and the transaction does not exist anymore', async ({
    page,
  }) => {
    const incomes = await getAllIncomes();

    const targetTransaction = incomes.at(0) as IncomeListItemDto;

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
    await page.goto(`/statistics/incomes?date=${dateQuery}&page=1`);

    await page.getByTestId(targetTransaction.id).click();
    await page.getByTestId('popper-button').click();
    await page
      .getByTestId('popper-container')
      .getByRole('button', { name: 'Delete' })
      .click();

    await page
      .getByTestId('drawer')
      .getByRole('button', { name: 'Delete' })
      .click();

    await expect(page).not.toHaveURL(`/${targetTransaction.id}`);

    await page.goto(`/statistics/incomes?date=${dateQuery}&page=1`);

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
