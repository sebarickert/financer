import {
  AccountDto,
  ExpenseListItemDto,
  TransactionListItemDto,
} from '$types/generated/financer';
import {
  getAllTransactions,
  getAccount,
  MINUTE_IN_MS,
  formatDate,
  getAccountFromTransactionListItem,
  roundToTwoDecimal,
  getAllExpenses,
} from '$utils/api-helper';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Add Expense', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('large');
    await page.goto('/statistics/expenses');
  });

  const newTransactionAmountStr = '15.50';
  const newTransactionAmount = parseFloat(newTransactionAmountStr);
  const getNewTransactionName = () =>
    `new dummy transaction created by test code ${Math.random()}`;

  const verifyAccountBalanceChange = async (
    amount: number,
    accountBefore: AccountDto,
    accountAfter: AccountDto,
  ) => {
    expect(roundToTwoDecimal(accountBefore.balance - amount)).toEqual(
      roundToTwoDecimal(accountAfter.balance),
    );
  };

  const verifyNewExpenseCreated = async (
    expensesBefore: ExpenseListItemDto[],
    expensesAfter: ExpenseListItemDto[],
  ) => {
    expect(expensesAfter.length).toEqual(expensesBefore.length + 1);
  };

  // eslint-disable-next-line playwright/expect-expect
  test('should add a new expense and verify account balance and expense list', async ({
    page,
  }) => {
    const newTransactionName = getNewTransactionName();

    const initialTransactions = await getAllTransactions();
    const initialExpenses = await getAllExpenses();

    const targetTransaction = initialTransactions.at(
      -1,
    ) as TransactionListItemDto;

    const targetTransactionAccountId =
      await getAccountFromTransactionListItem(targetTransaction);

    const accountBefore = await getAccount(targetTransactionAccountId);

    const newTransactionDate = new Date(
      new Date(targetTransaction.date).getTime() + MINUTE_IN_MS,
    );

    await page.getByTestId('add-transaction').click();

    const drawer = page.getByTestId('add-transaction-drawer');
    await drawer.locator('#description').fill(newTransactionName);
    await drawer.locator('#date').fill(formatDate(newTransactionDate));
    await drawer.locator('#amount').fill(newTransactionAmountStr);
    await drawer
      .locator('#fromAccount')
      .selectOption(targetTransactionAccountId);
    await drawer.getByTestId('submit').click();

    await page.getByTestId('popper-button').click();
    await page.getByTestId('popper-container').getByText('Edit').click();

    const accountAfter = await getAccount(targetTransactionAccountId);
    const expensesAfter = await getAllExpenses();

    await verifyAccountBalanceChange(
      newTransactionAmount,
      accountBefore,
      accountAfter,
    );
    await verifyNewExpenseCreated(initialExpenses, expensesAfter);
  });

  // eslint-disable-next-line playwright/expect-expect
  test('should add a second newest expense and verify account balance and expense list', async ({
    page,
  }) => {
    const newTransactionName = getNewTransactionName();

    const initialTransactions = await getAllTransactions();
    const initialExpenses = await getAllExpenses();

    const targetTransaction = initialTransactions.at(
      -1,
    ) as TransactionListItemDto;

    const targetTransactionAccountId =
      await getAccountFromTransactionListItem(targetTransaction);

    const newTransactionDate = new Date(
      new Date(targetTransaction.date).getTime() - MINUTE_IN_MS,
    );

    const accountBefore = await getAccount(targetTransactionAccountId);

    await page.getByTestId('add-transaction').click();

    const drawer = page.getByTestId('add-transaction-drawer');
    await drawer.locator('#description').fill(newTransactionName);
    await drawer.locator('#date').fill(formatDate(newTransactionDate));
    await drawer.locator('#amount').fill(newTransactionAmountStr);
    await drawer
      .locator('#fromAccount')
      .selectOption(targetTransactionAccountId);
    await drawer.getByTestId('submit').click();

    await page.getByTestId('popper-button').click();
    await page.getByTestId('popper-container').getByText('Edit').click();

    const accountAfter = await getAccount(targetTransactionAccountId);
    const expensesAfter = await getAllExpenses();

    await verifyAccountBalanceChange(
      newTransactionAmount,
      accountBefore,
      accountAfter,
    );
    await verifyNewExpenseCreated(initialExpenses, expensesAfter);
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add oldest expense', async ({ page }) => {
    const newTransactionName = getNewTransactionName();

    const initialTransactions = await getAllTransactions();
    const initialExpenses = await getAllExpenses();

    const targetTransaction = initialTransactions.at(
      0,
    ) as TransactionListItemDto;

    const targetTransactionAccountId =
      await getAccountFromTransactionListItem(targetTransaction);

    const newTransactionDate = new Date(
      new Date(targetTransaction.date).getTime() - MINUTE_IN_MS,
    );

    const accountBefore = await getAccount(targetTransactionAccountId);

    await page.getByTestId('add-transaction').click();

    const drawer = page.getByTestId('add-transaction-drawer');
    await drawer.locator('#description').fill(newTransactionName);
    await drawer.locator('#date').fill(formatDate(newTransactionDate));
    await drawer.locator('#amount').fill(newTransactionAmountStr);
    await drawer
      .locator('#fromAccount')
      .selectOption(targetTransactionAccountId);
    await drawer.getByTestId('submit').click();

    await page.getByTestId('popper-button').click();
    await page.getByTestId('popper-container').getByText('Edit').click();

    const accountAfter = await getAccount(targetTransactionAccountId);
    const expensesAfter = await getAllExpenses();

    await verifyAccountBalanceChange(
      newTransactionAmount,
      accountBefore,
      accountAfter,
    );
    await verifyNewExpenseCreated(initialExpenses, expensesAfter);
  });

  test('should add a new expense and verify the date is correct', async ({
    page,
  }) => {
    const newTransactionName = getNewTransactionName();

    const initialTransactions = await getAllTransactions();
    const targetTransaction = initialTransactions.at(
      -1,
    ) as TransactionListItemDto;
    const targetTransactionAccountId =
      await getAccountFromTransactionListItem(targetTransaction);

    const date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);

    await page.getByTestId('add-transaction').click();

    const drawer = page.getByTestId('add-transaction-drawer');
    await drawer.locator('#description').fill(newTransactionName);
    await drawer.locator('#date').fill(formatDate(date));
    await drawer.locator('#amount').fill(newTransactionAmountStr);
    await drawer
      .locator('#fromAccount')
      .selectOption(targetTransactionAccountId);
    await drawer.getByTestId('submit').click();

    await page.getByText(newTransactionName).click();
    await page.getByTestId('popper-button').click();
    await page.getByTestId('popper-container').getByText('Edit').click();

    const inputValue = await page
      .getByTestId('edit-expense-form')
      .locator('#date')
      .inputValue();
    expect(date.toISOString()).toEqual(new Date(inputValue).toISOString());
  });
});
