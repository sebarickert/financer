import { TransactionType } from '$types/generated/financer';
import { Page } from '$utils/financer-page';

const capitalize = (string: string): string =>
  string.charAt(0).toUpperCase() + string.slice(1);

const getCheckedOption = async (page: Page): Promise<TransactionType> => {
  return page.evaluate(() => {
    const checked = document.querySelector(
      '[data-testid="transaction-type-switcher"] input[type="radio"]:checked',
    ) as HTMLInputElement;

    return checked.value;
  }) as unknown as TransactionType;
};

export const switchTransactionType = async (
  page: Page,
  transactionType: TransactionType = TransactionType.Expense,
) => {
  const checkedOption = await getCheckedOption(page);

  if (checkedOption === transactionType) {
    return;
  }

  await page
    .getByTestId('transaction-drawer')
    .getByTestId('transaction-type-switcher')
    .getByLabel(capitalize(checkedOption.toLowerCase()), { exact: true })
    .focus();

  if (transactionType === TransactionType.Income) {
    if (checkedOption === TransactionType.Expense) {
      await page.keyboard.press('ArrowLeft');
    }

    if (checkedOption === TransactionType.Transfer) {
      await page.keyboard.press('ArrowRight');
    }
  }

  if (transactionType === TransactionType.Expense) {
    if (checkedOption === TransactionType.Income) {
      await page.keyboard.press('ArrowRight');
    }

    if (checkedOption === TransactionType.Transfer) {
      await page.keyboard.press('ArrowLeft');
    }
  }

  if (transactionType === TransactionType.Transfer) {
    if (checkedOption === TransactionType.Income) {
      await page.keyboard.press('ArrowLeft');
    }

    if (checkedOption === TransactionType.Expense) {
      await page.keyboard.press('ArrowRight');
    }
  }
};
